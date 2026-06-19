import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";

// Celebration / emotional-peak particle burst (Section 5.3). Use sparingly.
export const Particles: React.FC<{ count?: number; gold?: boolean }> = ({ count = 48, gold = true }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.52;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 27 }}>
      {new Array(count).fill(0).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const dist = interpolate(frame, [0, 60], [0, 220 + random(`d${i}`) * 360], { extrapolateRight: "clamp" });
        const rise = frame * (0.4 + random(`v${i}`) * 1.1);
        const x = cx + Math.cos(ang) * dist;
        const y = cy + Math.sin(ang) * dist * 0.5 - rise;
        const life = interpolate(frame, [0, 12, 70, 100], [0, 1, 1, 0], { extrapolateRight: "clamp" });
        const r = 2 + random(`r${i}`) * 4;
        const c = gold ? `rgba(255,${190 + Math.floor(random(i) * 50)},90,1)` : "rgba(180,225,255,1)";
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%",
            background: c, opacity: life, boxShadow: `0 0 ${r * 3}px ${c}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Expanding concentric rings — "rippling through the living world" (IMG080).
export const Ripple: React.FC<{ color?: string }> = ({ color = "rgba(255,200,110,1)" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 27 }}>
      {[0, 1, 2, 3, 4].map((k) => {
        const local = (frame - k * 14) % 70;
        if (local < 0) return null;
        const scale = interpolate(local, [0, 70], [0, 1]);
        const op = interpolate(local, [0, 10, 70], [0, 0.5, 0]);
        const size = scale * Math.max(width, height) * 1.3;
        return (
          <div key={k} style={{
            position: "absolute", left: width / 2 - size / 2, top: height / 2 - size / 2,
            width: size, height: size, borderRadius: "50%",
            border: `2px solid ${color}`, opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
