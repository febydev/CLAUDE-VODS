import { AbsoluteFill, interpolate, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";

// End-card call to action: glow border pulse + text reveal over the final image.
export const CTACard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scrim = interpolate(frame, [0, fps], [0, 0.6], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - fps, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  const headline = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 90 } });
  const sub = spring({ frame: frame - 26, fps, config: { damping: 16, stiffness: 90 } });

  // glow pulse
  const cycle = fps * 2;
  const phase = (frame % cycle) / cycle;
  const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  const glow = interpolate(tri, [0, 1], [0.35, 1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeOut }}>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${scrim})` }} />
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 ${140 * glow}px ${34 * glow}px rgba(255,190,70,0.7)`,
          opacity: glow,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "#fff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "0 140px",
          textShadow: "0 6px 30px rgba(0,0,0,0.9)",
        }}
      >
        <div
          style={{
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [40, 0])}px)`,
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.12,
          }}
        >
          Now you know what they
          <br />
          would have put in them.
        </div>
        <div
          style={{
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [30, 0])}px)`,
            marginTop: 40,
            fontSize: 38,
            letterSpacing: 6,
            color: "#ffd27a",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Subscribe for the next one
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
