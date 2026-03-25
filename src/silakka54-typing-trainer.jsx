import { useState, useEffect, useCallback, useRef, useReducer } from "react";

/*
  Silakka54 — user's VIAL Layer 0:
  LEFT:  ESC 1 2 3 4 5 | TAB Q W E R T | CTRL A S D F G | SHFT Z X C V B | GUI SPC(L2) TAB(L1)
  RIGHT: 6 7 8 9 0 BKSP | Y U I O P \ | H J K L ; ' | N M , . / SHFT | ENT(L3) BKSP(L4) RALT
*/

const KEYBOARD_LEFT = [
  [{ k: "Esc", c: "" }, { k: "1", c: "1" }, { k: "2", c: "2" }, { k: "3", c: "3" }, { k: "4", c: "4" }, { k: "5", c: "5" }],
  [{ k: "Tab", c: "" }, { k: "Q", c: "q" }, { k: "W", c: "w" }, { k: "E", c: "e" }, { k: "R", c: "r" }, { k: "T", c: "t" }],
  [{ k: "Ctrl", c: "" }, { k: "A", c: "a" }, { k: "S", c: "s" }, { k: "D", c: "d" }, { k: "F", c: "f" }, { k: "G", c: "g" }],
  [{ k: "Shift", c: "" }, { k: "Z", c: "z" }, { k: "X", c: "x" }, { k: "C", c: "c" }, { k: "V", c: "v" }, { k: "B", c: "b" }],
];
const KEYBOARD_RIGHT = [
  [{ k: "6", c: "6" }, { k: "7", c: "7" }, { k: "8", c: "8" }, { k: "9", c: "9" }, { k: "0", c: "0" }, { k: "Bksp", c: "" }],
  [{ k: "Y", c: "y" }, { k: "U", c: "u" }, { k: "I", c: "i" }, { k: "O", c: "o" }, { k: "P", c: "p" }, { k: "\\", c: "\\" }],
  [{ k: "H", c: "h" }, { k: "J", c: "j" }, { k: "K", c: "k" }, { k: "L", c: "l" }, { k: ";", c: ";" }, { k: "'", c: "'" }],
  [{ k: "N", c: "n" }, { k: "M", c: "m" }, { k: ",", c: "," }, { k: ".", c: "." }, { k: "/", c: "/" }, { k: "Shift", c: "" }],
];
const THUMBS_LEFT = [{ k: "GUI", c: "" }, { k: "SPC", c: " ", sub: "L2" }, { k: "Tab", c: "", sub: "L1" }];
const THUMBS_RIGHT = [{ k: "Ent", c: "", sub: "L3" }, { k: "Bksp", c: "", sub: "L4" }, { k: "RAlt", c: "" }];
const COL_OFFSETS = [0.5, 0.25, 0, 0.125, 0.25, 0.35];

