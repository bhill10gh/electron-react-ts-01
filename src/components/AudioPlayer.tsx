import { TailwindButton } from "./TailwindButton";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAudioUrl } from "../store/slices/appSlice";
import { useRef } from "react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dispatch = useAppDispatch();
  const audioUrlFromStore = useAppSelector((state) => state.app.audioUrl);

  const handleOpenAndPlay = async () => {
    const url = await window.electronAPI.openAudioFile();
    if (!url) return;
    void dispatch(setAudioUrl(url));

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

      {audioUrlFromStore && (
        <audio
          ref={audioRef}
          src={audioUrlFromStore}
          controls
          style={{ display: "block", marginTop: "1rem" }}
        />
      )}
    </div>
  );
}
