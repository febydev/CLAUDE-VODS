import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER } from "../theme";

export const SplitScreen: React.FC<{
  left: string; right: string; leftSub?: string; rightSub?: string;
  leftIcon?: string; rightIcon?: string; color: string;
}> = ({ left, right, leftSub, rightSub, leftIcon = "🔊", rightIcon = "🐕", color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lx = interpolate(frame, [0, 16], [-width / 2, 0], { extrapolateRight: "clamp" });
  const rx = interpolate(frame, [0, 16], [width / 2, 0], { extrapolateRight: "clamp" });
  const lineH = interpolate(frame, [10, 26], [0, height], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Side: React.FC<{ tx: number; icon: string; title: string; sub?: string; tone: string; delay: number }> = ({ tx, icon, title, sub, tone, delay }) => (
    <div style={{
      position: "absolute", top: 0, width: "50%", height: "100%",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transform: `translateX(${tx}px)`, background: `radial-gradient(ellipse at center, ${tone}22, #05080c 80%)`,
    }}>
      <div style={{ fontSize: 150, opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{icon}</div>
      <div style={{ fontFamily: ANTON, fontSize: 76, color: "#fff", letterSpacing: 1, textShadow: `0 0 24px ${tone}` }}>{title}</div>
      {sub ? <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: tone, marginTop: 8 }}>{sub}</div> : null}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080c" }}>
      <div style={{ position: "absolute", left: 0 }}><Side tx={lx} icon={leftIcon} title={left} sub={leftSub} tone={color} delay={14} /></div>
      <div style={{ position: "absolute", right: 0 }}><Side tx={rx} icon={rightIcon} title={right} sub={rightSub} tone="#ff8a6a" delay={18} /></div>
      <div style={{ position: "absolute", left: width / 2 - 2, top: (height - lineH) / 2, width: 4, height: lineH, background: "#fff", boxShadow: "0 0 20px #fff" }} />
    </AbsoluteFill>
  );
};
