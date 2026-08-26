import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// Subtle paper/halftone grain (§8 texture). Always on, low opacity.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(frame) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60, opacity, mixBlendMode: "multiply" }}>
      <svg width="100%" height="100%">
        <filter id={`g-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
