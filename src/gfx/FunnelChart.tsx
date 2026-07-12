import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, KB_EASE, INK, SCI, creamBg } from "../theme";

// "12% carry it, only a small fraction develop it": funnel draws, top fills, a particle
// falls through narrowing to a single tiny glowing point at the base.
export const FunnelChart: React.FC<{ topLabel: string; bottomLabel: string }> = ({ topLabel, bottomLabel }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2, top = height * 0.24, bot = height * 0.66;
  const topHalf = 260, botHalf = 26;
  const draw = interpolate(frame, [4, 20], [0, 1], { easing: KB_EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fill = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fall = interpolate(frame, [34, 58], [0, 1], { easing: KB_EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const py = top + (bot - top) * fall;
  const half = topHalf + (botHalf - topHalf) * fall;
  const pr = 22 + (5 - 22) * fall;

  const pts = `${cx - topHalf},${top} ${cx + topHalf},${top} ${cx + botHalf},${bot} ${cx - botHalf},${bot}`;

  return (
    <AbsoluteFill style={{ background: creamBg(SCI) }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <polygon points={pts} fill={`${SCI}22`} stroke={INK} strokeWidth={4} strokeDasharray={2000} strokeDashoffset={(1 - draw) * 2000} />
        {/* top fill band (the 12%) */}
        <rect x={cx - topHalf} y={top} width={topHalf * 2} height={(bot - top) * 0.32 * fill} fill={`${SCI}55`} />
      </svg>
      {/* falling particle */}
      <div style={{ position: "absolute", left: cx, top: py, width: pr, height: pr, transform: "translate(-50%,-50%)", borderRadius: "50%", background: SCI, boxShadow: `0 0 20px ${SCI}` }} />
      <div style={{ position: "absolute", top: top - 70, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: INK, opacity: fill }}>{topLabel}</div>
      <div style={{ position: "absolute", top: bot + 30, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: INK, opacity: interpolate(frame, [54, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{bottomLabel}</div>
    </AbsoluteFill>
  );
};
