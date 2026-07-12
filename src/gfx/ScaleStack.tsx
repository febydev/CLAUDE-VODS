import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, KB_EASE, PUNCH, BLUE, textShadowOutline } from "../theme";

// "910,000 Earths of sand": one Earth (left) vs an enormous tower of Earths (right) that
// builds upward past the top of frame — intentionally too big to fully show.
export const ScaleStack: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const single = interpolate(frame, [4, 14], [0.9, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const singleO = interpolate(frame, [4, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const build = interpolate(frame, [16, 44], [0, 1], { easing: KB_EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cols = 7, rowsVisible = 12, r = 34;
  const towerX = width * 0.66, baseY = height * 0.86;
  const shown = Math.floor(build * cols * rowsVisible);

  const earth = (x: number, y: number, size: number, key: string, op = 1) => (
    <div key={key} style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: "translate(-50%,-50%)", borderRadius: "50%",
      background: `radial-gradient(circle at 40% 38%, #6fd0ff, #2f7fd6 60%, #1b4f8f)`, opacity: op, boxShadow: `0 0 10px ${BLUE}88` }} />
  );

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #0a1020 0%, #05070f 70%, #010206 100%)" }}>
      {/* single earth */}
      {earth(width * 0.2, height * 0.6, 150 * single, "single", singleO)}
      <div style={{ position: "absolute", left: width * 0.2, top: height * 0.6 + 110, width: 300, transform: "translateX(-50%)", textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#cfe6ff", opacity: singleO }}>1 EARTH</div>
      {/* tower */}
      {new Array(shown).fill(0).map((_, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = towerX + (col - cols / 2) * (r * 1.9);
        const y = baseY - row * (r * 1.7);
        return earth(x, y, r * 1.7, `t${i}`);
      })}
      <div style={{ position: "absolute", bottom: "6%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff",
        textShadow: textShadowOutline, opacity: interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{label}</div>
    </AbsoluteFill>
  );
};
