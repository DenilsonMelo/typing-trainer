import type { BestScore } from "./typing-reducer";

const STORAGE_KEY = "typing_trainer_best_scores";

export function loadBestScores(): Record<number, BestScore> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<number, BestScore> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const id = Number(k);
      if (!Number.isFinite(id)) continue;
      if (v && typeof v === "object") {
        const entry = v as { wpm?: unknown; accuracy?: unknown };
        if (typeof entry.wpm === "number" && typeof entry.accuracy === "number") {
          out[id] = { wpm: entry.wpm, accuracy: entry.accuracy };
        }
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveBestScores(scores: Record<number, BestScore>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // ignore quota / serialization errors
  }
}
