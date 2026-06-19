import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS } from "../theme";

const STROKE = "#10141a";
const FILL = "#fbfaf6";

// figure drawn with high contrast against a LIGHT background (Section 3 contrast rule)
const Figure: React.FC<{ x: number; y: number; scale?: number; armAngle?: number; legSpread?: number; lying?: boolean }> = ({
  x, y, scale = 1, armAngle = 20, legSpread = 12, lying = false,
}) => {
  const s = scale;
  const head = 26 * s;
  const t = lying ? `translate(${x},${y}) rotate(90) scale(${s})` : `translate(${x},${y}) scale(${s})`;
  const a = (armAngle * Math.PI) / 180;
  const ax = Math.sin(a) * 60, ay = Math.cos(a) * 60;
  const lx = Math.sin((legSpread * Math.PI) / 180) * 70, ly = Math.cos((legSpread * Math.PI) / 180) * 70;
  return (
    <g transform={t} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}>
      <circle cx={0} cy={-90} r={head} fill={FILL} stroke={STROKE} strokeWidth={7} />
      <line x1={0} y1={-64} x2={0} y2={30} stroke={STROKE} strokeWidth={10} strokeLinecap="round" />
      <line x1={0} y1={-44} x2={-ax} y2={-44 + ay} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={-44} x2={ax} y2={-44 + ay} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={30} x2={-lx} y2={30 + ly} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={30} x2={lx} y2={30 + ly} stroke={STROKE} strokeWidth={9} strokeLinecap="round" />
    </g>
  );
};

export const Stickman: React.FC<{ pose: string; color: string; bg?: string }> = ({ pose, color }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.6;

  // halo behind a figure so it always separates from the bg
  const Halo: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 200 }) => (
    <div style={{ position: "absolute", left: x - r, top: y - r - 30, width: r * 2, height: r * 2, borderRadius: "50%",
      background: `radial-gradient(circle, ${color}55 0%, transparent 68%)` }} />
  );

  let content: React.ReactNode = null;
  let label = "";

  if (pose === "upright") {
    label = "STANDING = THREAT DISPLAY";
    const grow = spring({ frame, fps, config: { damping: 14 } });
    const arm = interpolate(frame, [12, 30], [20, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    content = (<><Halo x={cx} y={cy - 30} r={240} />
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <Figure x={cx} y={cy} scale={1.5 * grow} armAngle={arm} legSpread={16} />
      </svg></>);
  } else if (pose === "jolt") {
    label = "ASLEEP \u2192 ON YOUR FEET IN SECONDS";
    const up = spring({ frame: frame - 18, fps, config: { damping: 12 } });
    const lying = frame < 18;
    const yy = interpolate(up, [0, 1], [cy + 40, cy]);
    content = (<><Halo x={cx} y={cy - 20} r={240} />
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <Figure x={cx} y={lying ? cy + 30 : yy} scale={1.4} armAngle={lying ? 80 : 40} lying={lying} />
        {!lying && <text x={cx + 100} y={cy - 150} fontSize={80} opacity={up}>❗</text>}
      </svg></>);
  } else { // group
    label = "WE TRAVEL IN GROUPS";
    const positions = [-2, -1, 0, 1, 2];
    const flame = 0.7 + 0.3 * Math.sin(frame / 6);
    content = (<>
      {positions.map((k, i) => <Halo key={i} x={cx + k * 230} y={cy} r={150} />)}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <ellipse cx={cx} cy={cy + 46} rx={50} ry={18} fill={`rgba(255,150,50,${0.3 * flame})`} />
        <path d={`M ${cx} ${cy - 16} q -26 30 0 60 q 26 -30 0 -60`} fill={`rgba(255,${140 + flame * 60},40,${flame})`} stroke="#e0651a" strokeWidth={3} />
        {positions.map((k, i) => {
          const appear = spring({ frame: frame - i * 4, fps, config: { damping: 13 } });
          return <g key={i} opacity={appear}><Figure x={cx + k * 230} y={cy} scale={0.85} armAngle={28} /></g>;
        })}
      </svg></>);
  }

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #eef2f4 0%, #c3ccd2 70%, #a9b4bc 100%)" }}>
      {content}
      <div style={{
        position: "absolute", bottom: "18%", width: "100%", textAlign: "center",
        fontFamily: BEBAS, fontSize: 50, letterSpacing: 3, color: "#14202a",
        opacity: interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        textShadow: "0 2px 10px rgba(255,255,255,0.6)",
      }}>{label}</div>
    </AbsoluteFill>
  );
};
