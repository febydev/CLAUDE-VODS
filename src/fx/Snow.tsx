import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

// Restrained drifting snow for EXTERIOR ancient shots (§9: below 15% frame coverage).
// Two depth bands so it reads as weather, not confetti. Wind drifts left-to-right slowly.
export const Snow: React.FC<{ count?: number; dir?: number }> = ({ count = 46, dir = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 24 }}>
      {new Array(count).fill(0).map((_, i) => {
        const near = i % 3 === 0;
        const sx = random(`sx${i}`) * width;
        const sy = random(`sy${i}`) * height;
        const fall = 0.35 + random(`sp${i}`) * (near ? 1.1 : 0.5);
        const y = (sy + frame * fall) % height;
        const x = sx + Math.sin(frame / 60 + i) * (near ? 26 : 12) + dir * frame * (near ? 0.35 : 0.16);
        const r = near ? 2.4 + random(`r${i}`) * 2.2 : 1.1 + random(`r${i}`) * 1.2;
        const op = (near ? 0.5 : 0.3) * (0.6 + 0.4 * Math.abs(Math.sin(frame / 40 + i)));
        return (
          <div key={i} style={{
            position: "absolute", left: x % (width + 60) - 30, top: y,
            width: r, height: r, borderRadius: "50%", background: "#EAF2F7",
            opacity: op, filter: near ? "blur(0.4px)" : "blur(0.9px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
