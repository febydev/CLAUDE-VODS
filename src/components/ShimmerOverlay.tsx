import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";

// A single light sweep left -> right, early in the scene. White at low opacity.
export const ShimmerOverlay: React.FC<{ delay?: number }> = ({ delay = 10 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const dur = fps * 1.2;
  const local = frame - delay;
  if (local < 0 || local > dur) return null;
  const p = interpolate(local, [0, dur], [0, 1], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(p, [0, 1], [-width * 0.6, width * 1.1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x,
          width: width * 0.5,
          transform: "skewX(-18deg)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
