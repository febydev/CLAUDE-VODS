import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

// §8A/§9 rain particles, driven by the shot's rain stage. Modes:
//  full     - full-frame streaks + foreground splashes (BUILDING / PEAK)
//  entrance - streaks confined to a vertical entrance band (SUSTAINED: seen only at the mouth)
//  none     - nothing (INTERIOR / DEEP)
//  sparse   - thin, slow, fewer streaks (EASING)
//  drips    - no streaks; slow foreground drips + wet glints (AFTER / RESOLVED)
// Always kept behind faces (low z) and under ~20% frame coverage.
export const Rain: React.FC<{ mode: string; intensity: number; dir?: number }> = ({ mode, intensity, dir = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (mode === "none" || intensity <= 0) return null;

  const bandX = 0.60;              // entrance band starts at 60% width
  const streaks =
    mode === "full" ? Math.round(150 * intensity) :
    mode === "entrance" ? Math.round(70 * intensity) :
    mode === "sparse" ? Math.round(38 * intensity * 2) : 0;
  const splashes = mode === "full" ? Math.round(16 * intensity) : 0;
  const drips = mode === "drips" ? 16 : 0;
  const slant = mode === "sparse" ? 5 : 11;   // storms slant harder than drizzle

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 22 }}>
      {/* falling streaks */}
      {new Array(streaks).fill(0).map((_, i) => {
        const near = i % 4 === 0;
        const bx = random(`rx${i}`);
        const x = (mode === "entrance" ? bandX + bx * (1 - bandX) : bx) * width;
        const speed = (mode === "sparse" ? 16 : 34) * (near ? 1.35 : 1) * (0.7 + random(`rs${i}`) * 0.6);
        const len = (mode === "sparse" ? 22 : 46) * (near ? 1.4 : 1) * (0.7 + random(`rl${i}`) * 0.7);
        const y = ((random(`ry${i}`) * height) + frame * speed) % (height + len) - len;
        const op = (near ? 0.34 : 0.20) * intensity;
        return (
          <div key={`s${i}`} style={{
            position: "absolute", left: x, top: y, width: near ? 2.2 : 1.4, height: len,
            background: "linear-gradient(to bottom, rgba(199,208,212,0), rgba(199,208,212,0.95))",
            opacity: op, transform: `rotate(${slant * dir}deg)`, filter: near ? "none" : "blur(0.5px)",
          }} />
        );
      })}

      {/* foreground splashes bouncing at the base (storm only) */}
      {new Array(splashes).fill(0).map((_, i) => {
        const cycle = 26 + Math.round(random(`sc${i}`) * 22);
        const t = (frame + Math.round(random(`so${i}`) * cycle)) % cycle / cycle;
        const x = random(`sx${i}`) * width;
        const baseY = height * (0.86 + random(`sy${i}`) * 0.12);
        const r = interpolate(t, [0, 1], [3, 26]);
        const op = interpolate(t, [0, 0.25, 1], [0, 0.34, 0]) * intensity;
        return (
          <div key={`p${i}`} style={{
            position: "absolute", left: x - r / 2, top: baseY - r / 6, width: r, height: r / 2.6,
            border: "1.6px solid rgba(214,224,228,0.85)", borderRadius: "50%",
            borderTopColor: "transparent", opacity: op,
          }} />
        );
      })}

      {/* slow drips + wet glints after the storm */}
      {new Array(drips).fill(0).map((_, i) => {
        const cycle = 52 + Math.round(random(`dc${i}`) * 44);
        const t = ((frame + Math.round(random(`do${i}`) * cycle)) % cycle) / cycle;
        const x = random(`dx${i}`) * width;
        const y0 = height * (0.04 + random(`dy${i}`) * 0.30);
        const y = y0 + t * height * 0.42;
        const op = interpolate(t, [0, 0.12, 0.85, 1], [0, 0.5, 0.4, 0]) * (intensity * 3);
        return (
          <div key={`d${i}`} style={{
            position: "absolute", left: x, top: y, width: 3, height: 12, borderRadius: 3,
            background: "rgba(224,236,240,0.95)", opacity: Math.min(0.55, op),
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
