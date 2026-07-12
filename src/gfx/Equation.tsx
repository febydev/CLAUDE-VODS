import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, INK, GOLD, creamBg } from "../theme";

// 500 ÷ 8,000,000,000 = 1 in 16,000,000. Numbers punch in, equals bar draws, result punches larger.
export const Equation: React.FC<{ a: string; b: string; result: string }> = ({ a, b, result }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const P = (at: number) => ({
    opacity: interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `scale(${interpolate(frame, [at, at + 11], [0.92, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
  });
  const barW = interpolate(frame, [30, 44], [0, Math.min(width * 0.5, 820)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: creamBg(GOLD), alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: FONT, fontWeight: 900, color: INK }}>
        <span style={{ fontSize: 96, ...P(4) }}>{a}</span>
        <span style={{ fontSize: 76, opacity: interpolate(frame, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>÷</span>
        <span style={{ fontSize: 76, ...P(16) }}>{b}</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: INK, width: barW, margin: "34px 0" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK, ...P(46),
        textShadow: `0 6px 26px ${GOLD}66` }}>{result}</div>
    </AbsoluteFill>
  );
};
