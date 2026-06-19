import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Light sweep / shimmer: gradient sweeps left->right, white ~20%, ~1.2s (Section 5.3).
export const ShimmerOverlay: React.FC<{ delay?: number; opacity?: number }> = ({ delay = 4, opacity = 0.2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = Math.round(fps * 1.2); // 1.2s
  const local = frame - delay;
  if (local < 0 || local > dur) return null;
  const pos = interpolate(local, [0, dur], [-40, 140]); // % across screen
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 34, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: "45%",
        transform: "skewX(-18deg)",
        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${opacity}) 50%, transparent 100%)`,
      }} />
    </AbsoluteFill>
  );
};