const FINGER_MAP = {
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
const FINGER_COLORS = {
  "pinky-l": "#ff6b81", "ring-l": "#ffa94d", "mid-l": "#69db7c",
  "index-l": "#74c0fc", "index-r": "#74c0fc", "mid-r": "#69db7c",
  "ring-r": "#ffa94d", "pinky-r": "#ff6b81", "thumb-l": "#b197fc", "thumb-r": "#b197fc",
};

const LEVELS = [
  { id: 1, name: "Home Esquerda", desc: "ASDF G — mão esquerda na posição base",
    words: ["fada", "saga", "gaga", "das", "safa", "sad", "fads", "gas", "dag", "safas", "dada"] },
  { id: 2, name: "Home Direita", desc: "H JKL — mão direita na posição base",
    words: ["hall", "hulk", "hill", "kill", "hall", "skill", "shall", "jail", "lash", "jhl", "lhk"] },
  { id: 3, name: "Home Completa", desc: "Ambas as mãos juntas na home row",
    words: ["flash", "glass", "flags", "salad", "slash", "flask", "glad", "half", "falls", "halls", "skill", "shall"] },
  { id: 4, name: "Row Superior", desc: "QWERT YUIOP — alcance para cima",
    words: ["write", "power", "quiet", "route", "tower", "quote", "equip", "query", "outer", "optic", "wiper", "rivet"] },
  { id: 5, name: "Row Inferior", desc: "ZXCVB NM — alcance para baixo",
    words: ["cabin", "venom", "camel", "bunch", "bench", "bacon", "climb", "blank", "crumb", "nerve", "comic", "civic"] },
  { id: 6, name: "Centro Split", desc: "TG + YH — onde o teclado se divide",
    words: ["tight", "ghost", "youth", "thigh", "girth", "byte", "eight", "gutsy", "bight", "gust", "typo", "buggy"] },
  { id: 7, name: "Números", desc: "1234567890 — row de números",
    words: ["123", "456", "789", "100", "2024", "365", "500", "1000", "42", "99", "007", "314", "256"] },
  { id: 8, name: "Palavras PT-BR", desc: "Vocabulário em português",
    words: ["teclado", "dividido", "digitar", "tecla", "postura", "coluna", "dedo", "polegar",
      "camada", "layout", "firme", "rapido", "treino", "foco", "ritmo", "fluxo", "ajuste", "pulso", "forma", "base"] },
  { id: 9, name: "Frases", desc: "Frases completas para velocidade",
    words: [
      "o teclado split melhora a postura",
      "cada dedo tem sua coluna no silakka",
      "pratique todos os dias por dez minutos",
      "o polegar controla espaco e camadas",
      "nao olhe para baixo confie nos dedos",
      "a precisao vem antes da velocidade",
      "use o vial para remapear as teclas",
      "layers substituem teclas que faltam",
      "o split separa as maos na largura do ombro",
      "column stagger segue o formato natural",
    ] },
];

function generateText(level) {
  const shuffled = [...level.words].sort(() => Math.random() - 0.5);
  if (level.id === 9) return shuffled.slice(0, 3).join(". ");
  if (level.id === 7) return shuffled.slice(0, 8).join(" ");
  return shuffled.slice(0, 8 + Math.floor(Math.random() * 5)).join(" ");
}

// ── Reducer for typing state — avoids stale closures ──
const initialState = {
  text: "", pos: 0, states: [], correct: 0, wrong: 0,
  startTime: null, finished: false,
};

function typingReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      const t = action.text;
      return { ...initialState, text: t, states: new Array(t.length).fill(null) };
    }
    case "TYPE_CHAR": {
      if (state.finished || state.pos >= state.text.length) return state;
      const expected = state.text[state.pos];
      const isCorrect = action.char === expected;
      const newStates = [...state.states];
      newStates[state.pos] = isCorrect ? "correct" : "wrong";
      const newPos = state.pos + 1;
      const now = action.time;
      return {
        ...state,
        pos: newPos,
        states: newStates,
        correct: state.correct + (isCorrect ? 1 : 0),
        wrong: state.wrong + (isCorrect ? 0 : 1),
        startTime: state.startTime || now,
        finished: newPos >= state.text.length,
        lastCorrect: isCorrect,
        lastExpected: isCorrect ? null : expected,
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
      };
    }
    default:
      return state;
  }
}

function Key({ label, charCode, isActive, isNext, isError, sub, w = 44 }) {
  const finger = FINGER_MAP[charCode];
  const color = finger ? FINGER_COLORS[finger] : "#555";
  const isMod = !charCode;

  let bg, textColor, border, shadow, scale;
  if (isError) {
    bg = "#ff6b8140"; textColor = "#ff6b81"; border = "2px solid #ff6b81";
    shadow = "0 0 14px #ff6b8144"; scale = "scale(1.08)";
  } else if (isNext) {
    bg = color; textColor = "#13141c"; border = `2px solid ${color}`;
    shadow = `0 0 20px ${color}77, 0 3px 10px #00000066`; scale = "scale(1.13)";
  } else if (isActive && !isMod) {
    bg = `${color}18`; textColor = `${color}cc`; border = `1px solid ${color}33`;
    shadow = "0 1px 2px #00000022"; scale = "scale(1)";
  } else {
    bg = isMod ? "#1e2030" : "#232536"; textColor = isMod ? "#3b4261" : "#4a5070";
    border = "1px solid #2a2d3d"; shadow = "0 1px 2px #00000018"; scale = "scale(1)";
  }

  return (
    <div style={{
      width: `${w}px`, height: "42px", borderRadius: "6px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontSize: label.length > 3 ? "8px" : label.length > 1 ? "10px" : "13px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontWeight: isNext ? 800 : 500, background: bg, color: textColor,
      border, boxShadow: shadow, transform: scale,
      transition: "all 0.12s ease", userSelect: "none", flexShrink: 0,
    }}>
      {label}
      {sub && <span style={{ fontSize: "7px", opacity: 0.4, marginTop: "-2px" }}>{sub}</span>}
    </div>
  );
}

