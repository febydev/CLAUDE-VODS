import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";

// Deep-space star field for the cosmic finale (septillion / stars / sand). Slow drift + twinkle,
// against near-black. Reinforces the scale comparison without competing with on-screen text.
export const StarField: React.FC<{ count?: number; opacity?: number }> = ({ count = 260, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const inn = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 5, opacity: opacity * inn, background: "radial-gradient(ellipse at 50% 50%, #060912 0%, #01030a 70%, #000 100%)" }}>
      {new Array(count).fill(0).map((_, i) => {
        const sx = random(`sx${i}`) * width;
        const sy = random(`sy${i}`) * height;
        const drift = (frame * (0.04 + random(`sp${i}`) * 0.10));
        const x = (sx + drift) % width;
        const r = 0.6 + random(`sr${i}`) * 2.2;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (18 + (i % 20)) + i));
        const warm = random(`sc${i}`) > 0.85;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: sy, width: r, height: r, borderRadius: "50%",
            background: warm ? "#ffe9c0" : "#dCeaff", opacity: tw,
            boxShadow: `0 0 ${r * 2.5}px ${warm ? "#ffe9c0" : "#bcd8ff"}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
