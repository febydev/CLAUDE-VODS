import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, random } from "remotion";
import { FONT, GOLD, textShadowOutline } from "../theme";

// End card — warm emotional close continues here. Gentle gold particle drift, glow border.
export const CTACard: React.FC<{ big: string; sub: string }> = ({ big, sub }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.44;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 20);
  const subS = spring({ frame: frame - 30, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 44%, #241a0e 0%, #140d06 70%, #0a0603 100%)", alignItems: "center", justifyContent: "center" }}>
      {new Array(46).fill(0).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const dist = interpolate(frame, [0, 90], [0, 260 + random(`d${i}`) * 420], { extrapolateRight: "clamp" });
        const rise = frame * (0.25 + random(`v${i}`) * 0.8);
        const x = cx + Math.cos(ang) * dist, y = cy + Math.sin(ang) * dist * 0.5 - rise;
        const life = interpolate(frame, [0, 16, 100, 140], [0, 1, 1, 0], { extrapolateRight: "clamp" });
        const r = 2 + random(`r${i}`) * 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: GOLD, opacity: life * 0.8, boxShadow: `0 0 ${r * 3}px ${GOLD}` }} />;
      })}
      <div style={{ position: "absolute", inset: 26, border: `2px solid ${GOLD}`, borderRadius: 14, opacity: 0.28 + pulse * 0.35, boxShadow: `inset 0 0 80px ${GOLD}33, 0 0 40px ${GOLD}22` }} />
      <div style={{ textAlign: "center", padding: "0 8%" }}>
        {big.split("\n").map((line, i) => (
          <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff", lineHeight: 1.08, textShadow: textShadowOutline,
            opacity: interpolate(frame, [i * 8 + 4, i * 8 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [i * 8 + 4, i * 8 + 18], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` }}>{line}</div>
        ))}
        <div style={{ marginTop: 40, fontFamily: FONT, fontWeight: 700, fontSize: 44, letterSpacing: 2, color: GOLD, opacity: subS, transform: `scale(${0.9 + subS * 0.1})` }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};
