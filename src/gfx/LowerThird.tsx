import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS } from "../theme";

// Broadcast lower-third that slides in bottom-left (Section 5.3).
export const LowerThird: React.FC<{ label: string; color: string }> = ({ label, color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inn = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inn, out);
  const x = interpolate(op, [0, 1], [-60, 0]);
  return (
    <div style={{
      position: "absolute", left: "6%", bottom: "20%", display: "flex", alignItems: "stretch",
      opacity: op, transform: `translateX(${x}px)`, zIndex: 20,
    }}>
      <div style={{ width: 8, background: color, boxShadow: `0 0 18px ${color}` }} />
      <div style={{
        background: "rgba(6,9,14,0.82)", padding: "14px 30px",
        borderTop: `1px solid ${color}55`, borderBottom: `1px solid ${color}55`,
        backdropFilter: "blur(2px)",
      }}>
        <div style={{ fontFamily: BEBAS, fontSize: 46, letterSpacing: 3, color: "#fff" }}>{label}</div>
      </div>
    </div>
  );
};
