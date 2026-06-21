import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

// Split screen (Section 9 Type 7). Each panel exactly half, overflow hidden, divider from center.
export const SplitScreen: React.FC<{ left: string; leftBig: string; right: string; rightBig: string; accent: string }> = ({ left, leftBig, right, rightBig, accent }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const half = width / 2;
  const lx = interpolate(frame, [0, 16], [-half, 0], { extrapolateRight: "clamp" });
  const rx = interpolate(frame, [0, 16], [half, 0], { extrapolateRight: "clamp" });
  const lineH = interpolate(frame, [10, 26], [0, height], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Side: React.FC<{ side: "L" | "R"; tx: number; small: string; big: string; tone: string; bg: string; delay: number }> =
    ({ side, tx, small, big, tone, bg, delay }) => (
    <div style={{ position: "absolute", top: 0, [side === "L" ? "left" : "right"]: 0, width: half, height, overflow: "hidden",
      transform: `translateX(${tx}px)`, background: bg, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "0 60px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 38, letterSpacing: 3, color: "rgba(255,246,234,0.82)",
        opacity: interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{small}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 132, color: "#FFF6EA", textShadow: `0 0 30px ${tone}`,
        opacity: interpolate(frame, [delay + 4, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{big}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#160d08", overflow: "hidden" }}>
      <Side side="L" tx={lx} small={left} big={leftBig} tone={accent} bg="radial-gradient(ellipse at center, #4a2e1c, #241610 82%)" delay={14} />
      <Side side="R" tx={rx} small={right} big={rightBig} tone="#D3A376" bg="radial-gradient(ellipse at center, #3a2a1a, #1a120a 82%)" delay={18} />
      <div style={{ position: "absolute", left: half - 3, top: (height - lineH) / 2, width: 6, height: lineH, background: accent, boxShadow: `0 0 22px ${accent}` }} />
    </AbsoluteFill>
  );
};
