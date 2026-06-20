import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

// Stickman scenes (Section 9 Type 8). Dark figures on LIGHT warm bg (contrast rule),
// simple environment, CSS-driven animation, label.
const STROKE = "#241019";
const FILL = "#fff4ef";

const Figure: React.FC<{ x: number; y: number; scale?: number; armA?: number; legSpread?: number; lean?: number }> = ({ x, y, scale = 1, armA = 22, legSpread = 12, lean = 0 }) => {
  const a = (armA * Math.PI) / 180, ax = Math.sin(a) * 56, ay = Math.cos(a) * 56;
  const lx = Math.sin((legSpread * Math.PI) / 180) * 66, ly = Math.cos((legSpread * Math.PI) / 180) * 66;
  return (
    <g transform={`translate(${x},${y}) scale(${scale}) rotate(${lean})`} style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.25))" }}>
      <circle cx={0} cy={-86} r={25} fill={FILL} stroke={STROKE} strokeWidth={7} />
      <line x1={0} y1={-61} x2={0} y2={28} stroke={STROKE} strokeWidth={10} strokeLinecap="round" />
      <line x1={0} y1={-42} x2={-ax} y2={-42 + ay} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={-42} x2={ax} y2={-42 + ay} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={28} x2={-lx} y2={28 + ly} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={28} x2={lx} y2={28 + ly} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
    </g>
  );
};

const Heart: React.FC<{ x: number; y: number; s: number; o: number; color: string }> = ({ x, y, s, o, color }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={o}
    d="M0,6 C-8,-6 -26,-4 -26,10 C-26,24 -6,34 0,40 C6,34 26,24 26,10 C26,-4 8,-6 0,6 Z"
    fill={color} />
);

export const Stickman: React.FC<{ pose: string; accent: string }> = ({ pose, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.6;
  const groundY = height * 0.74;
  let content: React.ReactNode = null;
  let label = "";

  const ground = <line x1={0} y1={groundY} x2={width} y2={groundY} stroke="rgba(36,16,25,0.25)" strokeWidth={4} />;

  if (pose === "thinking") {
    label = "WAIT\u2026 WHY DO WE DO THIS?";
    const bob = Math.sin(frame / 18) * 6;
    content = (<svg width={width} height={height} style={{ position: "absolute" }}>{ground}
      <Figure x={cx} y={cy + bob} scale={1.5} armA={150} legSpread={12} />
      {[0,1,2].map(k => { const o = interpolate(frame, [10+k*8, 18+k*8], [0,1], {extrapolateLeft:"clamp",extrapolateRight:"clamp"}); return <circle key={k} cx={cx+70+k*26} cy={cy-150-k*22} r={6+k*4} fill={accent} opacity={o} />; })}
    </svg>);
  } else if (pose === "recoil") {
    label = "\u2026OR EVEN UNPLEASANT";
    const lean = interpolate(frame, [8, 26], [0, -14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    content = (<svg width={width} height={height} style={{ position: "absolute" }}>{ground}
      <Figure x={cx} y={cy} scale={1.5} armA={56} legSpread={20} lean={lean} />
    </svg>);
  } else if (pose === "nurture") {
    label = "CARE \u00b7 NURTURING";
    const small = spring({ frame: frame - 6, fps, config: { damping: 13 } });
    content = (<svg width={width} height={height} style={{ position: "absolute" }}>{ground}
      <Figure x={cx - 90} y={cy} scale={1.45} armA={48} />
      <g opacity={small}><Figure x={cx + 110} y={cy + 60} scale={0.8} armA={40} /></g>
      <Heart x={cx + 10} y={cy - 150} s={1 + Math.sin(frame/16)*0.1} o={interpolate(frame,[18,30],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})} color={accent} />
    </svg>);
  } else if (pose === "couple") {
    label = "ATTACHED ENOUGH TO STAY";
    const lean = interpolate(frame, [10, 30], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    content = (<svg width={width} height={height} style={{ position: "absolute" }}>{ground}
      <Figure x={cx - 75} y={cy} scale={1.45} armA={40} lean={lean} />
      <Figure x={cx + 75} y={cy} scale={1.45} armA={40} lean={-lean} />
      <Heart x={cx} y={cy - 170} s={1.4 + Math.sin(frame/14)*0.12} o={interpolate(frame,[16,30],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})} color={accent} />
    </svg>);
  } else { // family
    label = "RAISING CHILDREN TOGETHER";
    const kid = spring({ frame: frame - 12, fps, config: { damping: 13 } });
    content = (<svg width={width} height={height} style={{ position: "absolute" }}>{ground}
      <Figure x={cx - 120} y={cy} scale={1.4} armA={36} />
      <Figure x={cx + 120} y={cy} scale={1.4} armA={36} />
      <g opacity={kid}><Figure x={cx} y={cy + 70} scale={0.7} armA={44} legSpread={18} /></g>
      <Heart x={cx} y={cy - 150} s={1.2} o={interpolate(frame,[22,34],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})} color={accent} />
    </svg>);
  }

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #e6f2f7 0%, #c1dce8 70%, #a6cad9 100%)" }}>
      {content}
      <div style={{ position: "absolute", bottom: "16%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800,
        fontSize: 50, letterSpacing: 2, color: "#16323f",
        opacity: interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{label}</div>
    </AbsoluteFill>
  );
};
