import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG, fitFont } from "../theme";

// Deep-time timeline: a line draws left->right, key markers pop in, and a bracket spans
// Çatalhöyük's ~1,000+ year continuous life. Warm dark-earth, ochre accent.
export const Timeline: React.FC<{ label: string; year: string; spanLabel: string; accent: string }> = ({ label, year, spanLabel, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const y = height * 0.56;
  const x0 = width * 0.12, x1 = width * 0.88;
  const draw = interpolate(frame, [6, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // markers along 10,000 years-ago -> today
  const marks = [
    { t: 0.02, name: "9,000 yrs ago", hi: true },
    { t: 0.55, name: "Pyramids", hi: false },
    { t: 0.78, name: "Rome", hi: false },
    { t: 0.99, name: "Today", hi: false },
  ];
  const spanA = 0.02, spanB = 0.14; // Çatalhöyük's ~1000+ yr life
  const bracket = interpolate(frame, [40, 60], [0, 1], { easing: (x) => x, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleO = interpolate(frame, [2, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: MG_BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${accent}18, transparent 60%)` }} />
      <div style={{ position: "absolute", top: "16%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
        fontSize: fitFont(label, 76), color: "#FFF3DE", opacity: titleO, textShadow: `0 0 24px ${accent}55` }}>{label}</div>

      <svg width={width} height={height} style={{ position: "absolute" }}>
        <line x1={x0} y1={y} x2={x0 + (x1 - x0) * draw} y2={y} stroke={accent} strokeWidth={5} style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />
        {/* span bracket for the 1000+ year life */}
        {bracket > 0 && (
          <g opacity={bracket}>
            <rect x={x0 + (x1 - x0) * spanA} y={y - 26} width={(x1 - x0) * (spanB - spanA)} height={52} rx={8} fill={`${accent}55`} stroke={accent} strokeWidth={2} />
          </g>
        )}
        {marks.map((m, i) => {
          const mx = x0 + (x1 - x0) * m.t;
          const s = spring({ frame: frame - (30 + i * 6), fps, config: { damping: 12 } });
          return (
            <g key={i}>
              <circle cx={mx} cy={y} r={(m.hi ? 16 : 9) * s} fill={m.hi ? accent : "#C9B79A"} style={m.hi ? { filter: `drop-shadow(0 0 10px ${accent})` } : undefined} />
            </g>
          );
        })}
      </svg>

      {marks.map((m, i) => {
        const mx = x0 + (x1 - x0) * m.t;
        const o = interpolate(frame, [32 + i * 6, 42 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: mx, top: y + 30, transform: "translateX(-50%)", fontFamily: FONT,
            fontWeight: m.hi ? 800 : 600, fontSize: m.hi ? 34 : 26, color: m.hi ? "#FFF3DE" : "#C9B79A", opacity: o, whiteSpace: "nowrap" }}>{m.name}</div>
        );
      })}
      {/* span label */}
      <div style={{ position: "absolute", left: x0 + (x1 - x0) * ((spanA + spanB) / 2), top: y - 96, transform: "translateX(-50%)",
        fontFamily: FONT, fontWeight: 900, fontSize: fitFont(spanLabel, 52), color: accent, opacity: bracket, whiteSpace: "nowrap",
        textShadow: `0 0 18px ${accent}` }}>{spanLabel}</div>
    </AbsoluteFill>
  );
};
