import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Light sweep / shimmer (Section 7.4). MAX 4 uses per video. Gradient L->R over ~1.5s, white 20%.
export const ShimmerOverlay: React.FC<{ delay?: number }> = ({ delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = Math.round(fps * 1.5);
  const local = frame - delay;
  if (local < 0 || local > dur) return null;
  const pos = interpolate(local, [0, dur], [-45, 145]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 40, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: "42%",
        transform: "skewX(-16deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
      }} />
    </AbsoluteFill>
  );
};
