import { useState } from "react";
import type { GameSettings } from "./gameSlice";
import {
  LEVEL_PRESETS,
  validateCustomSettings,
  type LevelPresetId,
} from "./gamePresets";
import styles from "./GameLevelSettings.module.css";

type Props = {
  preset: LevelPresetId;
  settings: GameSettings;
  onPresetChange: (preset: LevelPresetId, settings: GameSettings) => void;
};

const PRESET_LABELS: {
  id: Exclude<LevelPresetId, "custom">;
  title: string;
  detail: string;
}[] = [
  {
    id: "beginner",
    title: "Beginner",
    detail: "9×9 (81 cells), 10 mines",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    detail: "16×16 (256 cells), 40 mines",
  },
  {
    id: "expert",
    title: "Expert",
    detail: "30×16 (480 cells), 99 mines",
  },
];

export default function GameLevelSettings({
  preset,
  settings,
  onPresetChange,
}: Props) {
  const [customWidth, setCustomWidth] = useState(String(settings.width));
  const [customHeight, setCustomHeight] = useState(String(settings.height));
  const [customMines, setCustomMines] = useState(String(settings.minesCount));
  const [error, setError] = useState<string | null>(null);

  const selectPreset = (id: LevelPresetId) => {
    setError(null);
    if (id === "custom") {
      onPresetChange("custom", settings);
      return;
    }
    onPresetChange(id, LEVEL_PRESETS[id]);
  };

  const applyCustom = () => {
    const result = validateCustomSettings(
      Number(customWidth),
      Number(customHeight),
      Number(customMines),
    );
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    onPresetChange("custom", result.settings);
  };

  return (
    <div className={styles.panel}>
      <p className={styles.heading}>Game level</p>

      <div className={styles.options} role="radiogroup" aria-label="Game level">
        {PRESET_LABELS.map(({ id, title, detail }) => (
          <label key={id} className={styles.option}>
            <input
              type="radio"
              name="minesweeper-level"
              checked={preset === id}
              onChange={() => selectPreset(id)}
            />
            <span className={styles.optionLabel}>
              <span className={styles.optionTitle}>{title}</span>
              <span className={styles.optionDetail}>{detail}</span>
            </span>
          </label>
        ))}

        <label className={styles.option}>
          <input
            type="radio"
            name="minesweeper-level"
            checked={preset === "custom"}
            onChange={() => selectPreset("custom")}
          />
          <span className={styles.optionLabel}>
            <span className={styles.optionTitle}>Custom</span>
            <span className={styles.optionDetail}>Set width, height, and mines</span>
          </span>
        </label>
      </div>

      {preset === "custom" && (
        <div className={styles.customFields}>
          <label htmlFor="custom-width">Width</label>
          <input
            id="custom-width"
            type="number"
            min={8}
            max={30}
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
          />
          <label htmlFor="custom-height">Height</label>
          <input
            id="custom-height"
            type="number"
            min={8}
            max={24}
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
          />
          <label htmlFor="custom-mines">Mines</label>
          <input
            id="custom-mines"
            type="number"
            min={1}
            value={customMines}
            onChange={(e) => setCustomMines(e.target.value)}
          />
        </div>
      )}

      <div className={styles.actions}>
        {preset === "custom" && (
          <button type="button" className={styles.button} onClick={applyCustom}>
            Apply custom
          </button>
        )}
        <span className={styles.optionDetail}>
          Playing: {settings.width}×{settings.height}, {settings.minesCount} mines
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}