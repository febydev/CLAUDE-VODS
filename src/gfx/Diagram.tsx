import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, BEBAS, INTER } from "../theme";

const bg = "radial-gradient(ellipse at 50% 42%, #0c1820 0%, #050a0e 78%)";
const rise = (frame: number, d: number) => interpolate(frame, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Title: React.FC<{ t: string; color: string }> = ({ t, color }) => {
  const f = useCurrentFrame();
  return <div style={{
    position: "absolute", top: "13%", width: "100%", textAlign: "center",
    fontFamily: ANTON, fontSize: 58, color: "#fff", letterSpacing: 1.5,
    textShadow: `0 0 26px ${color}`, opacity: rise(f, 2),
  }}>{t}</div>;
};

export const Diagram: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.56;

  const Dot: React.FC<{ x: number; y: number; r?: number; c?: string; d?: number }> = ({ x, y, r = 16, c = color, d = 0 }) => {
    const s = spring({ frame: frame - d, fps, config: { damping: 12 } });
    return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: c, transform: `scale(${s})`, boxShadow: `0 0 18px ${c}` }} />;
  };
  const Lbl: React.FC<{ x: number; y: number; t: string; d?: number; size?: number; c?: string }> = ({ x, y, t, d = 0, size = 30, c = "#fff" }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: BEBAS, fontSize: size, letterSpacing: 2, color: c, opacity: rise(frame, d), whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{t}</div>
  );

  let body: React.ReactNode = null;
  let title = "";

  if (type === "selection") {
    title = "THE BOLD DIED. THE CAUTIOUS LIVED.";
    const fall = interpolate(frame, [24, 50], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const fade = interpolate(frame, [24, 50], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    body = <>
      <div style={{ position: "absolute", left: cx * 0.55, top: cy, transform: `translate(-50%,calc(-50% + ${fall}px))`, opacity: fade, fontSize: 120 }}>💀</div>
      <Lbl x={cx * 0.55} y={cy + 150} t="BOLD → APPROACHED → KILLED" d={10} size={26} c="#ff8a6a" />
      <Dot x={cx * 1.45} y={cy} r={26} c={color} d={20} />
      <Lbl x={cx * 1.45} y={cy + 60} t="CAUTIOUS → SURVIVED" d={26} size={26} c={color} />
    </>;
  } else if (type === "inherit") {
    title = "CAUTION, PASSED DOWN";
    body = <>
      <Dot x={cx} y={cy - 110} r={24} d={6} />
      <Lbl x={cx} y={cy - 165} t="SURVIVOR" d={10} size={24} />
      {[-1, 0, 1].map((k, i) => <Dot key={i} x={cx + k * 230} y={cy + 90} r={18} d={20 + i * 6} />)}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {[-1, 0, 1].map((k, i) => {
          const o = rise(frame, 16 + i * 5);
          return <line key={i} x1={cx} y1={cy - 90} x2={cx + k * 230} y2={cy + 70} stroke={color} strokeWidth={3} opacity={o} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />;
        })}
      </svg>
      <Lbl x={cx} y={cy + 150} t="EVERY GENERATION, MORE AFRAID" d={40} size={28} />
    </>;
  } else if (type === "instinct") {
    title = "LEARNED  →  WIRED IN";
    const morph = interpolate(frame, [16, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    body = <>
      <Lbl x={cx - 280} y={cy} t="LEARNED CAUTION" size={40} c="rgba(255,255,255,0.6)" />
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", fontSize: 70, opacity: rise(frame, 10) }}>🧠</div>
      <Lbl x={cx + 280} y={cy} t="INSTINCT" size={56} c={color} d={18} />
      <div style={{ position: "absolute", left: cx + 230, top: cy - 70, fontSize: 40, opacity: morph }}>🔒</div>
    </>;
  } else if (type === "scent") {
    title = "YOU ARE BROADCASTING";
    body = <>
      {[0, 1, 2, 3, 4].map((k) => {
        const local = (frame - k * 10) % 60;
        const rr = interpolate(local, [0, 60], [40, 420]);
        const op = interpolate(local, [0, 10, 60], [0, 0.45, 0]);
        return <div key={k} style={{ position: "absolute", left: cx - rr, top: cy - rr, width: rr * 2, height: rr * 2, borderRadius: "50%", border: `2px solid ${color}`, opacity: op }} />;
      })}
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", fontSize: 90 }}>🧍</div>
      <Lbl x={cx} y={cy + 230} t="A STRANGE CHEMICAL SIGNAL" d={20} size={30} />
    </>;
  } else if (type === "pattern") {
    title = "YOU DON'T FIT THE PATTERN";
    body = <>
      {new Array(12).fill(0).map((_, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const x = cx - 330 + col * 220, y = cy - 90 + row * 120;
        const odd = i === 6;
        return <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontSize: 56, opacity: rise(frame, 4 + i * 2), filter: odd ? "none" : "grayscale(1) opacity(0.6)" }}>
          {odd ? "❓" : "🦌"}
          {odd && <div style={{ position: "absolute", inset: -16, border: `3px solid ${color}`, borderRadius: 12, boxShadow: `0 0 20px ${color}` }} />}
        </div>;
      })}
      <Lbl x={cx} y={cy + 175} t="ANOMALY → CAUTION" d={30} size={30} c={color} />
    </>;
  } else if (type === "scale") {
    title = "EVERY HUNT IS A CALCULATION";
    const tip = interpolate(frame, [20, 46], [0, -12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    body = <>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <line x1={cx} y1={cy - 120} x2={cx} y2={cy + 120} stroke={color} strokeWidth={6} />
        <g transform={`rotate(${tip} ${cx} ${cy - 120})`}>
          <line x1={cx - 260} y1={cy - 120} x2={cx + 260} y2={cy - 120} stroke={color} strokeWidth={6} />
          <circle cx={cx - 260} cy={cy - 60} r={50} fill="none" stroke="#ff8a6a" strokeWidth={4} />
          <circle cx={cx + 260} cy={cy - 60} r={50} fill="none" stroke={color} strokeWidth={4} />
        </g>
      </svg>
      <Lbl x={cx - 260} y={cy + 40} t="RISK OF INJURY" d={26} size={26} c="#ff8a6a" />
      <Lbl x={cx + 260} y={cy + 40} t="CALORIES GAINED" d={26} size={26} c={color} />
    </>;
  } else if (type === "hypnogram") {
    title = "THE SENTINEL FUNCTION OF SLEEP";
    const pts = [[0.1, 0.3], [0.25, 0.7], [0.4, 0.45], [0.55, 0.8], [0.7, 0.35], [0.85, 0.6]];
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${width * p[0]} ${cy - 120 + p[1] * 220}`).join(" ");
    const draw = interpolate(frame, [8, 48], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    body = <>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <path d={path} fill="none" stroke={color} strokeWidth={5} strokeDasharray={3000} strokeDashoffset={draw * 3000} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <Lbl x={cx} y={cy + 180} t="EVEN ASLEEP, YOUR BRAIN KEEPS WATCH" d={40} size={28} />
    </>;
  } else if (type === "genepool") {
    title = "DEEP SLEEPERS DIDN'T WAKE";
    body = <>
      {new Array(15).fill(0).map((_, i) => {
        const col = i % 5, row = Math.floor(i / 5);
        const x = cx - 380 + col * 190, y = cy - 70 + row * 110;
        const dead = i % 3 === 0;
        const goneAt = 26 + i;
        const op = dead ? interpolate(frame, [goneAt, goneAt + 12], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        return <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: rise(frame, 2 + i) * op }}>
          <Dot x={0} y={0} r={18} c={dead ? "#ff6a4a" : color} d={2 + i} />
          {dead && <div style={{ position: "absolute", left: -10, top: -22, fontSize: 30, color: "#ff6a4a", opacity: op < 0.5 ? 1 : 0 }}>✕</div>}
        </div>;
      })}
      <Lbl x={cx} y={cy + 175} t="LIGHT SLEEPERS SURVIVED" d={44} size={30} c={color} />
    </>;
  } else if (type === "separation") {
    title = "PREDATORS HUNT FOR SEPARATION";
    const iso = interpolate(frame, [20, 44], [0, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    body = <>
      {new Array(9).fill(0).map((_, i) => {
        const ang = (i / 9) * Math.PI * 2;
        return <Dot key={i} x={cx - 120 + Math.cos(ang) * 90} y={cy + Math.sin(ang) * 70} r={16} d={4 + i} />;
      })}
      <Dot x={cx + 200 + iso} y={cy} r={20} c="#ff8a6a" d={20} />
      <div style={{ position: "absolute", left: cx + 200 + iso, top: cy, transform: "translate(-50%,-50%)", width: 90, height: 90, border: `3px solid #ff6a4a`, borderRadius: "50%", opacity: rise(frame, 30) }} />
      <Lbl x={cx + 200 + iso} y={cy + 80} t="ISOLATED = TARGET" d={34} size={26} c="#ff8a6a" />
      <Lbl x={cx - 120} y={cy + 130} t="THE GROUP IS SAFE" d={20} size={26} c={color} />
    </>;
  } else { // cascade / cascade2
    title = type === "cascade" ? "FEAR REWRITES THE ECOSYSTEM" : "...ALL THE WAY DOWN THE CHAIN";
    const chain = ["HUMANS", "APEX PREDATORS ↓", "PREY POPULATIONS ↑", "PLANTS & MESO-PREDATORS", "EVERYTHING"];
    body = <>
      {chain.map((c, i) => {
        const y = cy - 180 + i * 95;
        const o = rise(frame, 6 + i * 9);
        return <div key={i}>
          <div style={{ position: "absolute", left: cx, top: y, transform: `translate(-50%,-50%) translateY(${(1 - o) * 20}px)`, opacity: o, fontFamily: BEBAS, fontSize: 40, letterSpacing: 2, color: i === 0 ? color : "#fff", textShadow: `0 0 18px ${color}66` }}>{c}</div>
          {i < chain.length - 1 && <div style={{ position: "absolute", left: cx, top: y + 34, transform: "translateX(-50%)", color, opacity: rise(frame, 10 + i * 9), fontSize: 28 }}>▼</div>}
        </div>;
      })}
    </>;
  }

  return (
    <AbsoluteFill style={{ background: bg }}>
      <Title t={title} color={color} />
      {body}
    </AbsoluteFill>
  );
};
