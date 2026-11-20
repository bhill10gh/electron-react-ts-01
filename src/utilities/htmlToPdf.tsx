import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";

export interface HtmlToPdfOptions {
  fileName?: string;
  title?: string;
  pageSize?: "letter" | "legal" | "a4";
  orientation?: "portrait" | "landscape";
  margin?: number;
  showPageNumbers?: boolean;
}

const PAGE_SIZES = {
  letter: { width: 816, height: 1056 },
  legal: { width: 816, height: 1344 },
  a4: { width: 794, height: 1123 },
};

function isFullHtmlDocument(html: string): boolean {
  return /^\s*<!DOCTYPE/i.test(html) || /^\s*<html[\s>]/i.test(html);
}

/** Div.innerHTML cannot parse a full document; use body markup for layout. */
function htmlForFragmentContainer(html: string): string {
  if (!isFullHtmlDocument(html)) {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const inlineStyles = Array.from(doc.head.querySelectorAll("style"))
    .map((style) => style.outerHTML)
    .join("\n");

  return `${inlineStyles}\n${doc.body.innerHTML}`;
}

function isValidPngDataUrl(dataUrl: string): boolean {
  return (
    dataUrl.startsWith("data:image/png") &&
    dataUrl.includes("base64,") &&
    dataUrl.length > 50
  );
}

function getPaginationRoots(container: HTMLElement): HTMLElement[] {
  let nodes = Array.from(container.children).filter(
    (el) => (el as HTMLElement).tagName !== "STYLE",
  ) as HTMLElement[];

  while (
    nodes.length === 1 &&
    nodes[0].tagName === "DIV" &&
    nodes[0].children.length > 0 &&
    !nodes[0].classList.contains("pdf-page-break")
  ) {
    nodes = Array.from(nodes[0].children).filter(
      (el) => (el as HTMLElement).tagName !== "STYLE",
    ) as HTMLElement[];
  }

  return nodes;
}

function measureBlock(
  element: HTMLElement,
  container: HTMLElement,
  contentWidth: number,
): number {
  const measurement = document.createElement("div");
  measurement.style.width = `${contentWidth}px`;
  const clone = element.cloneNode(true) as HTMLElement;
  measurement.appendChild(clone);
  container.appendChild(measurement);
  const height = clone.getBoundingClientRect().height;
  container.removeChild(measurement);
  return height;
}

async function capturePageAsPng(pageElement: HTMLElement): Promise<string> {
  const canvas = await toCanvas(pageElement, {
    pixelRatio: 1,
    backgroundColor: "#ffffff",
    cacheBust: true,
  });

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error("PDF page capture produced an empty canvas");
  }

  const dataUrl = canvas.toDataURL("image/png");
  if (!isValidPngDataUrl(dataUrl)) {
    throw new Error("PDF page capture did not produce valid PNG data");
  }

  return dataUrl;
}

export async function htmlToPdf(
  html: string,
  options: HtmlToPdfOptions = {},
): Promise<void> {
  const {
    fileName = "document.pdf",
    title = "",
    pageSize = "letter",
    orientation = "portrait",
    margin = 48,
    showPageNumbers = true,
  } = options;

  const size = PAGE_SIZES[pageSize];

  const pageWidth = orientation === "portrait" ? size.width : size.height;

  const pageHeight = orientation === "portrait" ? size.height : size.width;

  const headerHeight = 45;
  const footerHeight = showPageNumbers ? 30 : 0;

  const contentHeight = pageHeight - margin * 2 - headerHeight - footerHeight;

  const pdfWidth = (pageWidth / 96) * 72;
  const pdfHeight = (pageHeight / 96) * 72;

  const container = document.createElement("div");

  Object.assign(container.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    width: `${pageWidth - margin * 2}px`,
    background: "#ffffff",
    color: "#222222",
    fontFamily: "Arial, sans-serif",
  });

  container.innerHTML = htmlForFragmentContainer(html);

  document.body.appendChild(container);

  const captureHost = document.createElement("div");
  Object.assign(captureHost.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    zIndex: "-1",
  });
  document.body.appendChild(captureHost);

  try {
    await document.fonts.ready;

    const images = Array.from(container.querySelectorAll("img"));

    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }),
    );

    const pages: HTMLElement[] = [];

    let currentHeight = 0;

    const createPage = () => {
      const page = document.createElement("div");

      Object.assign(page.style, {
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        padding: `${margin}px`,
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#222222",
        overflow: "hidden",
        position: "relative",
      });

      const header = document.createElement("div");

      header.style.height = `${headerHeight}px`;
      header.style.borderBottom = "1px solid #ccc";
      header.style.marginBottom = "20px";
      header.textContent = title;

      const content = document.createElement("div");

      content.style.height = `${contentHeight}px`;
      content.style.overflow = "hidden";

      page.appendChild(header);
      page.appendChild(content);

      if (showPageNumbers) {
        const footer = document.createElement("div");

        Object.assign(footer.style, {
          position: "absolute",
          bottom: `${margin / 2}px`,
          left: `${margin}px`,
          right: `${margin}px`,
          borderTop: "1px solid #ccc",
          paddingTop: "6px",
          fontSize: "11px",
          textAlign: "right",
        });

        footer.className = "pdf-footer";

        page.appendChild(footer);
      }

      return { page, content };
    };

    let { page, content } = createPage();

    const finishPage = () => {
      pages.push(page);

      ({ page, content } = createPage());

      currentHeight = 0;
    };

    const contentWidth = pageWidth - margin * 2;

    const distribute = (elements: HTMLElement[]): void => {
      for (const htmlElement of elements) {
        if (htmlElement.classList.contains("pdf-page-break")) {
          if (currentHeight > 0) {
            finishPage();
          }
          continue;
        }

        const childBlocks = Array.from(htmlElement.children).filter(
          (el) => (el as HTMLElement).tagName !== "STYLE",
        ) as HTMLElement[];

        const elementHeight = measureBlock(
          htmlElement,
          container,
          contentWidth,
        );

        const shouldUnwrap =
          elementHeight > contentHeight &&
          childBlocks.length > 0 &&
          htmlElement.tagName !== "TABLE";

        if (shouldUnwrap) {
          distribute(childBlocks);
          continue;
        }

        if (
          currentHeight + elementHeight > contentHeight &&
          currentHeight > 0
        ) {
          finishPage();
        }

        content.appendChild(htmlElement.cloneNode(true) as HTMLElement);
        currentHeight += elementHeight;

        if (elementHeight >= contentHeight) {
          finishPage();
        }
      }
    };

    distribute(getPaginationRoots(container));

    if (content.children.length > 0) {
      pages.push(page);
    }

    const pagesWithContent = pages.filter((p) => {
      const contentArea = p.children[1] as HTMLElement | undefined;
      return (contentArea?.children.length ?? 0) > 0;
    });

    if (pagesWithContent.length === 0) {
      throw new Error("No content to render in PDF");
    }

    const pdf = new jsPDF({
      orientation,
      unit: "pt",
      format: pageSize,
    });

    for (let i = 0; i < pagesWithContent.length; i++) {
      const pageEl = pagesWithContent[i];
      const footer = pageEl.querySelector(".pdf-footer");

      if (footer) {
        footer.textContent = `Page ${i + 1} of ${pagesWithContent.length}`;
      }

      captureHost.appendChild(pageEl);

      try {
        const image = await capturePageAsPng(pageEl);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
      } finally {
        captureHost.removeChild(pageEl);
      }
    }

    pdf.save(fileName);
  } finally {
    captureHost.remove();
    document.body.removeChild(container);
  }
}
