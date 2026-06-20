import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

// Quote card (Section 9 Type 1). Dark gradient depth bg, words fade in one by one, accent line.
export const QuoteCard: React.FC<{ text: string; accent: string; hero?: boolean }> = ({ text, accent, hero }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lines = text.split("\n");
  let wordIdx = 0;

  return (
    <AbsoluteFill style={{ opacity: out, background: `radial-gradient(ellipse at 50% 38%, #3a2230 0%, #1a0e16 70%, #120a10 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 20%, ${accent}22, transparent 55%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 9%" }}>
        <div style={{ textAlign: "center" }}>
          {lines.map((line, li) => (
            <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.3em" }}>
              {line.split(/\s+/).map((w, wi) => {
                const d = (wordIdx++) * 4 + 4;
                const o = interpolate(frame, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const y = interpolate(frame, [d, d + 12], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <span key={wi} style={{
                    fontFamily: FONT, fontWeight: 700, fontSize: hero ? 96 : 74, lineHeight: 1.16,
                    color: "#fff", opacity: o, transform: `translateY(${y}px)`, display: "inline-block",
                    textShadow: `0 0 30px ${accent}66, 0 6px 26px rgba(0,0,0,0.6)`,
                  }}>{w}</span>
                );
              })}
            </div>
          ))}
          <div style={{
            margin: "34px auto 0", height: 5, borderRadius: 4, background: accent,
            width: interpolate(frame, [10, 36], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            boxShadow: `0 0 22px ${accent}`,
          }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
