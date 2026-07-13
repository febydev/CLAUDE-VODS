import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG, fitFont } from "../theme";

const rise = (f: number, d: number) => interpolate(f, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Bespoke Çatalhöyük diagrams — the signature visuals. Warm dark-earth, ochre accent, sequenced build.
export const CityDiagram: React.FC<{ type: string; accent: string }> = ({ type, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.56;

  const Title: React.FC<{ t: string }> = ({ t }) => (
    <div style={{ position: "absolute", top: "12%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
      fontSize: fitFont(t, 56), color: "#FFF3DE", letterSpacing: 1, textShadow: `0 0 22px ${accent}55`, opacity: rise(frame, 2) }}>{t}</div>
  );
  const Lbl: React.FC<{ x: number; y: number; t: string; d: number; c?: string; size?: number }> = ({ x, y, t, d, c = "#E9DCC2", size = 30 }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 600,
      fontSize: size, color: c, opacity: rise(frame, d), whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{t}</div>
  );

  let title = ""; let body: React.ReactNode = null;

  if (type === "roofcity") {
    title = "THE STREETS WERE THE ROOFTOPS";
    const houses = 6;
    const hw = 200, hh = 150, baseY = cy + 90, x0 = cx - (houses * hw) / 2;
    body = (
      <>
        <svg width={width} height={height} style={{ position: "absolute" }}>
          {new Array(houses).fill(0).map((_, i) => {
            const x = x0 + i * hw;
            const o = rise(frame, 6 + i * 4);
            return (
              <g key={i} opacity={o}>
                <rect x={x} y={baseY - hh} width={hw - 4} height={hh} fill="#3a2a1c" stroke={accent} strokeWidth={2.5} />
                {/* roof opening */}
                <rect x={x + hw * 0.5} y={baseY - hh - 4} width={hw * 0.28} height={8} fill={accent} />
                {/* ladder through the roof */}
                <line x1={x + hw * 0.62} y1={baseY - hh} x2={x + hw * 0.62} y2={baseY - 20} stroke={accent} strokeWidth={2} opacity={0.7} />
                {[0, 1, 2, 3].map((r) => <line key={r} x1={x + hw * 0.56} y1={baseY - 30 - r * 28} x2={x + hw * 0.68} y2={baseY - 30 - r * 28} stroke={accent} strokeWidth={2} opacity={0.7} />)}
              </g>
            );
          })}
        </svg>
        {/* figures walking on the rooftops (the streets) */}
        {new Array(5).fill(0).map((_, i) => {
          const walk = ((frame * 1.6 + i * 160) % (houses * hw));
          const x = x0 + 40 + walk;
          const o = rise(frame, 34);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: baseY - hh - 46, opacity: o }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFF3DE" }} />
              <div style={{ width: 8, height: 26, margin: "0 auto", background: "#FFF3DE", borderRadius: 3 }} />
            </div>
          );
        })}
        <Lbl x={cx} y={baseY + 60} t="no doors at ground level · no streets between" d={40} c={accent} size={34} />
      </>
    );
  } else if (type === "burial") {
    title = "THEY BURIED THEIR DEAD BENEATH THE FLOOR";
    const hw = 620, hh = 320, x = cx - hw / 2, top = cy - hh / 2;
    const floorY = top + hh * 0.52;
    body = (
      <>
        <svg width={width} height={height} style={{ position: "absolute" }}>
          <g opacity={rise(frame, 6)}>
            <rect x={x} y={top} width={hw} height={hh} fill="#2f2216" stroke={accent} strokeWidth={2.5} />
            {/* raised sleeping/living platform */}
            <rect x={x + 40} y={floorY} width={hw - 80} height={18} fill={accent} opacity={0.85} />
            <line x1={x} y1={floorY + 18} x2={x + hw} y2={floorY + 18} stroke={accent} strokeWidth={1.5} opacity={0.5} strokeDasharray="8 8" />
          </g>
          {/* graves beneath the platform */}
          {[0, 1, 2].map((i) => {
            const gx = x + 130 + i * 150; const gy = floorY + 70;
            const o = rise(frame, 26 + i * 8);
            return (
              <g key={i} opacity={o}>
                <ellipse cx={gx} cy={gy} rx={54} ry={26} fill="none" stroke="#C9B79A" strokeWidth={2} strokeDasharray="4 5" />
                <circle cx={gx - 18} cy={gy} r={8} fill="#C9B79A" opacity={0.8} />
                <rect x={gx - 6} y={gy - 5} width={40} height={10} rx={5} fill="#C9B79A" opacity={0.8} />
              </g>
            );
          })}
        </svg>
        <Lbl x={cx} y={floorY - 30} t="the living slept above" d={20} c="#FFF3DE" size={30} />
        <Lbl x={cx} y={cy + hh / 2 + 56} t="the dead rested below — under their own home" d={48} c={accent} size={34} />
      </>
    );
  } else if (type === "historyhouse") {
    title = "REBUILT ON THE SAME WALLS, FOR GENERATIONS";
    const layers = 6, lw = 460, lh = 46, x = cx - lw / 2, baseY = cy + 150;
    body = (
      <>
        <svg width={width} height={height} style={{ position: "absolute" }}>
          {new Array(layers).fill(0).map((_, i) => {
            const s = spring({ frame: frame - (8 + i * 7), fps, config: { damping: 13 } });
            const yy = baseY - i * (lh + 6);
            const shade = 30 + i * 8;
            return (
              <g key={i} opacity={rise(frame, 8 + i * 7)} transform={`translate(0 ${(1 - s) * 24})`}>
                <rect x={x} y={yy - lh} width={lw} height={lh} fill={`rgb(${shade + 30},${shade + 12},${shade})`} stroke={accent} strokeWidth={i === layers - 1 ? 2.5 : 1.4} opacity={i === layers - 1 ? 1 : 0.9} />
              </g>
            );
          })}
        </svg>
        <Lbl x={x - 60} y={baseY - lh / 2} t="oldest" d={12} c="#C9B79A" size={26} />
        <Lbl x={x - 60} y={baseY - (layers - 1) * (lh + 6) - lh / 2} t="newest" d={56} c={accent} size={26} />
        <Lbl x={cx} y={baseY + 70} t="the same floor plan, layer on layer, for over a thousand years" d={64} c={accent} size={32} />
      </>
    );
  }

  return (
    <AbsoluteFill style={{ background: MG_BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${accent}14, transparent 60%)` }} />
      <Title t={title} />
      {body}
    </AbsoluteFill>
  );
};
