import React, { useEffect, useRef, useState } from "react";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { PdfGeneratorProps, PdfPageData } from "./types";
import { paginateHtml } from "./PdfPaginator";
import { PdfPage } from "./PdfPage";

import "./PdfGenerator.css";

const PAGE_WIDTH = 816;
const PAGE_HEIGHT = 1056;

const PdfGenerator: React.FC<PdfGeneratorProps> = ({
  html = "",
  title = "Document",
  fileName = "document.pdf",
  orientation = "portrait",
  pageSize = "letter",
  showHeader = true,
  showFooter = true,
  showPageNumbers = true,
}) => {
  const measurementRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [ready, setReady] = useState(false);

  const pageWidth = orientation === "portrait" ? PAGE_WIDTH : PAGE_HEIGHT;

  const pageHeight = orientation === "portrait" ? PAGE_HEIGHT : PAGE_WIDTH;

  const padding = 48;

  const headerSpace = showHeader ? 65 : 0;
  const footerSpace = showFooter ? 45 : 0;

  const contentHeight = pageHeight - padding * 2 - headerSpace - footerSpace;

  useEffect(() => {
    const generatePages = async () => {
      if (!measurementRef.current) return;

      setReady(false);

      const container = measurementRef.current;

      container.innerHTML = html;

      await document.fonts.ready;

      const images = Array.from(container.querySelectorAll("img"));

      await Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve();

          return new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          });
        }),
      );

      const generatedPages = paginateHtml(html, container, contentHeight);

      setPages(generatedPages);
      setReady(true);
    };

    generatePages();
  }, [html, contentHeight]);

  const exportPdf = async () => {
    if (!ready) return;

    const pdf = new jsPDF({
      orientation,
      unit: "pt",
      format: pageSize,
    });

    const pageElements = document.querySelectorAll<HTMLElement>(".pdf-page");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pageElements.length; i++) {
      const image = await toPng(pageElements[i], {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(fileName);
  };

  return (
    <div>
      {/* Measurement container */}
      <div
        ref={measurementRef}
        style={{
          position: "absolute",
          left: "-10000px",
          top: 0,
          width: pageWidth - padding * 2,
          visibility: "hidden",
        }}
      />

      {/* PDF pages */}
      <div id="pdf-document">
        {pages.map((page) => (
          <PdfPage
            key={page.id}
            page={page}
            title={title}
            totalPages={pages.length}
            showHeader={showHeader}
            showFooter={showFooter}
            showPageNumbers={showPageNumbers}
          />
        ))}
      </div>

      <button type="button" disabled={!ready} onClick={exportPdf}>
        {ready ? "Export PDF" : "Preparing PDF..."}
      </button>
    </div>
  );
};

export default PdfGenerator;
