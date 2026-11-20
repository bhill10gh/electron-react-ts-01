import { TailwindButton } from "./TailwindButton";

import { setVideoUrl } from "../store/slices/appSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function VideoPlayer() {
  const dispatch = useAppDispatch();
  const videoUrlFromStore = useAppSelector((state) => state.app.videoUrl);

  const handleOpenFile = async () => {
    const url = await window.electronAPI.openVideo();
    if (url) {
      void dispatch(setVideoUrl(url));
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

      {videoUrlFromStore && (
        <video
          src={videoUrlFromStore}
          controls
          className="mt-4 block max-w-full"
        />
      )}
    </div>
  );
}
