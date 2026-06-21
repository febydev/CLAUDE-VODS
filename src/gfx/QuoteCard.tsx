import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG } from "../theme";

// Quote card (Section 9 Type 1) in the frosted-glass style from the references:
// warm gradient-depth bg, a blurred glass panel whose accent border DRAWS IN
// (stroke-dashoffset) with a diagonal gloss sweep; words fade in one by one.
export const QuoteCard: React.FC<{ text: string; accent: string; hero?: boolean }> = ({ text, accent, hero }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lines = text.split("\n");
  let wordIdx = 0;

  // glass panel sizing
  const W = Math.min(1360, width - 240);
  const H = hero ? 560 : 460;
  const peri = 2 * (W + H);
  const draw = interpolate(frame, [4, 30], [peri, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const glossX = interpolate(frame, [8, 34], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: out, background: MG_BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 18%, ${accent}22, transparent 55%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "relative", width: W, minHeight: H, borderRadius: 28,
          background: "rgba(255,244,228,0.06)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.45), inset 0 0 60px ${accent}14`,
          opacity: cardIn, transform: `scale(${interpolate(cardIn, [0, 1], [0.96, 1])})`,
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          {/* drawing accent border */}
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={26} fill="none" stroke={accent} strokeWidth={2.5}
              strokeDasharray={peri} strokeDashoffset={draw} style={{ filter: `drop-shadow(0 0 8px ${accent})` }} />
          </svg>
          {/* diagonal gloss sweep */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${glossX}%`, width: "26%", transform: "skewX(-18deg)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

          <div style={{ textAlign: "center", padding: "0 8%" }}>
            {lines.map((line, li) => (
              <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.3em" }}>
                {line.split(/\s+/).map((w, wi) => {
                  const d = (wordIdx++) * 4 + 16;
                  const o = interpolate(frame, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const y = interpolate(frame, [d, d + 12], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <span key={wi} style={{
                      fontFamily: FONT, fontWeight: 800, fontSize: hero ? 92 : 70, lineHeight: 1.18,
                      color: "#FFF6EA", opacity: o, transform: `translateY(${y}px)`, display: "inline-block",
                      textShadow: `0 0 26px ${accent}55, 0 6px 22px rgba(0,0,0,0.5)`,
                    }}>{w}</span>
                  );
                })}
              </div>
            ))}
            <div style={{
              margin: "30px auto 0", height: 5, borderRadius: 4, background: accent,
              width: interpolate(frame, [22, 46], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              boxShadow: `0 0 22px ${accent}`,
            }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
