import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, random, Easing } from "remotion";
import { FONT } from "./theme";
import { ShimmerOverlay } from "./overlay/ShimmerOverlay";

const AMBER = "#FFE0B2";
const GOLD = "#F4B860";
const DEEP = "#D3A376";

// Cinematic intro (~18.7s) that plays UNDER the welcome narration. Warm/amber, fermenting-glass
// centerpiece, drifting embers, converging particles, then a kinetic title reveal + shimmer #1.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.46;

  // animated warm gradient backdrop
  const bgShift = interpolate(frame, [0, 560], [0, 1]);
  const bg = `radial-gradient(ellipse at ${50 + Math.sin(bgShift * Math.PI) * 7}% 42%, #3a2418 0%, #241610 56%, #120a06 100%)`;

  // drifting embers (whole intro)
  const embers = new Array(64).fill(0).map((_, i) => {
    const bx = random(`bx${i}`) * width;
    const by = random(`by${i}`) * height;
    const sp = 0.15 + random(`bs${i}`) * 0.55;
    const r = 2 + random(`br${i}`) * 6;
    const y = (by - frame * sp) % height; const yy = y < 0 ? y + height : y;
    const x = bx + Math.sin(frame / 80 + i) * 18;
    const tw = 0.2 + 0.5 * Math.abs(Math.sin(frame / 40 + i));
    return { x, y: yy, r, o: tw * interpolate(frame, [10, 50], [0, 1], { extrapolateRight: "clamp" }) };
  });

  // particles converge to glass, then burst on the flash-out
  const conv = interpolate(frame, [30, 150], [1, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burst = interpolate(frame, [520, 558], [0, 1], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const converge = new Array(46).fill(0).map((_, i) => {
    const ang = (i / 46) * Math.PI * 2 + random(`ca${i}`);
    const startR = 520 + random(`cr${i}`) * 360;
    const r = startR * conv + burst * (760 + random(`cb${i}`) * 520);
    return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r * 0.7, o: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }) * (1 - burst) };
  });

  // glass cup that fills with amber liquid
  const glassO = interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [470, 520], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fill = interpolate(frame, [80, 300], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gW = 220, gH = 300;
  const gx = cx - gW / 2, gy = cy - gH / 2;
  const liquidH = fill * (gH - 40);

  const titleShow = frame >= 300;
  const eyebrowO = interpolate(frame, [296, 318], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* faint grid for depth */}
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.05 * interpolate(frame, [20, 60], [0, 1], { extrapolateRight: "clamp" }) }}>
        {new Array(19).fill(0).map((_, i) => <line key={`v${i}`} x1={i / 18 * width} y1={0} x2={i / 18 * width} y2={height} stroke={GOLD} strokeWidth={1} />)}
        {new Array(11).fill(0).map((_, i) => <line key={`h${i}`} x1={0} y1={i / 10 * height} x2={width} y2={i / 10 * height} stroke={GOLD} strokeWidth={1} />)}
      </svg>

      {/* embers */}
      {embers.map((b, i) => <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.r, height: b.r, borderRadius: "50%", background: AMBER, opacity: b.o * 0.5, filter: "blur(1px)", boxShadow: `0 0 ${b.r * 3}px ${AMBER}` }} />)}

      {/* converging / bursting particles */}
      {converge.map((p, i) => p.o > 0.01 ? <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: 4, height: 4, borderRadius: "50%", background: GOLD, opacity: p.o, boxShadow: `0 0 10px ${GOLD}` }} /> : null)}

      {/* glass cup centerpiece */}
      {glassO > 0.01 && (
        <div style={{ position: "absolute", left: gx, top: gy, width: gW, height: gH, opacity: glassO }}>
          {/* glass body */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "18px 18px 26px 26px", border: `3px solid ${AMBER}aa`,
            background: "rgba(255,244,228,0.05)", backdropFilter: "blur(4px)", boxShadow: `0 0 40px ${AMBER}44, inset 0 0 30px ${AMBER}22`, overflow: "hidden" }}>
            {/* amber liquid */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: liquidH,
              background: `linear-gradient(to top, ${DEEP}, ${GOLD})`, boxShadow: `0 0 30px ${GOLD}` }}>
              {/* rising bubbles */}
              {new Array(14).fill(0).map((_, i) => {
                const bb = ((frame * (1 + (i % 3) * 0.5) + i * 30) % Math.max(40, liquidH));
                const o = liquidH > 20 ? 0.7 : 0;
                return <div key={i} style={{ position: "absolute", left: 20 + (i * 14) % (gW - 40), bottom: bb, width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, borderRadius: "50%", border: `1.5px solid ${AMBER}`, opacity: o }} />;
              })}
            </div>
            {/* surface highlight */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: liquidH - 4, height: 4, background: "#FFF6EA", opacity: liquidH > 10 ? 0.5 : 0 }} />
          </div>
          {/* specular streak */}
          <div style={{ position: "absolute", left: 24, top: 16, width: 14, height: gH - 60, borderRadius: 8, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)", opacity: 0.5 }} />
        </div>
      )}

      {/* pulsing rings from the glass */}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {[0, 1, 2, 3].map((k) => {
          const local = (frame - 120 - k * 18);
          if (local < 0 || frame > 470) return null;
          const rr = interpolate(local % 80, [0, 80], [30, 330]);
          const o = interpolate(local % 80, [0, 12, 80], [0, 0.34, 0]);
          return <circle key={k} cx={cx} cy={cy} r={rr} fill="none" stroke={AMBER} strokeWidth={2} opacity={o} />;
        })}
      </svg>

      {/* kinetic title */}
      {titleShow && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: AMBER, opacity: eyebrowO, marginBottom: 14 }}>
              WHEN DID ANCIENT HUMANS START
            </div>
            {["DRINKING", "ALCOHOL?"].map((line, li) => (
              <div key={li} style={{ display: "flex", justifyContent: "center" }}>
                {line.split("").map((ch, ci) => {
                  const idx = li * 9 + ci;
                  const s = spring({ frame: frame - (322 + idx * 2.4), fps, config: { damping: 12, mass: 0.6, stiffness: 150 } });
                  const o = interpolate(frame - (322 + idx * 2.4), [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return <span key={ci} style={{ fontFamily: FONT, fontWeight: 900, fontSize: li === 1 ? 184 : 132, lineHeight: 1.0,
                    color: li === 1 ? GOLD : "#FFF6EA", opacity: o, display: "inline-block", whiteSpace: "pre",
                    transform: `translateY(${(1 - s) * 44}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
                    filter: `blur(${(1 - o) * 6}px)`, textShadow: `0 0 50px ${GOLD}aa, 0 0 100px ${AMBER}55` }}>{ch}</span>;
                })}
              </div>
            ))}
            <div style={{ marginTop: 22, fontFamily: FONT, fontWeight: 600, fontSize: 42, letterSpacing: 2, color: AMBER,
              opacity: interpolate(frame, [430, 470], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              the answer is 10 million years old
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* shimmer #1 across the title */}
      <ShimmerOverlay delay={340} />

      {/* flash transition into the first scene */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${AMBER}${Math.round(burst * 200).toString(16).padStart(2, "0")}, transparent 60%)` }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [548, 560], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};
