import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

// Lower-third / section label (Section 9 Type 10). Slides in bottom-left, accent bar, exits.
// On REPLACE scenes it stands alone over a soft gradient; as ENHANCE it overlays a photo.
export const LowerThird: React.FC<{ label: string; accent: string; standalone?: boolean }> = ({ label, accent, standalone }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inn = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inn, out);
  const x = interpolate(op, [0, 1], [-60, 0]);

  const banner = (
    <div style={{ position: "absolute", left: "7%", bottom: standalone ? "46%" : "18%", display: "flex", alignItems: "stretch", opacity: op, transform: `translateX(${x}px)`, zIndex: 20 }}>
      <div style={{ width: 10, background: accent, boxShadow: `0 0 18px ${accent}` }} />
      <div style={{ background: "rgba(8,18,26,0.82)", padding: "16px 34px", borderTop: `1px solid ${accent}55`, borderBottom: `1px solid ${accent}55` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, letterSpacing: 4, color: "#fff" }}>{label}</div>
      </div>
    </div>
  );

  if (!standalone) return banner;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, #16323f 0%, #08151d 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 40%, ${accent}22, transparent 55%)` }} />
      {banner}
    </AbsoluteFill>
  );
};
