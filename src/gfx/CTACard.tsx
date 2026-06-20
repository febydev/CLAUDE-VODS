import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, random } from "remotion";
import { FONT } from "../theme";

// CTA end card (Section 9 Type 12). Bold takeaway, particle burst, glow border, energetic.
export const CTACard: React.FC<{ big: string; sub: string; accent: string }> = ({ big, sub, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.5;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 18);
  const subS = spring({ frame: frame - 28, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #16323f 0%, #08151d 80%)", alignItems: "center", justifyContent: "center" }}>
      {/* gentle heart/particle burst */}
      {new Array(36).fill(0).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const dist = interpolate(frame, [0, 70], [0, 240 + random(`d${i}`) * 360], { extrapolateRight: "clamp" });
        const rise = frame * (0.3 + random(`v${i}`) * 0.8);
        const x = cx + Math.cos(ang) * dist, y = cy + Math.sin(ang) * dist * 0.5 - rise;
        const life = interpolate(frame, [0, 14, 80, 110], [0, 1, 1, 0], { extrapolateRight: "clamp" });
        const r = 3 + random(`r${i}`) * 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: accent, opacity: life, boxShadow: `0 0 ${r * 3}px ${accent}` }} />;
      })}
      <div style={{ position: "absolute", inset: 26, border: `2px solid ${accent}`, opacity: 0.3 + pulse * 0.4, boxShadow: `inset 0 0 70px ${accent}55, 0 0 40px ${accent}44` }} />
      <div style={{ textAlign: "center", padding: "0 8%" }}>
        {big.split("\n").map((line, i) => (
          <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 100, color: "#fff", lineHeight: 1.04,
            opacity: interpolate(frame, [i * 8 + 4, i * 8 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [i * 8 + 4, i * 8 + 18], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            textShadow: `0 0 40px ${accent}aa` }}>{line}</div>
        ))}
        <div style={{ marginTop: 38, fontFamily: FONT, fontWeight: 600, fontSize: 46, letterSpacing: 2, color: accent, opacity: subS, transform: `scale(${0.9 + subS * 0.1})` }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};
