import React, { useState } from "react";
import { sendHtmlToService } from "../services/htmlService";

interface PagePayload {
  html: string;
  url: string;
}

// Service function to send HTML to your backend
async function sendHtmlToService(payload: PagePayload): Promise<void> {
  const response = await fetch("https://your-api.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send HTML: ${response.statusText}`);
  }
}

export const PageCaptureButton: React.FC = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleCapture = async () => {
    setIsSending(true);
    try {
      // Grab the entire rendered DOM including <html>, <head>, and <body>
      const fullPageHtml: string = document.documentElement.outerHTML;

      await sendHtmlToService({
        html: fullPageHtml,
        url: window.location.href,
      });

      console.log("HTML sent successfully");
    } catch (error) {
      console.error("Error sending page HTML:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button onClick={handleCapture} disabled={isSending}>
      {isSending ? "Sending..." : "Send Page HTML"}
    </button>
  );
};
