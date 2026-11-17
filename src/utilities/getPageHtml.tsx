export const getPageHtml = () => {
  const htmlContent = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "page-snapshot.html";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return htmlContent;
};

export type DownloadSelector = string | string[];

export function normalizeSelectors(selector: DownloadSelector): string[] {
  return Array.isArray(selector) ? selector : [selector];
}

function belongsInHead(element: Element): boolean {
  return (
    element.tagName === "HEAD" ||
    (document.head.contains(element) && element !== document.head)
  );
}

export function buildHtmlFromSelectors(
  selector: DownloadSelector,
  includeDocumentWrapper: boolean,
): string | null {
  const selectors = normalizeSelectors(selector);

  if (selectors.length === 1 && includeDocumentWrapper) {
    return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
  }

  const headFragments: string[] = [];
  const bodyFragments: string[] = [];
  const missing: string[] = [];

  for (const sel of selectors) {
    const element = document.querySelector(sel);
    if (!element) {
      missing.push(sel);
      continue;
    }

    if (belongsInHead(element)) {
      if (element.tagName === "HEAD") {
        headFragments.push(element.innerHTML);
      } else {
        headFragments.push(element.outerHTML);
      }
    } else {
      bodyFragments.push(element.outerHTML);
    }
  }

  if (missing.length > 0) {
    console.error(`No element found for selector(s): ${missing.join(", ")}`);
  }

  if (headFragments.length === 0 && bodyFragments.length === 0) {
    return null;
  }

  if (includeDocumentWrapper) {
    const headContent = headFragments.join("\n");
    const bodyContent = bodyFragments.join("\n");
    return `<!DOCTYPE html>\n<html><head><meta charset="utf-8">\n${headContent}\n</head><body>\n${bodyContent}\n</body></html>`;
  }

  const body = bodyFragments.length > 0
    ? bodyFragments.join("\n")
    : headFragments.join("\n");

  return `<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head><body>${body}</body></html>`;
}