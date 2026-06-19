import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS, ANTON } from "../theme";

// Full-screen quote card; words reveal in sequence (Section 5.3 / 18).
export const QuoteCard: React.FC<{
  text: string;
  color: string;
  bgImage?: string | null;
  hero?: boolean;
}> = ({ text, color, bgImage = null, hero = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = text.split(/\s+/);

  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#04060a", opacity: out }}>
      {bgImage ? (
        <Img src={staticFile(`images/${bgImage}`)} style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          filter: "brightness(0.4) saturate(0.8) blur(7px)", transform: `scale(${1.06 + frame * 0.0004})`,
        }} />
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2), rgba(0,0,0,0.85))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
        <div style={{ textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.06em 0.28em" }}>
          {text.split("\n").map((line, li) => (
            <div key={li} style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.28em" }}>
              {line.split(/\s+/).map((w, wi) => {
                const globalIdx = text.split("\n").slice(0, li).join(" ").split(/\s+/).filter(Boolean).length + wi;
                const delay = globalIdx * 4 + 4;
                const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 } });
                return (
                  <span key={wi} style={{
                    fontFamily: hero ? ANTON : BEBAS,
                    fontSize: hero ? 150 : 92,
                    lineHeight: 1.02,
                    color: "#fff",
                    letterSpacing: hero ? 1 : 2,
                    opacity: s,
                    transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,
                    textShadow: `0 0 38px ${color}aa, 0 8px 30px rgba(0,0,0,0.8)`,
                    display: "inline-block",
                  }}>
                    {w}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {/* accent underline */}
        <div style={{
          marginTop: 38, height: 6, width: interpolate(frame, [8, 34], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          background: color, borderRadius: 4, boxShadow: `0 0 24px ${color}`,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
