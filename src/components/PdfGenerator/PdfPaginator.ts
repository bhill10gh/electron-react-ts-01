import { PdfPageData } from "./types";

export const paginateHtml = (
  html: string,
  container: HTMLElement,
  maxHeight: number,
): PdfPageData[] => {
  const template = document.createElement("div");
  template.innerHTML = html;

  const pages: PdfPageData[] = [];

  let currentPage = document.createElement("div");
  let currentHeight = 0;

  const finishPage = () => {
    if (currentPage.children.length > 0) {
      pages.push({
        id: pages.length + 1,
        html: currentPage.innerHTML,
      });
    }

    currentPage = document.createElement("div");
    currentHeight = 0;
  };

  const elements = Array.from(template.children);

  elements.forEach((element) => {
    const isPageBreak = element.classList.contains("pdf-page-break");

    if (isPageBreak) {
      finishPage();
      return;
    }

    const clone = element.cloneNode(true) as HTMLElement;

    container.appendChild(clone);

    const height = clone.getBoundingClientRect().height;

    container.removeChild(clone);

    // Start another page if necessary
    if (currentHeight + height > maxHeight && currentPage.children.length > 0) {
      finishPage();
    }

    currentPage.appendChild(element.cloneNode(true));

    currentHeight += height;
  });

  finishPage();

  return pages;
};
