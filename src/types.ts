export type KeyDef = { k: string; c: string; sub?: string };
export type CellState = "correct" | "wrong" | null;
export type Level = { id: number; name: string; desc: string; words: string[]; layer?: number };

export type Layer = {
  name: string;
  desc: string;
  holdKey?: string;
  left: KeyDef[][];
  right: KeyDef[][];
  thumbsLeft: KeyDef[];
  thumbsRight: KeyDef[];
};
