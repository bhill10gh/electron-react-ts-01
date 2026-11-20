export interface PdfGeneratorProps {
  html: string;
  title?: string;
  fileName?: string;

  orientation?: "portrait" | "landscape";

  pageSize?: "letter" | "legal" | "a4";

  showHeader?: boolean;
  showFooter?: boolean;
  showPageNumbers?: boolean;
}

export interface PdfPageData {
  id: number;
  html: string;
}
