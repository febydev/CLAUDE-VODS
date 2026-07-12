import { AbsoluteFill } from "remotion";

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.3 }) => {
  if (intensity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", zIndex: 30,
        background: `radial-gradient(ellipse 80% 80% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,${Math.min(intensity, 0.55)}) 100%)`,
      }}
    />
  );
};
