import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Animated pulsing glow frame around the scene. Pulse cycle 0.3 -> 1.0 -> 0.3.
export const GlowBorder: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2.4; // ~2.4s pulse
  const phase = (frame % cycle) / cycle;
  // triangle wave 0->1->0
  const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  const strength = interpolate(tri, [0, 1], [0.3, 1.0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 ${120 * strength}px ${28 * strength}px ${color}`,
          opacity: strength,
        }}
      />
    </AbsoluteFill>
  );
};
