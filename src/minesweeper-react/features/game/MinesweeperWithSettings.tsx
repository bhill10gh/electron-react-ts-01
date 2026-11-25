import { useState } from "react";
import Game from "./Game";
import GameLevelSettings from "./GameLevelSettings";
import { LEVEL_PRESETS, type LevelPresetId } from "./gamePresets";
import type { GameSettings } from "./gameSlice";

export default function MinesweeperWithSettings() {
  const [preset, setPreset] = useState<LevelPresetId>("beginner");
  const [settings, setSettings] = useState<GameSettings>(LEVEL_PRESETS.beginner);

  const handlePresetChange = (
    nextPreset: LevelPresetId,
    nextSettings: GameSettings,
  ) => {
    setPreset(nextPreset);
    setSettings(nextSettings);
  };

  return (
    <>
      <GameLevelSettings
        preset={preset}
        settings={settings}
        onPresetChange={handlePresetChange}
      />
      <Game settings={settings} />
    </>
  );
}