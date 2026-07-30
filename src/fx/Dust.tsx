import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

// VIDEO_EDITOR section 7.2: slow floating dust, 8-12% opacity, dramatic/emotional scenes only.
// Deterministic pseudo-random placement so a given shot always renders identically across the
// parallel chunk boundaries (a seeded look is essential when 8 runners each render a slice).
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Dust: React.FC<{ count?: number; intensity?: number; seed?: number }> = ({
  count = 34,
  intensity = 1,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = seed * 100 + i;
        const size = 1.5 + rnd(s) * 4.2;
        const driftY = 14 + rnd(s + 1) * 30;      // slow vertical drift, px over the shot
        const driftX = (rnd(s + 2) - 0.5) * 42;
        const speed = 0.14 + rnd(s + 3) * 0.2;
        const x = rnd(s + 4) * width;
        const y0 = rnd(s + 5) * height;
        const y = (y0 - frame * speed * (driftY / 22) + height) % height;
        const x2 = x + Math.sin((frame + i * 9) / 62) * driftX;
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame + i * 17) / 34));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x2,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: PAL.ivory,
              opacity: 0.1 * intensity * twinkle,
              filter: "blur(0.6px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
