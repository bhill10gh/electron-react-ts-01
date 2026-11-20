import React from "react";
import { PdfPageData } from "./types";

interface Props {
  page: PdfPageData;
  title: string;
  totalPages: number;
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
}

export const PdfPage: React.FC<Props> = ({
  page,
  title,
  totalPages,
  showHeader,
  showFooter,
  showPageNumbers,
}) => {
  return (
    <div className="pdf-page">
      {showHeader && (
        <div className="pdf-header">
          <strong>{title}</strong>
        </div>
      )}

      <div
        className="pdf-content"
        dangerouslySetInnerHTML={{
          __html: page.html,
        }}
      />

      {showFooter && (
        <div className="pdf-footer">
          <span>{title}</span>

          {showPageNumbers && (
            <span>
              Page {page.id} of {totalPages}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
