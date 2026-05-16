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
      bg: "#ff6b8140", textColor: "#ff6b81", border: "2px solid #ff6b81",
      shadow: "0 0 14px #ff6b8144", scale: "scale(1.08)",
    };
    if (isNext) return {
      bg: color, textColor: "#13141c", border: `2px solid ${color}`,
      shadow: `0 0 20px ${color}77, 0 3px 10px #00000066`, scale: "scale(1.13)",
    };
    if (isHoldKey) return {
      bg: "#b197fc22", textColor: "#b197fc", border: "2px solid #b197fc",
      shadow: "0 0 16px #b197fc88, 0 0 4px #b197fcaa inset", scale: "scale(1.06)",
    };
    if (isActive && !isMod) return {
      bg: `${color}18`, textColor: `${color}cc`, border: `1px solid ${color}33`,
      shadow: "0 1px 2px #00000022", scale: "scale(1)",
    };
    return {
      bg: isMod ? "#1e2030" : "#262a3d", textColor: isMod ? "#6a7099" : "#9098bc",
      border: "1px solid #353a52", shadow: "0 1px 2px #00000022", scale: "scale(1)",
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
