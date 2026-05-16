import type { KeyDef } from "../types";

/*
  Silakka54 — user's VIAL Layer 0:
  LEFT:  ESC 1 2 3 4 5 | TAB Q W E R T | CTRL A S D F G | SHFT Z X C V B | GUI SPC(L2) TAB(L1)
  RIGHT: 6 7 8 9 0 BKSP | Y U I O P \ | H J K L ; ' | N M , . / SHFT | ENT(L3) BKSP(L4) RALT
*/

export const KEYBOARD_LEFT: KeyDef[][] = [
  [{ k: "Esc", c: "" }, { k: "1", c: "1" }, { k: "2", c: "2" }, { k: "3", c: "3" }, { k: "4", c: "4" }, { k: "5", c: "5" }],
  [{ k: "Tab", c: "" }, { k: "Q", c: "q" }, { k: "W", c: "w" }, { k: "E", c: "e" }, { k: "R", c: "r" }, { k: "T", c: "t" }],
  [{ k: "Ctrl", c: "" }, { k: "A", c: "a" }, { k: "S", c: "s" }, { k: "D", c: "d" }, { k: "F", c: "f" }, { k: "G", c: "g" }],
  [{ k: "Shift", c: "" }, { k: "Z", c: "z" }, { k: "X", c: "x" }, { k: "C", c: "c" }, { k: "V", c: "v" }, { k: "B", c: "b" }],
];

export const KEYBOARD_RIGHT: KeyDef[][] = [
  [{ k: "6", c: "6" }, { k: "7", c: "7" }, { k: "8", c: "8" }, { k: "9", c: "9" }, { k: "0", c: "0" }, { k: "Bksp", c: "" }],
  [{ k: "Y", c: "y" }, { k: "U", c: "u" }, { k: "I", c: "i" }, { k: "O", c: "o" }, { k: "P", c: "p" }, { k: "\\", c: "\\" }],
  [{ k: "H", c: "h" }, { k: "J", c: "j" }, { k: "K", c: "k" }, { k: "L", c: "l" }, { k: ";", c: ";" }, { k: "'", c: "'" }],
  [{ k: "N", c: "n" }, { k: "M", c: "m" }, { k: ",", c: "," }, { k: ".", c: "." }, { k: "/", c: "/" }, { k: "Shift", c: "" }],
];

export const THUMBS_LEFT: KeyDef[] = [{ k: "GUI", c: "" }, { k: "SPC", c: " ", sub: "L2" }, { k: "Tab", c: "", sub: "L1" }];
export const THUMBS_RIGHT: KeyDef[] = [{ k: "Ent", c: "", sub: "L3" }, { k: "Bksp", c: "", sub: "L4" }, { k: "RAlt", c: "" }];

export const COL_OFFSETS = [0.5, 0.25, 0, 0.125, 0.25, 0.35];

export const FINGER_MAP: Record<string, string> = {
  "1": "pinky-l", "q": "pinky-l", "a": "pinky-l", "z": "pinky-l",
  "2": "ring-l", "w": "ring-l", "s": "ring-l", "x": "ring-l",
  "3": "mid-l", "e": "mid-l", "d": "mid-l", "c": "mid-l",
  "4": "index-l", "r": "index-l", "f": "index-l", "v": "index-l",
  "5": "index-l", "t": "index-l", "g": "index-l", "b": "index-l",
  "6": "index-r", "y": "index-r", "h": "index-r", "n": "index-r",
  "7": "index-r", "u": "index-r", "j": "index-r", "m": "index-r",
  "8": "mid-r", "i": "mid-r", "k": "mid-r", ",": "mid-r",
  "9": "ring-r", "o": "ring-r", "l": "ring-r", ".": "ring-r",
  "0": "pinky-r", "p": "pinky-r", ";": "pinky-r", "/": "pinky-r",
  "\\": "pinky-r", "'": "pinky-r", " ": "thumb-l",
};

export const FINGER_COLORS: Record<string, string> = {
  "pinky-l": "#ff6b81", "ring-l": "#ffa94d", "mid-l": "#69db7c",
  "index-l": "#74c0fc", "index-r": "#74c0fc", "mid-r": "#69db7c",
  "ring-r": "#ffa94d", "pinky-r": "#ff6b81", "thumb-l": "#b197fc", "thumb-r": "#b197fc",
};
