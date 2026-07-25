import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

// Warm drifting dust motes for ancient shots (§9A KENBURNS-PUSH note). Restrained, sunlit feel.
export const Dust: React.FC<{ count?: number; dir?: number }> = ({ count = 34, dir = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 24 }}>
      {new Array(count).fill(0).map((_, i) => {
        const near = i % 4 === 0;
        const sx = random(`dx${i}`) * width;
        const sy = random(`dy${i}`) * height;
        const rise = 0.12 + random(`dp${i}`) * 0.34;
        const y = (sy - frame * rise) % height;
        const yy = y < 0 ? y + height : y;
        const x = sx + Math.sin(frame / 70 + i) * (near ? 20 : 10) + dir * frame * 0.06;
        const r = near ? 2.2 + random(`dr${i}`) * 1.8 : 1 + random(`dr${i}`) * 1.1;
        const op = (near ? 0.4 : 0.24) * (0.55 + 0.45 * Math.abs(Math.sin(frame / 44 + i)));
        return (
          <div key={i} style={{
            position: "absolute", left: x % (width + 40) - 20, top: yy,
            width: r, height: r, borderRadius: "50%", background: "#F3DFB4",
            opacity: op, filter: near ? "blur(0.5px)" : "blur(1px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
