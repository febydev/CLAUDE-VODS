import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from "remotion";
import { FONT } from "../theme";

// Data visualization (Section 9 Type 9). Honest data — no fake maps.
export const DataViz: React.FC<{ kind: string; accent: string }> = ({ kind, accent }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (kind === "half") {
    // proportion bar: < 50% of cultures kiss romantically
    const fill = interpolate(frame, [10, 40], [0, 0.46], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const barW = width * 0.66, barH = 120, x = (width - barW) / 2, y = height * 0.5 - barH / 2;
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #16323f 0%, #08151d 72%)" }}>
        <div style={{ position: "absolute", top: height * 0.26, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: "#fff",
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>ROMANTIC KISSING APPEARS IN</div>
        <svg width={width} height={height} style={{ position: "absolute" }}>
          <rect x={x} y={y} width={barW} height={barH} rx={16} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />
          <rect x={x} y={y} width={barW * fill} height={barH} rx={16} fill={accent} style={{ filter: `drop-shadow(0 0 16px ${accent})` }} />
          <line x1={x + barW / 2} y1={y - 24} x2={x + barW / 2} y2={y + barH + 24} stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeDasharray="8 8" />
          <text x={x + barW / 2} y={y - 34} fill="#fff" fontFamily={FONT} fontSize={30} fontWeight={600} textAnchor="middle">50%</text>
        </svg>
        <div style={{ position: "absolute", top: y + barH + 60, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 72, color: accent,
          opacity: interpolate(frame, [30, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>FEWER THAN HALF OF CULTURES</div>
      </AbsoluteFill>
    );
  }

  // "billions" — a field of dots filling, big label
  const n = 240;
  const shown = Math.floor(interpolate(frame, [6, 44], [0, n], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #163240 0%, #08151d 72%)" }}>
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.9 }}>
        {new Array(n).fill(0).map((_, i) => {
          if (i >= shown) return null;
          const col = i % 24, row = Math.floor(i / 24);
          const cx = width * 0.18 + col * ((width * 0.64) / 23);
          const cy = height * 0.3 + row * 42;
          return <circle key={i} cx={cx} cy={cy} r={7} fill={accent} opacity={0.85} />;
        })}
      </svg>
      <div style={{ position: "absolute", bottom: height * 0.16, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, color: "#fff", textShadow: `0 0 30px ${accent}88` }}>
        BILLIONS OF US
      </div>
    </AbsoluteFill>
  );
};
