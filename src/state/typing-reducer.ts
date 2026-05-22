import type { CellState } from "../types";

export type BestScore = { wpm: number; accuracy: number };

export type State = {
  text: string;
  pos: number;
  states: CellState[];
  totalKeystrokes: number;
  totalErrors: number;
  startTime: number | null;
  finished: boolean;
  elapsed: number;
  errorFlash: string | null;
  bestScores: Record<number, BestScore>;
  lastWasRecord: boolean;
  lastCorrect?: boolean;
  lastExpected?: string | null;
};

export type Action =
  | { type: "INIT"; text: string }
  | { type: "TYPE_CHAR"; char: string; time: number; levelId: number }
  | { type: "BACKSPACE" }
  | { type: "TICK"; now: number }
  | { type: "CLEAR_ERROR_FLASH" };

export const initialState: State = {
  text: "", pos: 0, states: [], totalKeystrokes: 0, totalErrors: 0,
  startTime: null, finished: false,
  elapsed: 0, errorFlash: null, bestScores: {}, lastWasRecord: false,
};

export function typingReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT": {
      const t = action.text;
      return {
        ...state,
        text: t, pos: 0, states: new Array(t.length).fill(null),
        totalKeystrokes: 0, totalErrors: 0, startTime: null, finished: false,
        elapsed: 0, errorFlash: null, lastWasRecord: false,
      };
    }
    case "TYPE_CHAR": {
      if (state.finished || state.pos >= state.text.length) return state;
      const expected = state.text[state.pos];
      const isCorrect = action.char === expected;
      const newStates = [...state.states];
      newStates[state.pos] = isCorrect ? "correct" : "wrong";
      const newPos = state.pos + 1;
      const now = action.time;
      const startTime = state.startTime || now;
      const finished = newPos >= state.text.length;
      const newTotalKeystrokes = state.totalKeystrokes + 1;
      const newTotalErrors = state.totalErrors + (isCorrect ? 0 : 1);
      let elapsed = state.elapsed;
      let bestScores = state.bestScores;
      let lastWasRecord = state.lastWasRecord;
      if (finished) {
        elapsed = Math.max(1, Math.floor((now - startTime) / 1000));
        const netCorrect = newTotalKeystrokes - newTotalErrors;
        const fw = elapsed > 0 ? Math.round((netCorrect / 5) / (elapsed / 60)) : 0;
        const accuracy = newTotalKeystrokes > 0 ? Math.round((netCorrect / newTotalKeystrokes) * 100) : 100;
        const prev = state.bestScores[action.levelId];
        const isRecord = accuracy >= 90 && fw > (prev?.wpm ?? 0);
        if (isRecord) {
          bestScores = { ...state.bestScores, [action.levelId]: { wpm: fw, accuracy } };
        }
        lastWasRecord = isRecord;
      }
      return {
        ...state,
        pos: newPos,
        states: newStates,
        totalKeystrokes: newTotalKeystrokes,
        totalErrors: newTotalErrors,
        startTime,
        finished,
        lastCorrect: isCorrect,
        lastExpected: isCorrect ? null : expected,
        errorFlash: isCorrect ? null : expected,
        elapsed,
        bestScores,
        lastWasRecord,
      };
    }
    case "BACKSPACE": {
      if (state.finished || state.pos <= 0) return state;
      const prev = state.pos - 1;
      const newStates = [...state.states];
      newStates[prev] = null;
      return {
        ...state,
        pos: prev,
        states: newStates,
        lastExpected: null,
        errorFlash: null,
      };
    }
    case "TICK":
      if (!state.startTime || state.finished) return state;
      return { ...state, elapsed: Math.floor((action.now - state.startTime) / 1000) };
    case "CLEAR_ERROR_FLASH":
      return { ...state, errorFlash: null };
    default:
      return state;
  }
}
