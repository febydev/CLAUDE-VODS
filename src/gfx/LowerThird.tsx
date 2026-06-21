import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG } from "../theme";

// Lower-third / section label (Section 9 Type 10). Slides in, accent bar, frosted glass, exits.
// Standalone (REPLACE) = centered chapter card on warm depth; overlay = bottom-left banner on a photo.
export const LowerThird: React.FC<{ label: string; accent: string; standalone?: boolean }> = ({ label, accent, standalone }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inn = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inn, out);
  const x = interpolate(op, [0, 1], [-60, 0]);

  if (!standalone) {
    return (
      <div style={{ position: "absolute", left: "7%", bottom: "16%", display: "flex", alignItems: "stretch", opacity: op, transform: `translateX(${x}px)`, zIndex: 20 }}>
        <div style={{ width: 10, background: accent, boxShadow: `0 0 18px ${accent}` }} />
        <div style={{ background: "rgba(22,13,8,0.78)", backdropFilter: "blur(6px)", padding: "16px 34px", borderTop: `1px solid ${accent}55`, borderBottom: `1px solid ${accent}55` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, letterSpacing: 3, color: "#FFF6EA" }}>{label}</div>
        </div>
      </div>
    );
  }

  // standalone chapter card — frosted glass, accent bar, gloss
  const glossX = interpolate(frame, [8, 36], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: MG_BG, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 36%, ${accent}22, transparent 55%)` }} />
      <div style={{ position: "relative", display: "flex", alignItems: "stretch", opacity: op, transform: `translateX(${x}px)`, overflow: "hidden", borderRadius: 16 }}>
        <div style={{ width: 14, background: accent, boxShadow: `0 0 26px ${accent}` }} />
        <div style={{ background: "rgba(255,244,228,0.07)", backdropFilter: "blur(12px)", padding: "34px 64px", border: `1px solid ${accent}40` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, letterSpacing: 2, color: "#FFF6EA", textShadow: `0 0 30px ${accent}55` }}>{label}</div>
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${glossX}%`, width: "24%", transform: "skewX(-18deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
      </div>
    </AbsoluteFill>
  );
};
