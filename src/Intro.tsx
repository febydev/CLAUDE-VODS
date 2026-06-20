import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, random, Easing } from "remotion";
import { FONT } from "./theme";
import { ShimmerOverlay } from "./overlay/ShimmerOverlay";

const CY = "#5fd0ea";   // cyan
const BL = "#4ea8ff";   // electric blue
const ROSE = "#ff8aa6"; // subtle warm accent for the heart/spark

// Cinematic intro ~9s, NO audio. After-Effects-style layered motion graphics, cool palette.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.46;

  // ---- animated cool gradient backdrop ----
  const bgShift = interpolate(frame, [0, 270], [0, 1]);
  const bg = `radial-gradient(ellipse at ${50 + Math.sin(bgShift * Math.PI) * 8}% 44%, #123244 0%, #0a1a26 55%, #050d14 100%)`;

  // ---- layer 1: bokeh particles drifting (whole intro) ----
  const bokeh = new Array(60).fill(0).map((_, i) => {
    const bx = random(`bx${i}`) * width;
    const by = random(`by${i}`) * height;
    const sp = 0.15 + random(`bs${i}`) * 0.5;
    const r = 2 + random(`br${i}`) * 6;
    const y = (by - frame * sp) % height; const yy = y < 0 ? y + height : y;
    const x = bx + Math.sin(frame / 80 + i) * 18;
    const tw = 0.2 + 0.5 * Math.abs(Math.sin(frame / 40 + i));
    return { x, y: yy, r, o: tw * interpolate(frame, [10, 50], [0, 1], { extrapolateRight: "clamp" }) };
  });

  // ---- layer 2: particles converging to centre then bursting ----
  const conv = interpolate(frame, [20, 90], [1, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burst = interpolate(frame, [212, 250], [0, 1], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const converge = new Array(48).fill(0).map((_, i) => {
    const ang = (i / 48) * Math.PI * 2 + random(`ca${i}`);
    const startR = 520 + random(`cr${i}`) * 360;
    const r = startR * conv + burst * (700 + random(`cb${i}`) * 500);
    return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r * 0.7, o: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }) * (1 - burst) };
  });

  // ---- layer 3: two luminous orbs glide in, orbited by dots ----
  const orbX = interpolate(frame, [40, 130], [340, 96], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbsO = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [206, 230], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- layer 4: rotating DNA helix in the gap ----
  const helixO = interpolate(frame, [96, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [200, 224], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- layer 5: pulsing rings ----
  const titleShow = frame >= 150;

  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* faint grid for depth */}
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.06 * interpolate(frame, [20, 60], [0, 1], { extrapolateRight: "clamp" }) }}>
        {new Array(19).fill(0).map((_, i) => <line key={`v${i}`} x1={i / 18 * width} y1={0} x2={i / 18 * width} y2={height} stroke={CY} strokeWidth={1} />)}
        {new Array(11).fill(0).map((_, i) => <line key={`h${i}`} x1={0} y1={i / 10 * height} x2={width} y2={i / 10 * height} stroke={CY} strokeWidth={1} />)}
      </svg>

      {/* bokeh */}
      {bokeh.map((b, i) => <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.r, height: b.r, borderRadius: "50%", background: CY, opacity: b.o * 0.5, filter: "blur(1px)", boxShadow: `0 0 ${b.r * 3}px ${CY}` }} />)}

      {/* converging / bursting particles */}
      {converge.map((p, i) => p.o > 0.01 ? <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: 4, height: 4, borderRadius: "50%", background: BL, opacity: p.o, boxShadow: `0 0 10px ${BL}` }} /> : null)}

      {/* pulsing rings from centre */}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {[0, 1, 2, 3].map((k) => {
          const local = (frame - 70 - k * 16);
          if (local < 0 || frame > 220) return null;
          const rr = interpolate(local % 70, [0, 70], [20, 300]);
          const o = interpolate(local % 70, [0, 12, 70], [0, 0.4, 0]) * helixO;
          return <circle key={k} cx={cx} cy={cy} r={rr} fill="none" stroke={CY} strokeWidth={2} opacity={o} />;
        })}
      </svg>

      {/* two orbs + orbiting dots */}
      {orbsO > 0.01 && [[-1, ROSE], [1, BL]].map(([dir, col]: any, oi) => (
        <div key={oi}>
          <div style={{ position: "absolute", left: cx + dir * orbX - 46, top: cy - 46, width: 92, height: 92, borderRadius: "50%",
            background: `radial-gradient(circle, ${col}, ${col}44)`, opacity: orbsO, boxShadow: `0 0 60px ${col}, 0 0 120px ${col}66` }} />
          {new Array(6).fill(0).map((_, j) => {
            const a = frame / 18 + (j / 6) * Math.PI * 2;
            const ox = cx + dir * orbX + Math.cos(a) * 70, oy = cy + Math.sin(a) * 70;
            return <div key={j} style={{ position: "absolute", left: ox, top: oy, width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: orbsO * 0.8, boxShadow: `0 0 8px ${col}` }} />;
          })}
        </div>
      ))}

      {/* rotating DNA helix in the gap */}
      {helixO > 0.01 && (
        <svg width={240} height={200} style={{ position: "absolute", left: cx - 120, top: cy - 100, opacity: helixO }}>
          {new Array(13).fill(0).map((_, i) => {
            const yy = 12 + i * 14; const ph = frame / 7 + i * 0.5;
            const x1 = 120 + Math.sin(ph) * 64, x2 = 120 - Math.sin(ph) * 64;
            const front = Math.cos(ph) > 0;
            return <g key={i}>
              <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={CY} strokeWidth={2} opacity={0.5} />
              <circle cx={x1} cy={yy} r={5} fill={front ? ROSE : BL} />
              <circle cx={x2} cy={yy} r={5} fill={front ? BL : ROSE} />
            </g>;
          })}
        </svg>
      )}

      {/* light streak sweep */}
      {frame > 150 && frame < 210 && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${interpolate(frame, [150, 210], [-30, 130])}%`, width: "30%", transform: "skewX(-18deg)",
          background: `linear-gradient(90deg, transparent, ${CY}33, transparent)` }} />
      )}

      {/* per-letter kinetic title */}
      {titleShow && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            {["WHY DO WE", "KISS?"].map((line, li) => (
              <div key={li} style={{ display: "flex", justifyContent: "center" }}>
                {line.split("").map((ch, ci) => {
                  const idx = li * 9 + ci;
                  const s = spring({ frame: frame - (156 + idx * 2.2), fps, config: { damping: 12, mass: 0.6, stiffness: 150 } });
                  const o = interpolate(frame - (156 + idx * 2.2), [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return <span key={ci} style={{ fontFamily: FONT, fontWeight: 800, fontSize: li === 1 ? 176 : 112, lineHeight: 1.0,
                    color: "#fff", opacity: o, display: "inline-block", whiteSpace: "pre",
                    transform: `translateY(${(1 - s) * 40}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
                    filter: `blur(${(1 - o) * 6}px)`, textShadow: `0 0 46px ${BL}cc, 0 0 90px ${CY}66` }}>{ch}</span>;
                })}
              </div>
            ))}
            <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 600, fontSize: 40, letterSpacing: 2, color: CY,
              opacity: interpolate(frame, [196, 214], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              the origin is stranger than you think
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* shimmer #1 across the title */}
      <ShimmerOverlay delay={176} />

      {/* flash transition into first scene */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${CY}${Math.round(burst * 200).toString(16).padStart(2, "0")}, transparent 60%)` }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [262, 270], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};
