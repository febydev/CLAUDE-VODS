import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, textShadowOutline } from "../theme";
import type { Overlay } from "../types";

// On-screen probability reveal. Enters at 92% scale / 0% opacity -> 100%/100% using the
// OVERSHOOT punch curve, landing exactly on the spoken word (revealLocal). Exits via 200ms fade.
// Bold Poppins, white fill + black stroke to match the thumbnail brand.
export const ProbabilityText: React.FC<{ overlay: Overlay }> = ({ overlay }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = overlay.revealLocal;
  const punchDur = 11; // ~370ms @30fps

  if (frame < d) return null;

  const local = frame - d;
  const scale = interpolate(local, [0, punchDur], [0.92, 1], { easing: PUNCH, extrapolateRight: "clamp" });
  const opIn = interpolate(local, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // 200ms linear fade
  const op = Math.min(opIn, opOut);

  const climax = overlay.climax;
  const size = climax ? 200 : 92;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 34,
      alignItems: "center", justifyContent: climax ? "center" : "flex-end",
      paddingBottom: climax ? 0 : "12%" }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.0,
        color: "#ffffff", textShadow: textShadowOutline, letterSpacing: 1,
        transform: `scale(${scale})`, opacity: op, textAlign: "center", maxWidth: "88%",
        WebkitTextStroke: climax ? "2px #000" : undefined,
      }}>{overlay.text}</div>
    </AbsoluteFill>
  );
};
