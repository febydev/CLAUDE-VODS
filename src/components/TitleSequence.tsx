import { AbsoluteFill, interpolate, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Cinematic opening title. Sits over the opening dawn imagery with a soft scrim.
const Word: React.FC<{ children: React.ReactNode; delay: number; size: number }> = ({
  children,
  delay,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 90, mass: 0.8 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [40, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize: size,
        lineHeight: 1.05,
      }}
    >
      {children}
    </div>
  );
};

export const TitleSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scrim = interpolate(frame, [0, fps], [0, 0.55], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  // animated underline sweep
  const lineW = interpolate(frame, [fps * 1.4, fps * 2.6], [0, 620], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${scrim * 0.7}) 0%, rgba(0,0,0,${
            scrim * 0.2
          }) 45%, rgba(0,0,0,${scrim}) 100%)`,
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
          textShadow: "0 6px 30px rgba(0,0,0,0.9)",
          padding: "0 120px",
        }}
      >
        <Word delay={6} size={30}>
          <div style={{ letterSpacing: 8, color: "#ffd27a", fontWeight: 700 }}>
            A HISTORY THEY LEFT OUT
          </div>
        </Word>
        <div style={{ height: 24 }} />
        <Word delay={18} size={92}>
          <div style={{ fontWeight: 800 }}>How Did Ancient Women</div>
        </Word>
        <Word delay={30} size={92}>
          <div style={{ fontWeight: 800 }}>Handle Their Periods?</div>
        </Word>
        <div
          style={{
            height: 4,
            width: lineW,
            marginTop: 30,
            background: "linear-gradient(90deg, rgba(255,210,122,0), #ffd27a, rgba(255,210,122,0))",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
