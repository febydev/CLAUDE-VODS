import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON } from "../theme";

// Kinetic typography takeover — words SLAM in (Section 26). Capped at 3 per video.
export const KineticText: React.FC<{ words: string[]; color: string; hardBlack?: boolean }> = ({
  words, color, hardBlack = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const per = Math.max(10, Math.floor((durationInFrames - 12) / words.length));
  const single = words.length === 1;

  return (
    <AbsoluteFill style={{ backgroundColor: hardBlack ? "#000" : "#06080c", alignItems: "center", justifyContent: "center" }}>
      {!hardBlack && (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${color}22, transparent 60%)` }} />
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {words.map((w, i) => {
          const delay = i * per;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.8, stiffness: 140 } });
          const appear = interpolate(frame - delay, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const scale = single ? 1 + (1 - s) * 1.4 : interpolate(s, [0, 1], [2.0, 1]);
          return (
            <div key={i} style={{
              fontFamily: ANTON,
              fontSize: single ? 360 : 132,
              color: "#fff",
              letterSpacing: 2,
              opacity: appear,
              transform: `scale(${scale})`,
              textShadow: `0 0 50px ${color}, 0 0 100px ${color}99`,
              lineHeight: 0.96,
            }}>
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
