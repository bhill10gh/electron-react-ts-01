import { useCallback, useEffect, useState } from "react";
import { TailwindButton } from "./TailwindButton";

const CSS_ZOOM_STORAGE_KEY = "page-zoom-percent";
const CSS_ZOOM_MIN = 50;
const CSS_ZOOM_MAX = 150;
const CSS_ZOOM_STEP = 10;

function clampCssPercent(percent: number): number {
  return Math.min(CSS_ZOOM_MAX, Math.max(CSS_ZOOM_MIN, percent));
}

function applyCssZoom(percent: number): number {
  const clamped = clampCssPercent(percent);
  document.documentElement.style.zoom = String(clamped / 100);
  localStorage.setItem(CSS_ZOOM_STORAGE_KEY, String(clamped));
  return clamped;
}

export function ZoomControls() {
  const [percent, setPercent] = useState(100);
  const useElectronZoom = Boolean(window.electronAPI?.zoomIn);

  const syncZoom = useCallback(async () => {
    if (useElectronZoom) {
      setPercent(await window.electronAPI.getZoomPercent());
      return;
    }

    const saved = Number(localStorage.getItem(CSS_ZOOM_STORAGE_KEY) ?? "100");
    const initial = Number.isFinite(saved) ? clampCssPercent(saved) : 100;
    setPercent(applyCssZoom(initial));
  }, [useElectronZoom]);

  useEffect(() => {
    void syncZoom();
  }, [syncZoom]);

  const zoomIn = async () => {
    if (useElectronZoom) {
      setPercent(await window.electronAPI.zoomIn());
      return;
    }
    setPercent(applyCssZoom(percent + CSS_ZOOM_STEP));
  };

  const zoomOut = async () => {
    if (useElectronZoom) {
      setPercent(await window.electronAPI.zoomOut());
      return;
    }
    setPercent(applyCssZoom(percent - CSS_ZOOM_STEP));
  };

  const zoomReset = async () => {
    if (useElectronZoom) {
      setPercent(await window.electronAPI.zoomReset());
      return;
    }
    setPercent(applyCssZoom(100));
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1"
      role="group"
      aria-label="Page zoom"
    >
      <TailwindButton
        type="button"
        variant="default"
        className="min-w-9 px-2"
        onClick={() => void zoomOut()}
        aria-label="Zoom out"
        title="Zoom out"
      >
        −
      </TailwindButton>
      <button
        type="button"
        className="min-w-[3.25rem] cursor-pointer rounded border border-transparent bg-transparent px-1 text-sm font-medium text-gray-700 hover:underline"
        onClick={() => void zoomReset()}
        title="Reset zoom to 100%"
        aria-label={`Zoom ${percent} percent, click to reset`}
      >
        {percent}%
      </button>
      <TailwindButton
        type="button"
        variant="default"
        className="min-w-9 px-2"
        onClick={() => void zoomIn()}
        aria-label="Zoom in"
        title="Zoom in"
      >
        +
      </TailwindButton>
    </div>
  );
}