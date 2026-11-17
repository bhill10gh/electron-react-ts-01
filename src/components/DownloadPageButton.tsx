import React from "react";

export const DownloadPageButton: React.FC = () => {
  const handleDownloadHtml = () => {
    // 1. Get the full HTML of the current rendered page
    const htmlContent = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;

    // 2. Create a Blob with the HTML content and proper MIME type
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });

    // 3. Create a temporary object URL and anchor element to trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "page-snapshot.html";

    // 4. Append, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownloadHtml} type="button">
      Download Page HTML
    </button>
  );
};
