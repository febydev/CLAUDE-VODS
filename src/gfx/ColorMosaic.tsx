import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, INK, creamBg, fitFont } from "../theme";

// Tetrachromacy color count: a mosaic fills via a diagonal wipe. The 100M version is denser
// (smaller cells + a finer subdivision layer) to read as "even more color resolution".
export const ColorMosaic: React.FC<{ label: string; dense?: boolean }> = ({ label, dense }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cols = dense ? 60 : 34, rows = dense ? 34 : 20;
  const total = cols * rows;
  const cw = (width * 0.8) / cols, ch = (height * 0.52) / rows;
  const ox = width * 0.1, oy = height * 0.13;

  const labO = interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labS = interpolate(frame, [30, 42], [0.92, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: creamBg("#C77DFF") }}>
      {new Array(total).fill(0).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const diag = (c + r) / (cols + rows);
        const o = interpolate(frame, [diag * 20, diag * 20 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const hue = Math.floor(random(`h${i}`) * 360);
        return <div key={i} style={{ position: "absolute", left: ox + c * cw, top: oy + r * ch, width: cw + 0.5, height: ch + 0.5,
          background: `hsl(${hue}, 78%, 62%)`, opacity: o }} />;
      })}
      <div style={{ position: "absolute", bottom: "10%", width: "100%", textAlign: "center",
        fontFamily: FONT, fontWeight: 900, fontSize: fitFont(label, 92), color: INK, opacity: labO, transform: `scale(${labS})`,
        textShadow: "0 3px 16px rgba(255,255,255,0.9)" }}>{label}</div>
    </AbsoluteFill>
  );
};
