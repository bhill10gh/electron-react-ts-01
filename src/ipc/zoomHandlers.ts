import { app, BrowserWindow, ipcMain, type WebContents } from "electron";
import fs from "node:fs";
import path from "node:path";

const ZOOM_FACTOR_MIN = 0.5;
const ZOOM_FACTOR_MAX = 1.5;
const ZOOM_FACTOR_STEP = 0.1;

function activeWebContents() {
  const win =
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  return win?.webContents;
}

function zoomPercent(webContents: WebContents): number {
  return Math.round(webContents.getZoomFactor() * 100);
}

function zoomSettingsPath(): string {
  return path.join(app.getPath("userData"), "page-zoom.json");
}

function loadZoomFactor(): number {
  try {
    const raw = fs.readFileSync(zoomSettingsPath(), "utf8");
    const parsed = JSON.parse(raw) as { factor?: number };
    if (typeof parsed.factor === "number") {
      return Math.min(
        ZOOM_FACTOR_MAX,
        Math.max(ZOOM_FACTOR_MIN, parsed.factor),
      );
    }
  } catch {
    // Use default zoom when no saved settings exist.
  }
  return 1;
}

function saveZoomFactor(factor: number): void {
  fs.mkdirSync(app.getPath("userData"), { recursive: true });
  fs.writeFileSync(zoomSettingsPath(), JSON.stringify({ factor }), "utf8");
}

function clampFactor(factor: number): number {
  return Math.min(ZOOM_FACTOR_MAX, Math.max(ZOOM_FACTOR_MIN, factor));
}

function applyZoomFactor(webContents: WebContents, factor: number): number {
  const clamped = clampFactor(factor);
  webContents.setZoomFactor(clamped);
  saveZoomFactor(clamped);
  return zoomPercent(webContents);
}

function installHandler(
  channel: string,
  handler: Parameters<typeof ipcMain.handle>[1],
): void {
  ipcMain.removeHandler(channel);
  ipcMain.handle(channel, handler);
}

/** Restores saved zoom on a new BrowserWindow (all routes share this zoom). */
export function applySavedZoomToWindow(window: BrowserWindow): void {
  window.webContents.setZoomFactor(loadZoomFactor());
}

/** Window-level zoom (all pages); safe to call again after main-process hot reload. */
export function registerZoomHandlers(): void {
  installHandler("zoom:getPercent", () => {
    const wc = activeWebContents();
    return wc ? zoomPercent(wc) : Math.round(loadZoomFactor() * 100);
  });

  installHandler("zoom:in", () => {
    const wc = activeWebContents();
    if (!wc) {
      return 100;
    }
    return applyZoomFactor(wc, wc.getZoomFactor() + ZOOM_FACTOR_STEP);
  });

  installHandler("zoom:out", () => {
    const wc = activeWebContents();
    if (!wc) {
      return 100;
    }
    return applyZoomFactor(wc, wc.getZoomFactor() - ZOOM_FACTOR_STEP);
  });

  installHandler("zoom:reset", () => {
    const wc = activeWebContents();
    if (!wc) {
      return 100;
    }
    return applyZoomFactor(wc, 1);
  });
}