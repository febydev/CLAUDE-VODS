import { AbsoluteFill, interpolate, Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Stat = { to: number; label: string; prefix?: string; suffix?: string };

// Counts up 0 -> target over ~1.5s with a bounce on completion.
export const NumberCounter: React.FC<{ stat: Stat; color?: string }> = ({
  stat,
  color = "#ffd27a",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const countDur = fps * 1.5;
  const value = Math.round(
    interpolate(frame, [0, countDur], [0, stat.to], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const bounce = spring({
    frame: frame - countDur,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.6 },
  });
  const scale = frame >= countDur ? interpolate(bounce, [0, 1], [0.82, 1]) : 0.82;

  const enter = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [durationInFrames - fps * 0.5, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(enter, exit);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}
    >
      <div style={{ opacity, textAlign: "center", transform: `scale(${scale})` }}>
        <div
          style={{
            color,
            fontFamily: "'Arial Black', Impact, sans-serif",
            fontWeight: 900,
            fontSize: 220,
            lineHeight: 1,
            textShadow: "0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255,180,60,0.4)",
          }}
        >
          {stat.prefix ?? ""}
          {value}
          {stat.suffix ?? ""}
        </div>
        <div
          style={{
            color: "#fff",
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            letterSpacing: 4,
            fontSize: 40,
            textTransform: "uppercase",
            marginTop: 10,
            textShadow: "0 3px 16px rgba(0,0,0,0.9)",
          }}
        >
          {stat.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
