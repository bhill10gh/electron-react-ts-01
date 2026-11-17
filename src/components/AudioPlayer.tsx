import React, { useRef, useState } from "react";
import { TailwindButton } from "./TailwindButton";

export function AudioPlayer() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpenAndPlay = async () => {
    const url = await window.electronAPI.openAudioFile();
    if (!url) return;

    setAudioUrl(url);

    // Wait a tick for React to update the <audio> src, then play
    setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    }, 0);
  };

  return (
    <div className="flex flex-col align-start mt-2">
      <TailwindButton variant="gradient-cyan-blue" onClick={handleOpenAndPlay}>
        Open & Play Audio
      </TailwindButton>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          controls
          style={{ display: "block", marginTop: "1rem" }}
        />
      )}
    </div>
  );
}
