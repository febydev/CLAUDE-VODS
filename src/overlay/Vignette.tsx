import { AbsoluteFill } from "remotion";

// Vignette (Section 7.7). Opacity <= 0.3. Center always bright.
export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.3 }) => {
  if (intensity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", zIndex: 30,
        background: `radial-gradient(ellipse 78% 78% at 50% 48%, rgba(0,0,0,0) 46%, rgba(0,0,0,${Math.min(intensity, 0.3)}) 100%)`,
      }}
    />
  );
};
