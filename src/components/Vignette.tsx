import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Vignette: React.FC<{ intensity: number; durationInFrames: number }> = ({
  intensity,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  // ease the vignette in over the first 18 frames
  const opacity = interpolate(frame, [0, 18], [intensity * 0.4, intensity], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,${opacity}) 100%)`,
      }}
    />
  );
};
