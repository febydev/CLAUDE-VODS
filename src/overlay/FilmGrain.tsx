import { AbsoluteFill, useCurrentFrame } from "remotion";

// VIDEO_EDITOR section 7.1: film grain on every scene, 3-4% opacity, always on.
// The turbulence seed is re-randomised every other frame so the grain moves like real stock
// instead of sitting as a static texture.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.038 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves={3} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
