import { useState } from "react";
import { TailwindButton } from "./TailwindButton";

export function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleOpenFile = async () => {
    const url = await window.electronAPI.openVideo();
    if (url) {
      setVideoSrc(url);
    }
  };

  return (
    <div className="flex flex-col align-start mt-2">
      <TailwindButton
        variant="gradient-purple-pink"
        onClick={() => void handleOpenFile()}
      >
        Open video
      </TailwindButton>

      {videoSrc && (
        <video src={videoSrc} controls className="mt-4 block max-w-full" />
      )}
    </div>
  );
}
