import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER } from "../theme";

// Two panels, each EXACTLY half width, all content contained (Section 3 / Problem 5).
export const SplitScreen: React.FC<{
  left: string; right: string; leftSub?: string; rightSub?: string;
  leftIcon?: string; rightIcon?: string; color: string;
}> = ({ left, right, leftSub, rightSub, leftIcon = "🔊", rightIcon = "🐕", color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const half = width / 2;
  const lx = interpolate(frame, [0, 16], [-half, 0], { extrapolateRight: "clamp" });
  const rx = interpolate(frame, [0, 16], [half, 0], { extrapolateRight: "clamp" });
  const lineH = interpolate(frame, [10, 26], [0, height], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Side: React.FC<{ side: "L" | "R"; tx: number; icon: string; title: string; sub?: string; tone: string; delay: number }> =
    ({ side, tx, icon, title, sub, tone, delay }) => (
    <div style={{
      position: "absolute", top: 0, [side === "L" ? "left" : "right"]: 0,
      width: half, height, overflow: "hidden",
      transform: `translateX(${tx}px)`,
      background: `radial-gradient(ellipse at center, ${tone}33, #0a1018 82%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 60px", boxSizing: "border-box",
    }}>
      <div style={{ fontSize: 120, lineHeight: 1, opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{icon}</div>
      <div style={{ fontFamily: ANTON, fontSize: 60, color: "#fff", letterSpacing: 1, textAlign: "center", textShadow: `0 0 22px ${tone}`, maxWidth: "100%", wordBreak: "break-word" }}>{title}</div>
      {sub ? <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, color: tone, marginTop: 10, textAlign: "center", maxWidth: "100%" }}>{sub}</div> : null}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1018", overflow: "hidden" }}>
      <Side side="L" tx={lx} icon={leftIcon} title={left} sub={leftSub} tone={color} delay={14} />
      <Side side="R" tx={rx} icon={rightIcon} title={right} sub={rightSub} tone="#ff9070" delay={18} />
      <div style={{ position: "absolute", left: half - 3, top: (height - lineH) / 2, width: 6, height: lineH, background: "#fff", boxShadow: "0 0 22px #fff" }} />
    </AbsoluteFill>
  );
};
