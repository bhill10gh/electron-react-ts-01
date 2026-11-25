import { useState } from "react";
import SpyHunterGame from "../components/spyHunter/SpyHunterGame";
import Modal from "../components/Modal";
import { TailwindButton } from "../components/TailwindButton";

const SPY_HUNTER_CONTROLS = [
  { keys: "← / A", action: "Steer left" },
  { keys: "→ / D", action: "Steer right" },
  { keys: "Space", action: "Fire machine gun" },
  { keys: "X", action: "Drop oil slick" },
  { keys: "Enter", action: "Restart after game over" },
] as const;

export default function SpyHunter() {
  const [controlsOpen, setControlsOpen] = useState(true);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Spy Hunter</h1>
        <TailwindButton
          type="button"
          variant="default"
          onClick={() => setControlsOpen(true)}
        >
          Controls
        </TailwindButton>
      </div>

      <SpyHunterGame />

      <Modal
        isOpen={controlsOpen}
        title="Spy Hunter — Controls"
        onClose={() => setControlsOpen(false)}
        width="max-w-md"
      >
        <table className="w-full text-left text-sm text-gray-800">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 pr-4 font-semibold text-gray-900">Key</th>
              <th className="pb-2 font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {SPY_HUNTER_CONTROLS.map((row) => (
              <tr key={row.action} className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono font-medium text-gray-900">
                  {row.keys}
                </td>
                <td className="py-2.5 text-gray-700">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
}