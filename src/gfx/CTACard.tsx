import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, BEBAS } from "../theme";
import { Particles } from "../fx/Particles";

export const CTACard: React.FC<{ big: string; sub: string; color: string }> = ({ big, sub, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 18);
  const subS = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1a0e04 0%, #05070a 80%)", alignItems: "center", justifyContent: "center" }}>
      <Particles count={40} gold />
      <div style={{ position: "absolute", inset: 26, border: `2px solid ${color}`, opacity: 0.3 + pulse * 0.4, boxShadow: `inset 0 0 80px ${color}66, 0 0 50px ${color}44` }} />
      <div style={{ textAlign: "center", padding: "0 8%" }}>
        {big.split("\n").map((line, i) => (
          <div key={i} style={{
            fontFamily: ANTON, fontSize: 104, color: "#fff", letterSpacing: 1, lineHeight: 1.02,
            opacity: interpolate(frame, [i * 8 + 4, i * 8 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [i * 8 + 4, i * 8 + 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            textShadow: `0 0 40px ${color}aa`,
          }}>{line}</div>
        ))}
        <div style={{ marginTop: 40, fontFamily: BEBAS, fontSize: 52, letterSpacing: 4, color, opacity: subS, transform: `scale(${0.9 + subS * 0.1})` }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};
