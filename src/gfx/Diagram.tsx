import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG } from "../theme";

const rise = (f: number, d: number) => interpolate(f, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Diagram: React.FC<{ type: string; accent: string }> = ({ type, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.54;

  const Title: React.FC<{ t: string }> = ({ t }) => (
    <div style={{ position: "absolute", top: "12%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
      fontSize: 50, color: "#FFF6EA", letterSpacing: 1, textShadow: `0 0 24px ${accent}66`, opacity: rise(frame, 2) }}>{t}</div>
  );
  const Lbl: React.FC<{ x: number; y: number; t: string; d?: number; size?: number; c?: string }> = ({ x, y, t, d = 0, size = 30, c = "#FFF6EA" }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 600,
      fontSize: size, letterSpacing: 1, color: c, opacity: rise(frame, d), whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{t}</div>
  );
  const Dot: React.FC<{ x: number; y: number; r?: number; c?: string; d?: number }> = ({ x, y, r = 16, c = accent, d = 0 }) => {
    const s = spring({ frame: frame - d, fps, config: { damping: 12 } });
    return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: c, transform: `scale(${s})`, boxShadow: `0 0 18px ${c}` }} />;
  };
  // drawing arrow between two x positions at cy
  const Arrow: React.FC<{ x1: number; x2: number; y: number; d: number }> = ({ x1, x2, y, d }) => {
    const len = Math.abs(x2 - x1);
    const draw = interpolate(frame, [d, d + 14], [len, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const tip = rise(frame, d + 12);
    return (
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={x1} y1={y} x2={x2 - 16} y2={y} stroke={accent} strokeWidth={4} strokeDasharray={len} strokeDashoffset={draw} style={{ filter: `drop-shadow(0 0 5px ${accent})` }} />
        <polygon points={`${x2},${y} ${x2 - 18},${y - 9} ${x2 - 18},${y + 9}`} fill={accent} opacity={tip} style={{ filter: `drop-shadow(0 0 5px ${accent})` }} />
      </svg>
    );
  };

  let title = ""; let body: React.ReactNode = null;

  if (type === "gene") {
    title = "A MUTATION IN ONE GENE";
    // DNA helix (left) -> arrow -> enzyme hexagon -> arrow -> ethanol molecule
    const hx = cx - 470, ex = cx, tx = cx + 470;
    const helix = (
      <svg width={220} height={300} style={{ position: "absolute", left: hx - 110, top: cy - 150, opacity: rise(frame, 4) }}>
        {new Array(15).fill(0).map((_, i) => {
          const yy = 12 + i * 19; const ph = frame / 7 + i * 0.5;
          const x1 = 110 + Math.sin(ph) * 70, x2 = 110 - Math.sin(ph) * 70;
          const front = Math.cos(ph) > 0;
          return <g key={i}>
            <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={accent} strokeWidth={2} opacity={0.5} />
            <circle cx={x1} cy={yy} r={5} fill={front ? "#F4B860" : accent} />
            <circle cx={x2} cy={yy} r={5} fill={front ? accent : "#F4B860"} />
          </g>;
        })}
      </svg>
    );
    const enzS = spring({ frame: frame - 26, fps, config: { damping: 12 } });
    body = <>{helix}
      <Lbl x={hx} y={cy + 168} t="ADH4 gene" d={10} c={accent} />
      <Arrow x1={hx + 120} x2={ex - 120} y={cy} d={20} />
      {/* enzyme hexagon */}
      <div style={{ position: "absolute", left: ex - 70, top: cy - 70, width: 140, height: 140, transform: `scale(${enzS})`,
        background: `radial-gradient(circle, ${accent}cc, ${accent}44)`, clipPath: "polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0% 50%)",
        boxShadow: `0 0 30px ${accent}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#160d08" }}>ENZYME</div>
      <Lbl x={ex} y={cy + 130} t="breaks down ethanol" d={34} c="#FFF6EA" />
      <Arrow x1={ex + 120} x2={tx - 90} y={cy} d={40} />
      {/* ethanol molecule */}
      <Dot x={tx - 30} y={cy - 18} r={26} c="#F4B860" d={52} />
      <Dot x={tx + 28} y={cy + 8} r={26} c={accent} d={56} />
      <Dot x={tx + 70} y={cy - 24} r={18} c="#FFF6EA" d={60} />
      <Lbl x={tx + 12} y={cy + 110} t="ETHANOL" d={62} c={accent} size={34} /></>;
  } else if (type === "ferment") {
    title = "YEAST TURNS SUGAR INTO ALCOHOL";
    const fx = cx - 420, yx = cx, ax = cx + 430;
    const dropS = spring({ frame: frame - 50, fps, config: { damping: 11 } });
    body = <>
      {/* fruit */}
      <Dot x={fx} y={cy} r={64} c="#F4B860" d={4} />
      <Lbl x={fx} y={cy + 110} t="ripe fruit · sugar" d={14} c="#FFF6EA" />
      <Arrow x1={fx + 90} x2={yx - 90} y={cy} d={20} />
      {/* yeast cluster + rising bubbles */}
      {new Array(7).fill(0).map((_, i) => <Dot key={i} x={yx - 50 + (i % 4) * 34} y={cy - 10 + Math.floor(i / 4) * 34} r={12} c={accent} d={26 + i * 2} />)}
      {new Array(10).fill(0).map((_, i) => {
        const o = rise(frame, 34 + i * 2);
        const by = cy - ((frame * (1.2 + (i % 3) * 0.5) + i * 22) % 160);
        return <div key={`b${i}`} style={{ position: "absolute", left: yx + 40 + (i % 5) * 14, top: by, width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${accent}`, opacity: o * 0.7 }} />;
      })}
      <Lbl x={yx} y={cy + 110} t="yeast · fermentation" d={30} c={accent} />
      <Arrow x1={yx + 110} x2={ax - 70} y={cy} d={44} />
      {/* alcohol drop */}
      <div style={{ position: "absolute", left: ax - 44, top: cy - 50, width: 88, height: 110, transform: `scale(${dropS})`,
        background: `radial-gradient(circle at 50% 60%, ${accent}, ${accent}66)`, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        clipPath: "polygon(50% 0,90% 55%,75% 95%,25% 95%,10% 55%)", boxShadow: `0 0 30px ${accent}` }} />
      <Lbl x={ax} y={cy + 110} t="ALCOHOL" d={56} c={accent} size={34} /></>;
  } else if (type === "brain") {
    title = "ALCOHOL TRIGGERS THE REWARD SYSTEM";
    const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
    const nodes = [[cx - 120, cy - 30], [cx - 20, cy + 40], [cx + 90, cy - 10], [cx + 180, cy + 50]];
    body = <>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <ellipse cx={cx} cy={cy} rx={260} ry={185} fill="rgba(255,244,228,0.05)" stroke={accent} strokeWidth={4} opacity={rise(frame, 4)}
          style={{ filter: `drop-shadow(0 0 ${14 + pulse * 16}px ${accent})` }} />
        <path d={`M ${cx - 150} ${cy - 20} q 70 -70 150 0 q 70 70 150 0`} fill="none" stroke={accent} strokeWidth={2} opacity={0.45 * rise(frame, 10)} />
        {nodes.map((n, i) => i < nodes.length - 1 ? (
          <line key={`e${i}`} x1={n[0]} y1={n[1]} x2={nodes[i + 1][0]} y2={nodes[i + 1][1]} stroke={accent} strokeWidth={3}
            opacity={rise(frame, 18 + i * 8) * (0.6 + 0.4 * pulse)} style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />
        ) : null)}
      </svg>
      {nodes.map((n, i) => <Dot key={i} x={n[0]} y={n[1]} r={18} d={16 + i * 8} />)}
      <Lbl x={cx} y={cy + 220} t="reward pathway lights up" d={40} c={accent} /></>;
  } else if (type === "dopamine") {
    title = "IT RELEASES DOPAMINE";
    // two neuron bodies + synaptic gap with dopamine dots crossing
    const lx = cx - 240, rx = cx + 240;
    body = <>
      <Dot x={lx} y={cy} r={70} c={`${accent}`} d={4} />
      <Dot x={rx} y={cy} r={70} c="#F4B860" d={8} />
      <Lbl x={lx} y={cy + 120} t="neuron" d={16} c="#FFF6EA" />
      <Lbl x={rx} y={cy + 120} t="receptor" d={20} c="#FFF6EA" />
      {new Array(9).fill(0).map((_, i) => {
        const t = ((frame - (14 + i * 4)) % 46) / 46;
        if (t < 0) return null;
        const x = lx + 60 + t * (rx - lx - 120);
        const y = cy + Math.sin(i * 1.3) * 36 * (1 - Math.abs(0.5 - t) * 2);
        const o = interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: 16, borderRadius: "50%", background: "#FFF6EA", opacity: o, boxShadow: `0 0 14px ${accent}` }} />;
      })}
      <Lbl x={cx} y={cy + 210} t="dopamine · the reward signal" d={26} c={accent} /></>;
  } else {
    title = type.toUpperCase();
  }

  return (<AbsoluteFill style={{ background: MG_BG }}><AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${accent}16, transparent 60%)` }} /><Title t={title} />{body}</AbsoluteFill>);
};
