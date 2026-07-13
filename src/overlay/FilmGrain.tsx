import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// Animated film grain via SVG feTurbulence (Section 7.1). 3-4% opacity, always on.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(frame) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 58, opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
