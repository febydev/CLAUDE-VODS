import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

// Number counter (Section 9 Type 6). Ticks up 0->target (ease), bounce on completion.
export const NumberCounter: React.FC<{ to: number; label: string; suffix?: string; accent: string }> = ({ to, label, suffix = "", accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 48;
  const prog = interpolate(frame, [8, 8 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - prog, 3);
  const val = Math.round(eased * to);
  const lock = spring({ frame: frame - (8 + dur), fps, config: { damping: 9, mass: 0.5 } });
  const bounce = frame >= 8 + dur ? 1 + lock * 0.08 : 1;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #163240 0%, #08151d 72%)`, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${accent}22, transparent 58%)` }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, color: "#fff", transform: `scale(${bounce})`, textShadow: `0 0 50px ${accent}cc`, lineHeight: 1 }}>
          {val.toLocaleString("en-US")}{suffix}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: accent, marginTop: 14,
          opacity: interpolate(frame, [12, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
