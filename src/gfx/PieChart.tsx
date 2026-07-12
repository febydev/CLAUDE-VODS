import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, KB_EASE, PUNCH, INK, RED, GREY_DOT, creamBg } from "../theme";

// Code pie chart: outline draws itself, then the highlighted wedge grows to its angle.
// Real data (not a panned picture). props: percent (0-100) for the highlighted wedge.
export const PieChart: React.FC<{ percent: number; label: string; highlightColor?: string }> = ({ percent, label, highlightColor = RED }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const R = Math.min(width * 0.16, 300);
  const circ = 2 * Math.PI * R;
  const draw = interpolate(frame, [4, 16], [circ, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const deg = interpolate(frame, [16, 40], [0, percent * 3.6], { easing: KB_EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labO = interpolate(frame, [40, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labS = interpolate(frame, [40, 52], [0.92, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: creamBg(highlightColor), alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: R * 2, height: R * 2 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
          background: `conic-gradient(from -90deg, ${highlightColor} 0deg ${deg}deg, ${GREY_DOT} ${deg}deg 360deg)`,
          boxShadow: `0 10px 40px rgba(0,0,0,0.15)` }} />
        <svg width={R * 2} height={R * 2} style={{ position: "absolute", inset: 0 }}>
          <circle cx={R} cy={R} r={R - 3} fill="none" stroke={INK} strokeWidth={5}
            strokeDasharray={circ} strokeDashoffset={draw} transform={`rotate(-90 ${R} ${R})`} />
        </svg>
      </div>
      <div style={{ marginTop: 44, fontFamily: FONT, fontWeight: 900, fontSize: 72, color: INK, opacity: labO, transform: `scale(${labS})` }}>{label}</div>
    </AbsoluteFill>
  );
};
