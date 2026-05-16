import type { CellState } from "../types";

export type State = {
  text: string;
  pos: number;
  states: CellState[];
  correct: number;
  wrong: number;
  startTime: number | null;
  finished: boolean;
  elapsed: number;
  errorFlash: string | null;
  bestWpm: Record<number, number>;
  lastCorrect?: boolean;
  lastExpected?: string | null;
};

export type Action =
  | { type: "INIT"; text: string }
  | { type: "TYPE_CHAR"; char: string; time: number; currentLevel: number }
  | { type: "BACKSPACE" }
  | { type: "TICK"; now: number }
  | { type: "CLEAR_ERROR_FLASH" };

export const initialState: State = {
  text: "", pos: 0, states: [], correct: 0, wrong: 0,
  startTime: null, finished: false,
  elapsed: 0, errorFlash: null, bestWpm: {},
};

export function typingReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT": {
      const t = action.text;
      return {
        ...state,
        text: t, pos: 0, states: new Array(t.length).fill(null),
        correct: 0, wrong: 0, startTime: null, finished: false,
        elapsed: 0, errorFlash: null,
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
      const newCorrect = state.correct + (isCorrect ? 1 : 0);
      let elapsed = state.elapsed;
      let bestWpm = state.bestWpm;
      if (finished) {
        elapsed = Math.max(1, Math.floor((now - startTime) / 1000));
        const fw = elapsed > 0 ? Math.round((newCorrect / 5) / (elapsed / 60)) : 0;
        bestWpm = { ...state.bestWpm, [action.currentLevel]: Math.max(state.bestWpm[action.currentLevel] || 0, fw) };
      }
      return {
        ...state,
        pos: newPos,
        states: newStates,
        correct: newCorrect,
        wrong: state.wrong + (isCorrect ? 0 : 1),
        startTime,
        finished,
        lastCorrect: isCorrect,
        lastExpected: isCorrect ? null : expected,
        errorFlash: isCorrect ? null : expected,
        elapsed,
        bestWpm,
      };
    }
    case "BACKSPACE": {
      if (state.finished || state.pos <= 0) return state;
      const prev = state.pos - 1;
      const prevWas = state.states[prev];
      const newStates = [...state.states];
      newStates[prev] = null;
      return {
        ...state,
        pos: prev,
        states: newStates,
        correct: state.correct - (prevWas === "correct" ? 1 : 0),
        wrong: state.wrong - (prevWas === "wrong" ? 1 : 0),
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
