import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Deterministic, frame-accurate particle drift (white/gold motes rising).
// Deterministic instead of tsparticles so the headless render is reproducible
// frame-for-frame (no RNG drift between render passes).
const mulberry = (seed: number) => {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const Particles: React.FC<{ count?: number; gold?: boolean }> = ({
  count = 42,
  gold = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.6, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const groupOpacity = Math.min(fadeIn, fadeOut);

  const dots = new Array(count).fill(0).map((_, i) => {
    const rx = mulberry(i * 3 + 1);
    const ry = mulberry(i * 7 + 3);
    const rs = mulberry(i * 11 + 5);
    const rspeed = mulberry(i * 13 + 9);
    const size = 1.5 + rs * 4;
    const speed = (0.25 + rspeed * 0.6) * fps; // px per frame-ish
    const startY = ry * height;
    const y = ((startY - frame * (speed / fps) * 6) % (height + 60) + (height + 60)) % (height + 60);
    const x = rx * width + Math.sin((frame / fps) * (0.5 + rs) + i) * 18;
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin((frame / fps) * 1.3 + i));
    const color = gold
      ? `rgba(255, ${200 + Math.floor(rs * 40)}, ${120 + Math.floor(rs * 80)}, ${twinkle})`
      : `rgba(255,255,255,${twinkle})`;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${size * 2.5}px ${color}`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: groupOpacity }}>{dots}</AbsoluteFill>
  );
};
