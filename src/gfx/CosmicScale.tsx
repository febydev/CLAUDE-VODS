import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, BLUE, textShadowOutline, fitFont } from "../theme";
import { StarField } from "../fx/StarField";

// Astronomical-odds beats + the septillion climax: a deep star field with the number over it.
// climax adds a central glowing human silhouette (lit cool blue-white) with stars drifting past.
export const CosmicScale: React.FC<{ label: string; climax?: boolean; figure?: boolean }> = ({ label, climax, figure }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const at = climax ? 20 : 10;
  const o = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = interpolate(frame, [at, at + 12], [0.9, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = 0.6 + 0.4 * Math.sin(frame / 16);

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <StarField count={climax ? 320 : 240} />
      {figure ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 200, height: 380, opacity: interpolate(frame, [4, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
            <div style={{ position: "absolute", left: "50%", top: 20, width: 90, height: 90, transform: "translateX(-50%)", borderRadius: "50%", background: "#eaf4ff", boxShadow: `0 0 ${40 * glowPulse}px ${BLUE}, 0 0 ${90 * glowPulse}px ${BLUE}` }} />
            <div style={{ position: "absolute", left: "50%", top: 118, width: 120, height: 220, transform: "translateX(-50%)", borderRadius: "60px 60px 40px 40px", background: "#eaf4ff", boxShadow: `0 0 ${44 * glowPulse}px ${BLUE}, 0 0 ${110 * glowPulse}px ${BLUE}` }} />
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: climax ? "flex-end" : "center", paddingBottom: climax ? "14%" : 0, paddingLeft: "5%", paddingRight: "5%" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: fitFont(label, climax ? 150 : 92), color: "#fff",
          opacity: o, transform: `scale(${s})`, textShadow: textShadowOutline, textAlign: "center", maxWidth: "92%", lineHeight: 1.06 }}>{label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
