import { jsPDF } from "jspdf";
import { toCanvas } from "html-to-image";

function isFullHtmlDocument(html: string): boolean {
  return /^\s*<!DOCTYPE/i.test(html) || /^\s*<html[\s>]/i.test(html);
}

function waitForIframeLoad(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve, reject) => {
    iframe.onload = () => resolve();
    iframe.onerror = () => reject(new Error("Failed to load HTML in iframe"));
  });
}

async function waitForDocumentReady(doc: Document): Promise<void> {
  await new Promise<void>((resolve) => {
    const win = doc.defaultView;
    if (!win) {
      resolve();
      return;
    }
    if (doc.readyState === "complete") {
      resolve();
      return;
    }
    win.addEventListener("load", () => resolve(), { once: true });
  });

  const links = Array.from(
    doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  );
  await Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          if (link.sheet) {
            resolve();
            return;
          }
          link.addEventListener("load", () => resolve(), { once: true });
          link.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );

  await doc.fonts?.ready;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function sizeIframeToContent(
  iframe: HTMLIFrameElement,
  doc: Document,
  widthPx: number,
): void {
  const height = Math.max(
    doc.body.scrollHeight,
    doc.documentElement.scrollHeight,
    400,
  );
  iframe.style.width = `${widthPx}px`;
  iframe.style.height = `${height}px`;
  doc.body.style.margin = "0";
  doc.body.style.backgroundColor = "#ffffff";
}

export const generatePdf = (htmlInput: string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  doc.html(htmlInput, {
    callback: function (pdf) {
      pdf.save("raw-html.pdf");
    },
    x: 20,
    y: 20,
    width: 555,
    windowWidth: 800,
  });
};

export const createPdfFromHtml = async (
  html: string,
  fileName: string = "document.pdf",
): Promise<void> => {
  const captureWidth = 800;
  let captureTarget: HTMLElement;
  let iframe: HTMLIFrameElement | null = null;
  let container: HTMLDivElement | null = null;

  try {
    if (isFullHtmlDocument(html)) {
      iframe = document.createElement("iframe");
      iframe.setAttribute("title", "PDF capture");
      iframe.style.position = "fixed";
      iframe.style.left = "0";
      iframe.style.top = "0";
      iframe.style.width = `${captureWidth}px`;
      iframe.style.height = "400px";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.style.border = "none";
      iframe.style.zIndex = "-1";
      iframe.srcdoc = html;
      document.body.appendChild(iframe);

      await waitForIframeLoad(iframe);

      const doc = iframe.contentDocument;
      if (!doc?.body) {
        throw new Error("Could not read iframe document for PDF capture");
      }

      await waitForDocumentReady(doc);
      sizeIframeToContent(iframe, doc, captureWidth);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      captureTarget = doc.body;
    } else {
      container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = "0";
      container.style.width = `${captureWidth}px`;
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "20px";
      container.style.opacity = "0";
      container.style.pointerEvents = "none";
      container.style.zIndex = "-1";
      container.innerHTML = html;
      document.body.appendChild(container);
      captureTarget = container;
    }

    const canvas = await toCanvas(captureTarget, {
      width: captureWidth,
      pixelRatio: 1,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error(
        "Capture produced an empty image. The selected HTML may have no visible content.",
      );
    }

    const image = canvas.toDataURL("image/png");
    if (!image.startsWith("data:image/png")) {
      throw new Error("Failed to encode captured page as PNG");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(image, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(image, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } finally {
    iframe?.remove();
    container?.remove();
  }
};