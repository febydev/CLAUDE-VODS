import { interpolate, Easing, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

// Fade in + slide up, hold, then fade out before scene end.
export const TextReveal: React.FC<{
  text: string;
  position: "center" | "lower";
}> = ({ text, position }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const inEnd = fps * 0.7;
  const outStart = durationInFrames - fps * 0.7;

  const enter = interpolate(frame, [0, inEnd], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [outStart, durationInFrames], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exit);
  const translateY = interpolate(enter, [0, 1], [22, 0]);

  const isCenter = position === "center";

  return (
    <AbsoluteFill
      style={{
        justifyContent: isCenter ? "center" : "flex-end",
        alignItems: "center",
        paddingBottom: isCenter ? 0 : 120,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          color: "#fff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 700,
          letterSpacing: isCenter ? 2 : 3,
          fontSize: isCenter ? 86 : 46,
          textAlign: "center",
          textTransform: "uppercase",
          textShadow:
            "0 4px 24px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)",
          padding: "0 80px",
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
