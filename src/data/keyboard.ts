import type { Layer } from "../types";

/*
  Silakka54 — user's VIAL Layer 0:
  LEFT:  ESC 1 2 3 4 5 | TAB Q W E R T | CTRL A S D F G | SHFT Z X C V B | GUI SPC(L2) TAB(L1)
  RIGHT: 6 7 8 9 0 BKSP | Y U I O P \ | H J K L ; ' | N M , . / SHFT | ENT(L3) BKSP(L4) RALT

  Layers extraídas de VIAL.vil. Para o lado direito, os arrays do VIAL vêm
  com colunas invertidas (matriz interna→externa); aqui já estão no order de display.
*/

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

export const LAYERS: Layer[] = [
  {
    name: "L0",
    desc: "QWERTY",
    left: [
      [{ k: "Esc", c: "" }, { k: "1", c: "1" }, { k: "2", c: "2" }, { k: "3", c: "3" }, { k: "4", c: "4" }, { k: "5", c: "5" }],
      [{ k: "Tab", c: "" }, { k: "Q", c: "q" }, { k: "W", c: "w" }, { k: "E", c: "e" }, { k: "R", c: "r" }, { k: "T", c: "t" }],
      [{ k: "Ctrl", c: "" }, { k: "A", c: "a" }, { k: "S", c: "s" }, { k: "D", c: "d" }, { k: "F", c: "f" }, { k: "G", c: "g" }],
      [{ k: "Shift", c: "" }, { k: "Z", c: "z" }, { k: "X", c: "x" }, { k: "C", c: "c" }, { k: "V", c: "v" }, { k: "B", c: "b" }],
    ],
    right: [
      [{ k: "6", c: "6" }, { k: "7", c: "7" }, { k: "8", c: "8" }, { k: "9", c: "9" }, { k: "0", c: "0" }, { k: "Bksp", c: "" }],
      [{ k: "Y", c: "y" }, { k: "U", c: "u" }, { k: "I", c: "i" }, { k: "O", c: "o" }, { k: "P", c: "p" }, { k: "\\", c: "\\" }],
      [{ k: "H", c: "h" }, { k: "J", c: "j" }, { k: "K", c: "k" }, { k: "L", c: "l" }, { k: ";", c: ";" }, { k: "'", c: "'" }],
      [{ k: "N", c: "n" }, { k: "M", c: "m" }, { k: ",", c: "," }, { k: ".", c: "." }, { k: "/", c: "/" }, { k: "Shift", c: "" }],
    ],
    thumbsLeft: [{ k: "GUI", c: "" }, { k: "SPC", c: " ", sub: "L2" }, { k: "Tab", c: "", sub: "L1" }],
    thumbsRight: [{ k: "Ent", c: "", sub: "L3" }, { k: "Bksp", c: "", sub: "L4" }, { k: "RAlt", c: "" }],
  },
  {
    name: "L1",
    desc: "Símbolos",
    holdKey: "Tab",
    left: [
      [{ k: "`", c: "`" }, { k: "!", c: "!" }, { k: "@", c: "@" }, { k: "#", c: "#" }, { k: "$", c: "$" }, { k: "%", c: "%" }],
      [{ k: "", c: "" }, { k: "!", c: "!" }, { k: "@", c: "@" }, { k: "#", c: "#" }, { k: "$", c: "$" }, { k: "%", c: "%" }],
      [{ k: "", c: "" }, { k: "GUI", c: "" }, { k: "Alt", c: "" }, { k: "Ctrl", c: "" }, { k: "Shift", c: "" }, { k: "▽", c: "" }],
      [{ k: "", c: "" }, { k: "~", c: "~" }, { k: "&", c: "&" }, { k: "*", c: "*" }, { k: "+", c: "+" }, { k: "|", c: "|" }],
    ],
    right: [
      [{ k: "^", c: "^" }, { k: "&", c: "&" }, { k: "*", c: "*" }, { k: "(", c: "(" }, { k: ")", c: ")" }, { k: "Del", c: "" }],
      [{ k: "^", c: "^" }, { k: "{", c: "{" }, { k: "}", c: "}" }, { k: "(", c: "(" }, { k: ")", c: ")" }, { k: "F12", c: "" }],
      [{ k: "=", c: "=" }, { k: "[", c: "[" }, { k: "]", c: "]" }, { k: "<", c: "<" }, { k: ">", c: ">" }, { k: ":", c: ":" }],
      [{ k: "+", c: "+" }, { k: "_", c: "_" }, { k: "_", c: "_" }, { k: "/", c: "/" }, { k: "?", c: "?" }, { k: "|", c: "|" }],
    ],
    thumbsLeft: [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    thumbsRight: [{ k: "Bksp", c: "" }, { k: "Ent", c: "" }, { k: "", c: "" }],
  },
  {
    name: "L2",
    desc: "Navegação",
    holdKey: "Space",
    left: [
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "Undo", c: "" }, { k: "Cut", c: "" }, { k: "Copy", c: "" }, { k: "Pst", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "GUI", c: "" }, { k: "Alt", c: "" }, { k: "Ctrl", c: "" }, { k: "Shift", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    ],
    right: [
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "PgUp", c: "" }, { k: "Home", c: "" }, { k: "↑", c: "" }, { k: "End", c: "" }, { k: "Ins", c: "" }, { k: "", c: "" }],
      [{ k: "PgDn", c: "" }, { k: "←", c: "" }, { k: "↓", c: "" }, { k: "→", c: "" }, { k: "Del", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "Wh↑", c: "" }, { k: "Wh↓", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    ],
    thumbsLeft: [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    thumbsRight: [{ k: "", c: "" }, { k: "Bksp", c: "" }, { k: "Ent", c: "" }],
  },
  {
    name: "L3",
    desc: "Numpad",
    holdKey: "Enter",
    left: [
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "GUI", c: "" }, { k: "Alt", c: "" }, { k: "Ctrl", c: "" }, { k: "Shift", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    ],
    right: [
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "*", c: "*" }, { k: "7", c: "7" }, { k: "8", c: "8" }, { k: "9", c: "9" }, { k: "+", c: "+" }, { k: "Bksp", c: "" }],
      [{ k: "/", c: "/" }, { k: "4", c: "4" }, { k: "5", c: "5" }, { k: "6", c: "6" }, { k: "-", c: "-" }, { k: "=", c: "=" }],
      [{ k: "%", c: "%" }, { k: "1", c: "1" }, { k: "2", c: "2" }, { k: "3", c: "3" }, { k: ".", c: "." }, { k: "Ent", c: "" }],
    ],
    thumbsLeft: [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    thumbsRight: [{ k: ",", c: "," }, { k: "0", c: "0" }, { k: "", c: "" }],
  },
  {
    name: "L4",
    desc: "F-keys + Mídia",
    holdKey: "Bksp",
    left: [
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "GUI", c: "" }, { k: "Alt", c: "" }, { k: "Ctrl", c: "" }, { k: "Shift", c: "" }, { k: "", c: "" }],
      [{ k: "", c: "" }, { k: "◄◄", c: "" }, { k: "▶❚❚", c: "" }, { k: "▶▶", c: "" }, { k: "▣", c: "" }, { k: "", c: "" }],
    ],
    right: [
      [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }, { k: "PSc", c: "" }],
      [{ k: "F12", c: "" }, { k: "F7", c: "" }, { k: "F8", c: "" }, { k: "F9", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "F11", c: "" }, { k: "F4", c: "" }, { k: "F5", c: "" }, { k: "F6", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
      [{ k: "F10", c: "" }, { k: "F1", c: "" }, { k: "F2", c: "" }, { k: "F3", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    ],
    thumbsLeft: [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
    thumbsRight: [{ k: "", c: "" }, { k: "", c: "" }, { k: "", c: "" }],
  },
];
