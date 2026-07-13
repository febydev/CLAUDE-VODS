import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, random, Easing } from "remotion";
import { FONT } from "./theme";
import { ShimmerOverlay } from "./overlay/ShimmerOverlay";

const OCHRE = "#E0A458";
const GOLD = "#E8B84B";

// ~5s silent cinematic intro: packed mud-brick rooftop city rises out of the dark, dust drifts,
// title reveals per-letter + shimmer, then flashes into the first scene.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const bg = "radial-gradient(ellipse at 50% 60%, #3a2a1c 0%, #241811 58%, #120b06 100%)";
  const baseY = height * 0.74;

  // packed cube houses rising
  const cols = 14, cw = width / cols;
  const dust = new Array(50).fill(0).map((_, i) => {
    const bx = random(`x${i}`) * width, by = random(`y${i}`) * height;
    const sp = 0.15 + random(`s${i}`) * 0.4;
    const yy = (by - frame * sp) % height; const y = yy < 0 ? yy + height : yy;
    const r = 1 + random(`r${i}`) * 3;
    return { x: bx + Math.sin(frame / 70 + i) * 14, y, r, o: 0.3 + 0.4 * Math.abs(Math.sin(frame / 34 + i)) };
  });

  const titleShow = frame >= 40;
  const burst = interpolate(frame, [128, 150], [0, 1], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* skyline of packed houses */}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {new Array(cols).fill(0).map((_, i) => {
          const s = spring({ frame: frame - (6 + i * 2), fps, config: { damping: 14, mass: 0.6 } });
          const h = (90 + random(`h${i}`) * 130) * s;
          const x = i * cw;
          return (
            <g key={i} opacity={interpolate(frame, [4 + i * 2, 14 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <rect x={x + 3} y={baseY - h} width={cw - 6} height={h} fill="#2a1e13" stroke={OCHRE} strokeWidth={1.6} />
              <rect x={x + cw * 0.55} y={baseY - h - 3} width={cw * 0.24} height={6} fill={OCHRE} />
            </g>
          );
        })}
      </svg>

      {dust.map((d, i) => <div key={i} style={{ position: "absolute", left: d.x, top: d.y, width: d.r, height: d.r, borderRadius: "50%", background: OCHRE, opacity: d.o * 0.5, boxShadow: `0 0 ${d.r * 3}px ${OCHRE}` }} />)}

      {titleShow && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            {["THE CITY WITH", "NO STREETS"].map((line, li) => (
              <div key={li} style={{ display: "flex", justifyContent: "center" }}>
                {line.split("").map((ch, ci) => {
                  const idx = li * 13 + ci;
                  const s = spring({ frame: frame - (46 + idx * 1.8), fps, config: { damping: 12, mass: 0.6, stiffness: 150 } });
                  const o = interpolate(frame - (46 + idx * 1.8), [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return <span key={ci} style={{ fontFamily: FONT, fontWeight: 900, fontSize: li === 1 ? 150 : 96, lineHeight: 1.0,
                    color: li === 1 ? GOLD : "#FFF3DE", opacity: o, display: "inline-block", whiteSpace: "pre",
                    transform: `translateY(${(1 - s) * 40}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
                    textShadow: `0 0 44px ${OCHRE}aa, 0 4px 20px rgba(0,0,0,0.7)` }}>{ch}</span>;
                })}
              </div>
            ))}
            <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: OCHRE,
              opacity: interpolate(frame, [104, 124], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              ÇATALHÖYÜK · 9,000 YEARS AGO
            </div>
          </div>
        </AbsoluteFill>
      )}

      <ShimmerOverlay delay={96} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${GOLD}${Math.round(burst * 180).toString(16).padStart(2, "0")}, transparent 60%)` }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [140, 150], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};
