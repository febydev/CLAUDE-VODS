import {AbsoluteFill, random, useCurrentFrame} from "remotion";

export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(`food-${frame}`) * 999);
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 100, opacity: 0.035, mixBlendMode: "overlay"}}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};