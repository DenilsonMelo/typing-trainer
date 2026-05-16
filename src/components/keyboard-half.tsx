import type { KeyDef } from "../types";
import { COL_OFFSETS } from "../data/keyboard";
import { Key } from "./key";

type KeyboardHalfProps = {
  rows: KeyDef[][];
  thumbs: KeyDef[];
  activeChars: Set<string>;
  nextChar: string;
  errorChar: string | null;
  side: "left" | "right";
  holdKeyThumbIndex?: number;
};

export function KeyboardHalf({ rows, thumbs, activeChars, nextChar, errorChar, side, holdKeyThumbIndex = -1 }: KeyboardHalfProps) {
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
            isActive={!!key.c && activeChars.has(key.c)}
            isNext={!!key.c && nextChar === key.c}
            isError={!!key.c && errorChar === key.c}
            isHoldKey={i === holdKeyThumbIndex}
            sub={key.sub} w={key.c === " " ? 56 : 44} />
        ))}
      </div>
    </div>
  );
}
