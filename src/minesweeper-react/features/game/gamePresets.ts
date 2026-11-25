import type { GameSettings } from "./gameSlice";

export type LevelPresetId = "beginner" | "intermediate" | "expert" | "custom";

export const LEVEL_PRESETS: Record<
  Exclude<LevelPresetId, "custom">,
  GameSettings
> = {
  beginner: { width: 9, height: 9, minesCount: 10 },
  intermediate: { width: 16, height: 16, minesCount: 40 },
  expert: { width: 30, height: 16, minesCount: 99 },
};

export const CUSTOM_LIMITS = {
  width: { min: 8, max: 30 },
  height: { min: 8, max: 24 },
} as const;

export function validateCustomSettings(
  width: number,
  height: number,
  minesCount: number,
): { ok: true; settings: GameSettings } | { ok: false; message: string } {
  const w = Math.floor(width);
  const h = Math.floor(height);
  const mines = Math.floor(minesCount);
  const cells = w * h;

  if (
    w < CUSTOM_LIMITS.width.min ||
    w > CUSTOM_LIMITS.width.max ||
    h < CUSTOM_LIMITS.height.min ||
    h > CUSTOM_LIMITS.height.max
  ) {
    return {
      ok: false,
      message: `Grid must be ${CUSTOM_LIMITS.width.min}–${CUSTOM_LIMITS.width.max} wide and ${CUSTOM_LIMITS.height.min}–${CUSTOM_LIMITS.height.max} tall.`,
    };
  }

  if (mines < 1 || mines >= cells) {
    return {
      ok: false,
      message: `Mines must be between 1 and ${cells - 1} for this grid.`,
    };
  }

  return { ok: true, settings: { width: w, height: h, minesCount: mines } };
}