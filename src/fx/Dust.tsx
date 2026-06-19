import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";

// Subtle floating atmospheric dust in light beams (Section 5.3).
export const Dust: React.FC<{ count?: number; color?: string; opacity?: number }> = ({
  count = 60,
  color = "rgba(180,205,225,1)",
  opacity = 0.13,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 26, opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const sx = random(`x${i}`) * width;
        const sy = random(`y${i}`) * height;
        const sp = 0.25 + random(`s${i}`) * 0.6;
        const drift = (random(`d${i}`) - 0.5) * 60;
        const r = 1 + random(`r${i}`) * 2.6;
        const y = (sy - frame * sp) % height;
        const yy = y < 0 ? y + height : y;
        const x = sx + Math.sin((frame / 60) + i) * 14 + drift * (frame / 600);
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 30 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: x, top: yy,
              width: r, height: r, borderRadius: "50%",
              background: color, opacity: tw,
              filter: "blur(0.4px)",
              boxShadow: `0 0 ${r * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
