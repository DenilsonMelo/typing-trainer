import { useState, useEffect, useCallback, useRef, useReducer } from "react";
import { LEVELS, generateText } from "../data/levels";
import { LAYERS } from "../data/keyboard";
import { TIPS } from "../data/tips";
import { typingReducer, initialState } from "../state/typing-reducer";
import { loadBestScores, saveBestScores } from "../state/best-scores-storage";
import { KeyboardHalf } from "./keyboard-half";

type Theme = "dark" | "light";

export default function TypingTrainer() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [state, dispatch] = useReducer(
    typingReducer,
    undefined,
    () => ({ ...initialState, bestScores: loadBestScores() })
  );
  const [showTips, setShowTips] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    saveBestScores(state.bestScores);
  }, [state.bestScores]);

  const level = LEVELS[currentLevel];

  const initLevel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch({ type: "INIT", text: generateText(level) });
  }, [level]);

  useEffect(() => {
    initLevel();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentLevel, initLevel]);

  // Sync displayed layer with the level's default when level changes.
  // User can still click layer pills to override afterwards.
  const [prevLevel, setPrevLevel] = useState(currentLevel);
  if (prevLevel !== currentLevel) {
    setPrevLevel(currentLevel);
    setCurrentLayer(level.layer ?? 0);
  }

  // Timer
  useEffect(() => {
    if (state.startTime && !state.finished) {
      const id = setInterval(() => dispatch({ type: "TICK", now: Date.now() }), 250);
      timerRef.current = id;
      return () => clearInterval(id);
    }
    if (state.finished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [state.startTime, state.finished]);

  // Auto-scroll
  useEffect(() => {
    if (textRef.current) {
      const cur = textRef.current.querySelector('[data-cursor="true"]');
      if (cur) cur.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [state.pos]);

  // ── KEY HANDLER on document level — no hidden input needed ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.finished) {
        if (e.key === "Escape") { e.preventDefault(); initLevel(); return; }
        if (e.key === "Enter" && currentLevel < LEVELS.length - 1) {
          e.preventDefault();
          setCurrentLevel(p => p + 1);
          return;
        }
        return;
      }

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
        return;
      }

      // Only single characters
      if (e.key.length !== 1) return;

      dispatch({ type: "TYPE_CHAR", char: e.key, time: Date.now(), levelId: level.id });
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.finished, initLevel, currentLevel, level.id]);

  // Error flash — clear after 300ms
  useEffect(() => {
    if (!state.errorFlash) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_ERROR_FLASH" }), 300);
    return () => clearTimeout(t);
  }, [state.errorFlash]);

  const netCorrect = state.totalKeystrokes - state.totalErrors;
  const wpm = state.elapsed > 0 ? Math.round((netCorrect / 5) / (state.elapsed / 60)) : 0;
  const accuracy = state.totalKeystrokes > 0 ? Math.round((netCorrect / state.totalKeystrokes) * 100) : 100;
  const nextChar = state.text[state.pos] || "";
  const activeChars = new Set(state.text.split(""));

  // For non-L0 layers, locate the hold key in L0's thumbs (via sub = layer name)
  // and overlay it on the current layer's thumb cluster so it can be highlighted.
  const layerData = LAYERS[currentLayer];
  const l0 = LAYERS[0];
  let holdLeftIdx = -1;
  let holdRightIdx = -1;
  if (currentLayer > 0) {
    holdLeftIdx = l0.thumbsLeft.findIndex(t => t.sub === layerData.name);
    if (holdLeftIdx < 0) holdRightIdx = l0.thumbsRight.findIndex(t => t.sub === layerData.name);
  }
  const thumbsLeft = holdLeftIdx >= 0
    ? layerData.thumbsLeft.map((t, i) => (i === holdLeftIdx ? l0.thumbsLeft[i] : t))
    : layerData.thumbsLeft;
  const thumbsRight = holdRightIdx >= 0
    ? layerData.thumbsRight.map((t, i) => (i === holdRightIdx ? l0.thumbsRight[i] : t))
    : layerData.thumbsRight;

  return (
    <div ref={containerRef} style={{
      minHeight: "100vh", background: "var(--page-bg)", color: "var(--fg)",
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "16px", boxSizing: "border-box",
      transition: "background 0.2s, color 0.2s",
    }}>
      {/* Theme toggle */}
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
        style={{
          position: "fixed", top: "14px", right: "14px", zIndex: 50,
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "var(--pill-bg)", border: "1px solid var(--pill-border)",
          color: "var(--fg-muted)", padding: "5px 10px", borderRadius: "20px",
          fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
          cursor: "pointer", transition: "all 0.15s",
        }}>
        <span style={{ fontSize: "12px", lineHeight: 1 }}>{theme === "dark" ? "☀" : "☾"}</span>
        {theme === "dark" ? "Light" : "Dark"}
      </button>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "var(--pill-bg)", padding: "7px 18px", borderRadius: "40px", border: "1px solid var(--pill-border)",
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "5px", color: "var(--accent-blue)", textTransform: "uppercase" }}>
            Silakka54
          </span>
          <span style={{ width: "1px", height: "12px", background: "var(--divider)" }} />
          <span style={{ fontSize: "10px", letterSpacing: "2px", opacity: 0.4 }}>Typing Trainer</span>
        </div>
      </div>

      {/* Level pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px", marginBottom: "10px", maxWidth: "680px", margin: "0 auto 10px" }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => setCurrentLevel(i)}
            style={{
              padding: "4px 10px", borderRadius: "14px",
              border: i === currentLevel ? "1px solid var(--accent-blue)" : "1px solid transparent",
              background: i === currentLevel ? "color-mix(in srgb, var(--accent-blue) 12%, transparent)" : "transparent",
              color: i === currentLevel ? "var(--accent-blue)" : "var(--fg-dim)",
              fontSize: "10px", fontWeight: i === currentLevel ? 700 : 500, cursor: "pointer",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}>
            {i + 1}. {l.name}
            {state.bestScores[l.id] != null && <span style={{ opacity: 0.4, marginLeft: "3px" }}>{state.bestScores[l.id].wpm}w</span>}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: "11px", opacity: 0.35, marginBottom: "10px" }}>{level.desc}</div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginBottom: "12px" }}>
        {([
          [wpm, "WPM", "var(--accent-cyan)"],
          [`${accuracy}%`, "Precisão", accuracy >= 95 ? "var(--accent-green)" : accuracy >= 80 ? "var(--accent-orange)" : "var(--accent-red)"],
          [`${state.elapsed}s`, "Tempo", "var(--accent-purple)"],
          [netCorrect, "Certos", "var(--accent-green)"],
          [state.totalErrors, "Erros", "var(--accent-red)"],
        ] as Array<[string | number, string, string]>).map(([v, l, c]) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            <span style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            <span style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.35, fontWeight: 700 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Text area */}
      <div ref={textRef} style={{
        background: "var(--card-bg)", borderRadius: "12px", padding: "18px 22px",
        margin: "0 auto 14px", maxWidth: "660px", minHeight: "180px", maxHeight: "110px",
        overflowY: "auto", fontSize: "19px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        lineHeight: 1.85, letterSpacing: "0.3px", border: "1px solid var(--tip-border)", position: "relative",
      }}>
        {state.finished && (
          <div style={{
            position: "absolute", inset: 0, background: "var(--finish-overlay)", borderRadius: "12px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "8px", zIndex: 10,
          }}>
            <div style={{ fontSize: "32px" }}>{accuracy >= 95 ? "🎯" : accuracy >= 80 ? "👍" : "💪"}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg-strong)" }}>{wpm} WPM — {accuracy}%</div>
            <div style={{ fontSize: "11px", opacity: 0.4 }}>
              {netCorrect} certas, {state.totalErrors} erros
              {accuracy >= 95 ? " — Excelente!" : accuracy >= 80 ? " — Continue assim!" : " — Foque na precisão."}
            </div>
            {(() => {
              const best = state.bestScores[level.id];
              if (state.lastWasRecord) {
                return (
                  <div style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 600 }}>
                    🏆 Novo recorde!
                  </div>
                );
              }
              if (accuracy < 90) {
                return (
                  <div style={{ fontSize: "10px", opacity: 0.4 }}>
                    Best não atualizado (precisão &lt; 90%)
                  </div>
                );
              }
              if (best) {
                return (
                  <div style={{ fontSize: "10px", opacity: 0.4 }}>
                    Melhor: {best.wpm}w · {best.accuracy}%
                  </div>
                );
              }
              return null;
            })()}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button onClick={() => initLevel()}
                style={{ padding: "6px 16px", borderRadius: "7px", border: "1px solid var(--accent-blue)", background: "color-mix(in srgb, var(--accent-blue) 10%, transparent)", color: "var(--accent-blue)", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                Repetir (Esc)
              </button>
              {currentLevel < LEVELS.length - 1 && (
                <button autoFocus onClick={() => setCurrentLevel(p => p + 1)}
                  style={{ padding: "6px 16px", borderRadius: "7px", border: "none", background: "var(--accent-blue)", color: "#13141c", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  Próximo (Enter) →
                </button>
              )}
            </div>
          </div>
        )}

        {state.text.split("").map((char, i) => {
          const st = state.states[i];
          const isCursor = i === state.pos;
          let color = "var(--fg-ghost)", bg = "transparent", bb = "none";
          if (st === "correct") color = "var(--accent-green)";
          else if (st === "wrong") { color = "var(--accent-red)"; bg = "color-mix(in srgb, var(--accent-red) 12%, transparent)"; }
          if (isCursor) { color = "var(--fg-strong)"; bb = "2px solid var(--accent-blue)"; bg = "color-mix(in srgb, var(--accent-blue) 8%, transparent)"; }

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

      {/* Layer pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "4px", flexWrap: "wrap" }}>
        {LAYERS.map((l, i) => (
          <button key={i} onClick={() => setCurrentLayer(i)}
            style={{
              padding: "3px 9px", borderRadius: "10px",
              border: i === currentLayer ? "1px solid var(--accent-purple)" : "1px solid transparent",
              background: i === currentLayer ? "color-mix(in srgb, var(--accent-purple) 14%, transparent)" : "transparent",
              color: i === currentLayer ? "var(--accent-purple)" : "var(--fg-dim)",
              fontSize: "9px", fontWeight: i === currentLayer ? 700 : 500, cursor: "pointer",
              letterSpacing: "0.5px", transition: "all 0.15s",
            }}>
            {l.name} <span style={{ opacity: 0.55, marginLeft: "2px" }}>{l.desc}</span>
            {l.holdKey && (
              <span style={{
                marginLeft: "6px", padding: "1px 5px", borderRadius: "4px",
                background: i === currentLayer ? "color-mix(in srgb, var(--accent-purple) 18%, transparent)" : "var(--pill-border)",
                color: i === currentLayer ? "var(--accent-purple)" : "var(--fg-muted)",
                fontSize: "8px", fontWeight: 600, letterSpacing: "0.3px",
              }}>hold {l.holdKey}</span>
            )}
          </button>
        ))}
      </div>

      {/* Keyboard */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "36px",
        margin: "0 auto", maxWidth: "640px", transform: "scale(0.88)", transformOrigin: "top center",
      }}>
        <KeyboardHalf rows={layerData.left} thumbs={thumbsLeft}
          activeChars={activeChars} nextChar={nextChar} errorChar={state.errorFlash} side="left"
          holdKeyThumbIndex={holdLeftIdx} />
        <KeyboardHalf rows={layerData.right} thumbs={thumbsRight}
          activeChars={activeChars} nextChar={nextChar} errorChar={state.errorFlash} side="right"
          holdKeyThumbIndex={holdRightIdx} />
      </div>

      {/* Finger legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", margin: "10px 0 6px" }}>
        {[["Mindinho", "var(--accent-red)"], ["Anelar", "var(--accent-orange)"], ["Médio", "var(--accent-green)"], ["Indicador", "var(--accent-cyan)"], ["Polegar", "var(--accent-purple)"]].map(([n, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", opacity: 0.5 }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} /> {n}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={{ maxWidth: "540px", margin: "8px auto 0" }}>
        <button onClick={() => setShowTips(!showTips)}
          style={{ background: "none", border: "none", color: "var(--accent-blue)", fontSize: "10px", cursor: "pointer", opacity: 0.55, padding: "3px 0" }}>
          {showTips ? "▾" : "▸"} Dicas para seu layout
        </button>
        {showTips && (
          <div style={{ background: "var(--tip-bg)", borderRadius: "10px", padding: "10px 14px", marginTop: "4px", border: "1px solid var(--tip-border)" }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ padding: "4px 0", fontSize: "10px", opacity: 0.6, borderBottom: i < TIPS.length - 1 ? "1px solid var(--tip-divider)" : "none", lineHeight: 1.5 }}>
                <span style={{ color: "var(--accent-blue)", marginRight: "6px", fontWeight: 700, fontFamily: "monospace", fontSize: "9px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>{tip}
              </div>
            ))}
            <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "7px", background: "var(--tip-callout-bg)", fontSize: "9px", opacity: 0.65, lineHeight: 1.7 }}>
              <strong style={{ color: "var(--accent-blue)" }}>Suas camadas (VIAL):</strong><br />
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
