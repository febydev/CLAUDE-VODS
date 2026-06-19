import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Animated glow frame on scene entry (Section 5.2).
// intensity: 1.0 for built motion graphics, ~0.3 subtle for photo scenes.
export const GlowBorder: React.FC<{ color: string; intensity?: number }> = ({ color, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);
  const intro = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const inset = 18;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 32 }}>
      <div style={{
        position: "absolute", inset,
        boxShadow: `inset 0 0 ${(60 + pulse * 40) * (0.6 + 0.4 * intensity)}px ${color}`,
        opacity: (0.4 * intro + 0.25 * pulse) * intensity,
        borderRadius: 4,
      }} />
    </AbsoluteFill>
  );
};
