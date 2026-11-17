import type { ReactNode } from "react";
import { TailwindButton, type TailwindButtonVariant } from "./TailwindButton";
import {
  buildHtmlFromSelectors,
  DownloadSelector,
} from "../utilities/getPageHtml";

export interface DownloadHtmlBySelectorProps {
  /** One CSS selector, or several — matched nodes are combined in array order. */
  selector: DownloadSelector;
  filename: string;
  /** Full document: live page (one selector) or proper head/body split (several selectors). */
  includeDocumentWrapper?: boolean;
  variant?: TailwindButtonVariant;
  children?: ReactNode;
}

export function DownloadHtmlBySelector({
  selector,
  filename,
  includeDocumentWrapper = false,
  variant = "default",
  children = "Download HTML",
}: DownloadHtmlBySelectorProps) {
  const handleDownload = () => {
    const htmlContent = buildHtmlFromSelectors(
      selector,
      includeDocumentWrapper,
    );
    if (!htmlContent) {
      return;
    }

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <TailwindButton variant={variant} onClick={handleDownload}>
      {children}
    </TailwindButton>
  );
}
