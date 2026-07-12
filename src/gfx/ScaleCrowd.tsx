import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, INK, SCI, creamBg, fitFont } from "../theme";

// "8 billion" / "1.4 billion": thousands of tiny figures explode from center into a dense
// edge-to-edge field (staggered), then hold — the density IS the message.
export const ScaleCrowd: React.FC<{ label: string; color?: string; count?: number }> = ({ label, color = SCI, count = 1300 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2, cy = height * 0.46;
  const labO = interpolate(frame, [46, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labS = interpolate(frame, [46, 58], [0.92, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: creamBg(color) }}>
      {new Array(count).fill(0).map((_, i) => {
        const gx = (i % 52) / 51 * width * 0.92 + width * 0.04;
        const gy = Math.floor(i / 52) / 24 * height * 0.78 + height * 0.06;
        const delay = (random(`d${i}`) * 18);
        const p = interpolate(frame, [delay, delay + 10], [0, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = cx + (gx - cx) * p, y = cy + (gy - cy) * p;
        const s = p * 1;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 8, height: 8, borderRadius: "50%",
          background: color, opacity: 0.85 * p, transform: `scale(${s})` }} />;
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: fitFont(label, 130), color: INK, opacity: labO, transform: `scale(${labS})`,
          textShadow: "0 4px 26px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7)" }}>{label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
