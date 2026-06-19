import { AbsoluteFill } from "remotion";

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.5 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 30,
        background: `radial-gradient(ellipse 75% 75% at 50% 48%, rgba(0,0,0,0) 38%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
};
