import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PALETTE } from "./theme";
import { ShimmerOverlay } from "./overlay/ShimmerOverlay";
import { Dust } from "./fx/Dust";

// Cinematic intro ~9s, no voiceover. Mysterious, intriguing, slightly romantic.
// black -> warm bloom + two silhouettes near-kiss with a gap -> magnifier reveals
// particles + DNA -> title "WHY DO WE KISS?" + shimmer -> flash into scene.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.46;

  const bloom = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(frame, [30, 120], [200, 92], { easing: (t) => 1 - Math.pow(1 - t, 3), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lens = spring({ frame: frame - 90, fps, config: { damping: 14 } });
  const lensShow = frame > 90 && frame < 200;
  const titleShow = frame >= 180;
  const flash = interpolate(frame, [252, 268], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const helix = (ox: number, oy: number, o: number) => (
    <svg width={220} height={160} style={{ position: "absolute", left: ox - 110, top: oy - 80, opacity: o }}>
      {new Array(10).fill(0).map((_, i) => {
        const yy = 14 + i * 14; const ph = frame / 8 + i * 0.6;
        const x1 = 110 + Math.sin(ph) * 60, x2 = 110 - Math.sin(ph) * 60;
        return <g key={i}><line x1={x1} y1={yy} x2={x2} y2={yy} stroke={PALETTE.rose} strokeWidth={2} opacity={0.6} />
          <circle cx={x1} cy={yy} r={4} fill={PALETTE.hotRose} /><circle cx={x2} cy={yy} r={4} fill={PALETTE.cyan} /></g>;
      })}
    </svg>
  );

  return (
    <AbsoluteFill style={{ background: "#0c0608" }}>
      <Audio src={staticFile("intro_audio.mp3")} />
      {/* warm bloom */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, rgba(255,150,130,${0.5 * bloom}) 0%, rgba(30,12,18,${0.9}) 60%)` }} />
      <Dust count={36} opacity={0.1 * bloom} color="rgba(255,210,200,1)" />

      {/* two silhouettes drifting close, leaving a gap */}
      {frame > 28 && frame < 240 && (
        <svg width={width} height={height} style={{ position: "absolute", opacity: bloom }}>
          <circle cx={cx - drift} cy={cy} r={88} fill="rgba(20,8,12,0.96)" />
          <circle cx={cx + drift} cy={cy} r={88} fill="rgba(20,8,12,0.96)" />
        </svg>
      )}

      {/* magnifier over the gap revealing particles + DNA */}
      {lensShow && (
        <AbsoluteFill style={{ opacity: lens }}>
          <svg width={width} height={height} style={{ position: "absolute" }}>
            <circle cx={cx} cy={cy} r={120 * lens} fill="rgba(255,240,235,0.06)" stroke={PALETTE.rose} strokeWidth={5} style={{ filter: `drop-shadow(0 0 18px ${PALETTE.rose})` }} />
            <line x1={cx + 86 * lens} y1={cy + 86 * lens} x2={cx + 150 * lens} y2={cy + 150 * lens} stroke={PALETTE.rose} strokeWidth={10} strokeLinecap="round" />
          </svg>
          {helix(cx, cy, lens * 0.9)}
        </AbsoluteFill>
      )}

      {/* title */}
      {titleShow && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            {["WHY DO WE", "KISS?"].map((line, i) => {
              const s = spring({ frame: frame - (186 + i * 8), fps, config: { damping: 13, mass: 0.7 } });
              return <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: i === 1 ? 168 : 110, lineHeight: 1.0, color: "#fff",
                opacity: interpolate(frame - (186 + i * 8), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${interpolate(s, [0, 1], [1.5, 1])})`, textShadow: `0 0 50px ${PALETTE.hotRose}cc` }}>{line}</div>;
            })}
            <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 600, fontSize: 40, color: PALETTE.rose,
              opacity: interpolate(frame, [214, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              the origin is stranger than you think
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* shimmer #1 across the title */}
      <ShimmerOverlay delay={196} />

      {/* warm flash into first scene */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, rgba(255,170,150,${flash * 0.9}), transparent 60%)` }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [262, 270], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};
