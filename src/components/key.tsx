import { FINGER_MAP, FINGER_COLORS } from "../data/keyboard";

type KeyProps = {
  label: string;
  charCode: string;
  isActive: boolean;
  isNext: boolean;
  isError: boolean;
  isHoldKey?: boolean;
  sub?: string;
  w?: number;
};

export function Key({ label, charCode, isActive, isNext, isError, isHoldKey, sub, w = 44 }: KeyProps) {
  const finger = FINGER_MAP[charCode];
  const color = finger ? FINGER_COLORS[finger] : "#555";
  const isMod = !charCode;

  const getStyle = () => {
    if (isError) return {
      bg: "color-mix(in srgb, var(--accent-red) 35%, transparent)", textColor: "var(--accent-red)",
      border: "2px solid var(--accent-red)",
      shadow: "0 0 14px color-mix(in srgb, var(--accent-red) 28%, transparent)", scale: "scale(1.08)",
    };
    if (isNext) return {
      bg: color, textColor: "#13141c", border: `2px solid ${color}`,
      shadow: `0 0 20px ${color}77, 0 3px 10px var(--shadow-strong)`, scale: "scale(1.13)",
    };
    if (isHoldKey) return {
      bg: "color-mix(in srgb, var(--accent-purple) 18%, transparent)", textColor: "var(--accent-purple)",
      border: "2px solid var(--accent-purple)",
      shadow: "0 0 16px color-mix(in srgb, var(--accent-purple) 55%, transparent), 0 0 4px color-mix(in srgb, var(--accent-purple) 65%, transparent) inset",
      scale: "scale(1.06)",
    };
    if (isActive && !isMod) return {
      bg: `${color}18`, textColor: `${color}cc`, border: `1px solid ${color}33`,
      shadow: "0 1px 2px var(--shadow-soft)", scale: "scale(1)",
    };
    return {
      bg: isMod ? "var(--key-mod-bg)" : "var(--key-bg)",
      textColor: isMod ? "var(--key-mod-fg)" : "var(--key-fg)",
      border: "1px solid var(--key-border)", shadow: "0 1px 2px var(--shadow-soft)", scale: "scale(1)",
    };
  };
  const { bg, textColor, border, shadow, scale } = getStyle();

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
      {sub && <span style={{ fontSize: "10px", opacity: 0.4, marginTop: "-2px" }}>{sub}</span>}
    </div>
  );
}
