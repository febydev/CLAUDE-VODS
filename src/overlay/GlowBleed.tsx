import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, BLUE } from "../theme";

// Soft radial glow bleed. Warm gold for emotional bookends, cool blue-white for cosmic shots.
// Spec: ~40px blur radius, 60-70% opacity, low saturation. NEVER during fact sections.
export const GlowBleed: React.FC<{ color: "gold" | "blue"; intensity?: number }> = ({ color, intensity = 0.65 }) => {
  const frame = useCurrentFrame();
  const c = color === "gold" ? GOLD : BLUE;
  const breathe = 0.85 + 0.15 * Math.sin(frame / 30);
  const inn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const op = intensity * breathe * inn;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 28 }}>
      {/* edge bloom */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 220px ${c}`, opacity: op * 0.5, filter: "blur(8px)" }} />
      {/* soft center radial lift */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 46%, ${c}44, transparent 70%)`, opacity: op }} />
    </AbsoluteFill>
  );
};
