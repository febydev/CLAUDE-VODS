import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, BEBAS } from "../theme";

type Stat = { to: number; kind?: string; prefix?: string; suffix?: string; label?: string };

function fmt(v: number, stat: Stat) {
  const n = Math.round(v);
  if (stat.kind === "year") return String(n);
  return n.toLocaleString("en-US");
}

// Count up 0 -> target over ~1.5s with a bounce on lock (Section 5.3).
export const NumberCounter: React.FC<{ stat: Stat; color: string; big?: boolean }> = ({ stat, color, big = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 45;
  const prog = interpolate(frame, [6, 6 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - prog, 3);
  const val = eased * stat.to;
  const lock = spring({ frame: frame - (6 + dur), fps, config: { damping: 9, mass: 0.5 } });
  const bounce = frame >= 6 + dur ? 1 + lock * 0.08 : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        fontFamily: ANTON, fontSize: big ? 230 : 150, color: "#fff",
        transform: `scale(${bounce})`, letterSpacing: 2,
        textShadow: `0 0 44px ${color}cc, 0 10px 40px rgba(0,0,0,0.7)`,
        lineHeight: 1,
      }}>
        {stat.prefix ?? ""}{fmt(val, stat)}{stat.suffix ?? ""}
      </div>
      {stat.label ? (
        <div style={{
          fontFamily: BEBAS, fontSize: 40, letterSpacing: 6, color,
          opacity: interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {stat.label}
        </div>
      ) : null}
    </div>
  );
};
