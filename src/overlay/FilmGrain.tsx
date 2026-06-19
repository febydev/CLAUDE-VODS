import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// Animated film grain via SVG feTurbulence (Section 5.1, always on, 3-5% opacity).
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.045 }) => {
  const frame = useCurrentFrame();
  // reseed every frame so the grain shimmers
  const seed = Math.floor(random(frame) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 48, opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