function KeyboardHalf({ rows, thumbs, activeChars, nextChar, errorChar, side }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: "3px" }}>
          {row.map((key, ci) => (
            <div key={ci} style={{ marginTop: `${COL_OFFSETS[ci] * 18}px` }}>
              <Key label={key.k} charCode={key.c}
                isActive={key.c !== "" && activeChars.has(key.c)}
                isNext={key.c !== "" && nextChar === key.c}
                isError={key.c !== "" && errorChar === key.c} />
            </div>
          ))}
        </div>
      ))}
      <div style={{
        display: "flex", gap: "3px", justifyContent: "center", marginTop: "6px",
        paddingLeft: side === "left" ? "80px" : "0",
        paddingRight: side === "right" ? "80px" : "0",
      }}>
        {thumbs.map((key, i) => (
          <Key key={i} label={key.k} charCode={key.c || ""}
            isActive={key.c && activeChars.has(key.c)}
            isNext={key.c && nextChar === key.c}
            isError={key.c && errorChar === key.c}
            sub={key.sub} w={key.c === " " ? 56 : 44} />
        ))}
      </div>
    </div>
  );
}

export default function TypingTrainer() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [state, dispatch] = useReducer(typingReducer, initialState);
  const [elapsed, setElapsed] = useState(0);
  const [errorFlash, setErrorFlash] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [bestWpm, setBestWpm] = useState({});
  const [, forceUpdate] = useState(0);
  const timerRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  const level = LEVELS[currentLevel];

  const initLevel = useCallback(() => {
    dispatch({ type: "INIT", text: generateText(level) });
    setElapsed(0);
    setErrorFlash(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [level]);

  useEffect(() => {
    initLevel();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentLevel, initLevel]);

  // Timer
  useEffect(() => {
    if (state.startTime && !state.finished) {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - state.startTime) / 1000)), 250);
      return () => clearInterval(timerRef.current);
    }
    if (state.finished && timerRef.current) {
      clearInterval(timerRef.current);
      // Calculate final elapsed
      const fe = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
      setElapsed(fe);
    }
  }, [state.startTime, state.finished]);

  // Save best WPM on finish
  useEffect(() => {
    if (state.finished && state.startTime) {
      const fe = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));
      const fw = fe > 0 ? Math.round((state.correct / 5) / (fe / 60)) : 0;
      setBestWpm(p => ({ ...p, [currentLevel]: Math.max(p[currentLevel] || 0, fw) }));
    }
  }, [state.finished]);

  // Auto-scroll
  useEffect(() => {
    if (textRef.current) {
      const cur = textRef.current.querySelector('[data-cursor="true"]');
      if (cur) cur.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [state.pos]);

  // ── KEY HANDLER on document level — no hidden input needed ──
  useEffect(() => {
    const handler = (e) => {
      if (state.finished) return;

      // Escape to restart
      if (e.key === "Escape") { e.preventDefault(); initLevel(); return; }

      // Ignore modifier-only keys
      if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab",
           "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
           "Home", "End", "PageUp", "PageDown", "Insert",
           "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
          ].includes(e.key)) return;

      // Dead key — ignore, it will compose on next keystroke
      if (e.key === "Dead") { e.preventDefault(); return; }

      // Process/Unidentified — ignore
      if (e.key === "Process" || e.key === "Unidentified") return;

      e.preventDefault();

      if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
        setErrorFlash(null);
        return;
      }

      // Only single characters
      if (e.key.length !== 1) return;

      dispatch({ type: "TYPE_CHAR", char: e.key, time: Date.now() });
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.finished, initLevel]);

  // Error flash effect
  useEffect(() => {
    if (state.lastExpected) {
      setErrorFlash(state.lastExpected);
      const t = setTimeout(() => setErrorFlash(null), 300);
      return () => clearTimeout(t);
    } else {
      setErrorFlash(null);
    }
  }, [state.wrong, state.lastExpected]);

  const totalKeys = state.correct + state.wrong;
  const wpm = elapsed > 0 ? Math.round((state.correct / 5) / (elapsed / 60)) : 0;
  const accuracy = totalKeys > 0 ? Math.round((state.correct / totalKeys) * 100) : 100;
  const nextChar = state.text[state.pos] || "";
  const activeChars = new Set(state.text.split(""));

  const TIPS = [
    "Posicione cada metade na largura dos ombros.",
    "Teste os 3 níveis de tenting do Silakka54.",
    "Dedos na home row: ASDF (esq) / HJKL (dir).",
    "Column stagger: cada dedo move reto cima/baixo.",
    "Polegar esq: SPC (tap) → Layer 2 nav (hold).",
    "Polegar dir: ENT → L3 numpad / BKSP → L4 F-keys.",
    "L1 (Tab hold) = Símbolos !@#$% etc.",
    "Use VIAL pra ajustar. Seu layout é pessoal.",
  ];

  return (
    <div ref={containerRef} style={{
      minHeight: "100vh", background: "#13141c", color: "#a9b1d6",
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "16px", boxSizing: "border-box",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "#1e2030", padding: "7px 18px", borderRadius: "40px", border: "1px solid #2a2d3d",
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "5px", color: "#7aa2f7", textTransform: "uppercase" }}>
            Silakka54
          </span>
          <span style={{ width: "1px", height: "12px", background: "#3b4261" }} />
          <span style={{ fontSize: "10px", letterSpacing: "2px", opacity: 0.4 }}>Typing Trainer</span>
        </div>
      </div>

      {/* Level pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px", marginBottom: "10px", maxWidth: "680px", margin: "0 auto 10px" }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => setCurrentLevel(i)}
            style={{
              padding: "4px 10px", borderRadius: "14px",
              border: i === currentLevel ? "1px solid #7aa2f7" : "1px solid transparent",
              background: i === currentLevel ? "#7aa2f715" : "transparent",
              color: i === currentLevel ? "#7aa2f7" : "#4a5070",
              fontSize: "10px", fontWeight: i === currentLevel ? 700 : 500, cursor: "pointer",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}>
            {i + 1}. {l.name}
            {bestWpm[i] != null && <span style={{ opacity: 0.4, marginLeft: "3px" }}>{bestWpm[i]}w</span>}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: "11px", opacity: 0.35, marginBottom: "10px" }}>{level.desc}</div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginBottom: "12px" }}>
        {[
          [wpm, "WPM", "#74c0fc"],
          [`${accuracy}%`, "Precisão", accuracy >= 95 ? "#69db7c" : accuracy >= 80 ? "#ffa94d" : "#ff6b81"],
          [`${elapsed}s`, "Tempo", "#b197fc"],
          [state.correct, "Certos", "#69db7c"],
          [state.wrong, "Erros", "#ff6b81"],
        ].map(([v, l, c]) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            <span style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            <span style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.35, fontWeight: 700 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Text area */}
      <div ref={textRef} style={{
        background: "#1a1b26", borderRadius: "12px", padding: "18px 22px",
        margin: "0 auto 14px", maxWidth: "660px", minHeight: "60px", maxHeight: "110px",
        overflowY: "auto", fontSize: "19px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        lineHeight: 1.85, letterSpacing: "0.3px", border: "1px solid #1e2030", position: "relative",
      }}>
        {state.finished && (
          <div style={{
            position: "absolute", inset: 0, background: "#13141cee", borderRadius: "12px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "8px", zIndex: 10,
          }}>
            <div style={{ fontSize: "32px" }}>{accuracy >= 95 ? "🎯" : accuracy >= 80 ? "👍" : "💪"}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#c0caf5" }}>{wpm} WPM — {accuracy}%</div>
            <div style={{ fontSize: "11px", opacity: 0.4 }}>
              {state.correct} certas, {state.wrong} erros
              {accuracy >= 95 ? " — Excelente!" : accuracy >= 80 ? " — Continue assim!" : " — Foque na precisão."}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button onClick={() => initLevel()}
                style={{ padding: "6px 16px", borderRadius: "7px", border: "1px solid #7aa2f7", background: "#7aa2f712", color: "#7aa2f7", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                Repetir (Esc)
              </button>
              {currentLevel < LEVELS.length - 1 && (
                <button onClick={() => setCurrentLevel(p => p + 1)}
                  style={{ padding: "6px 16px", borderRadius: "7px", border: "none", background: "#7aa2f7", color: "#13141c", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  Próximo →
                </button>
              )}
            </div>
          </div>
        )}

        {state.text.split("").map((char, i) => {
          const st = state.states[i];
          const isCursor = i === state.pos;
          let color = "#2f3348", bg = "transparent", bb = "none";
          if (st === "correct") color = "#69db7c";
          else if (st === "wrong") { color = "#ff6b81"; bg = "#ff6b8115"; }
          if (isCursor) { color = "#ddd"; bb = "2px solid #7aa2f7"; bg = "#7aa2f70d"; }

          return (
            <span key={i} data-cursor={isCursor ? "true" : undefined}
              style={{ color, background: bg, borderBottom: bb, borderRadius: "2px", transition: "color 0.08s" }}>
              {char === " " && st === "wrong" ? "·" : char}
            </span>
          );
        })}

        {!state.startTime && state.pos === 0 && (
          <div style={{ position: "absolute", bottom: "6px", right: "14px", fontSize: "9px", opacity: 0.18, fontFamily: "system-ui" }}>
            comece a digitar... (Esc = reiniciar)
          </div>
        )}
      </div>

      {/* Keyboard */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "36px",
        margin: "0 auto", maxWidth: "640px", transform: "scale(0.88)", transformOrigin: "top center",
      }}>
        <KeyboardHalf rows={KEYBOARD_LEFT} thumbs={THUMBS_LEFT}
          activeChars={activeChars} nextChar={nextChar} errorChar={errorFlash} side="left" />
        <KeyboardHalf rows={KEYBOARD_RIGHT} thumbs={THUMBS_RIGHT}
          activeChars={activeChars} nextChar={nextChar} errorChar={errorFlash} side="right" />
      </div>

      {/* Finger legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", margin: "10px 0 6px" }}>
        {[["Mindinho", "#ff6b81"], ["Anelar", "#ffa94d"], ["Médio", "#69db7c"], ["Indicador", "#74c0fc"], ["Polegar", "#b197fc"]].map(([n, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", opacity: 0.5 }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} /> {n}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={{ maxWidth: "540px", margin: "8px auto 0" }}>
        <button onClick={() => setShowTips(!showTips)}
          style={{ background: "none", border: "none", color: "#7aa2f7", fontSize: "10px", cursor: "pointer", opacity: 0.45, padding: "3px 0" }}>
          {showTips ? "▾" : "▸"} Dicas para seu layout
        </button>
        {showTips && (
          <div style={{ background: "#1a1b2677", borderRadius: "10px", padding: "10px 14px", marginTop: "4px", border: "1px solid #1e2030" }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ padding: "4px 0", fontSize: "10px", opacity: 0.5, borderBottom: i < TIPS.length - 1 ? "1px solid #1e203044" : "none", lineHeight: 1.5 }}>
                <span style={{ color: "#7aa2f7", marginRight: "6px", fontWeight: 700, fontFamily: "monospace", fontSize: "9px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>{tip}
              </div>
            ))}
            <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "7px", background: "#1e203066", fontSize: "9px", opacity: 0.55, lineHeight: 1.7 }}>
              <strong style={{ color: "#7aa2f7" }}>Suas camadas (VIAL):</strong><br />
              L0 = QWERTY &nbsp;|&nbsp; L1 (Tab hold) = Símbolos !@#$%<br />
              L2 (Space hold) = Navegação/Setas &nbsp;|&nbsp; L3 (Enter hold) = Numpad<br />
              L4 (Bksp hold) = F-keys + Controle de Mídia
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
