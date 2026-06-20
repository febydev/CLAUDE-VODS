import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

// Warm welcome/title card for the host opening (covers the pre-IMG001 voiceover).
export const TitleCard: React.FC<{ title: string[]; sub: string; accent: string }> = ({ title, sub, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subO = interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #dbf0f6 0%, #b3d7e6 60%, #97c2d4 100%)" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 72% 22%, ${accent}33, transparent 55%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          {title.map((line, i) => {
            const s = spring({ frame: frame - (i * 7 + 4), fps, config: { damping: 13, mass: 0.7 } });
            return <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 132, lineHeight: 1.0, color: "#123244",
              opacity: interpolate(frame - (i * 7 + 4), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, textShadow: "0 6px 20px rgba(20,60,80,0.25)" }}>{line}</div>;
          })}
          <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 600, fontSize: 44, color: "#2a5a6e", opacity: subO }}>{sub}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
