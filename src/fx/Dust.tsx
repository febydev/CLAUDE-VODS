import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";

// Atmospheric floating dust (Section 7.2). 8-12% opacity, dramatic/emotional scenes only.
export const Dust: React.FC<{ count?: number; color?: string; opacity?: number }> = ({
  count = 42, color = "rgba(255,225,235,1)", opacity = 0.1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 26, opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const sx = random(`x${i}`) * width;
        const sy = random(`y${i}`) * height;
        const sp = 0.18 + random(`s${i}`) * 0.5;
        const r = 1 + random(`r${i}`) * 2.4;
        const y = (sy - frame * sp) % height;
        const yy = y < 0 ? y + height : y;
        const x = sx + Math.sin(frame / 70 + i) * 16;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 32 + i));
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: yy, width: r, height: r, borderRadius: "50%",
            background: color, opacity: tw, filter: "blur(0.4px)", boxShadow: `0 0 ${r * 2}px ${color}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
