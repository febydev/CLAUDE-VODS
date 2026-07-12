import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, ARRIVE, GREY_DOT, INK, creamBg, textShadowOutline } from "../theme";

// "1 in X" reveal: a field of grey dots implying scale, ONE (or N) igniting with a
// radar-ping halo, and the precise number punching in below. Grid = concept of scale;
// text = precise number (spec: large denominators are represented, not literally drawn).
export const RarityGrid: React.FC<{
  cols?: number; rows?: number; lit?: number; label: string; glow?: string;
}> = ({ cols = 26, rows = 15, lit = 1, label, glow = "#7FB3FF" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const gridIn = interpolate(frame, [0, 9], [0, 1], { easing: ARRIVE, extrapolateRight: "clamp" });
  const litFrame = 18;

  const total = cols * rows;
  // choose lit indices: centered block
  const litSet = new Set<number>();
  const centerR = Math.floor(rows / 2), centerC = Math.floor(cols / 2);
  if (lit <= 1) {
    litSet.add(centerR * cols + centerC);
  } else {
    let placed = 0, ring = 0;
    while (placed < lit && ring < cols) {
      for (let dc = -ring; dc <= ring && placed < lit; dc++) {
        const c = centerC + dc, r = centerR;
        if (c >= 0 && c < cols) { const idx = r * cols + c; if (!litSet.has(idx)) { litSet.add(idx); placed++; } }
        const r2 = centerR + (dc % 2 === 0 ? 1 : -1);
        if (c >= 0 && c < cols && r2 >= 0 && r2 < rows) { const idx = r2 * cols + c; if (!litSet.has(idx)) { litSet.add(idx); placed++; } }
      }
      ring++;
    }
  }

  const gw = Math.min(width * 0.72, cols * 56);
  const gh = Math.min(height * 0.5, rows * 56);
  const dot = Math.min(gw / cols, gh / rows) * 0.42;

  const ping = interpolate(frame, [litFrame, litFrame + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: creamBg(glow), alignItems: "center", justifyContent: "flex-start" }}>
      <div style={{ position: "relative", width: gw, height: gh, marginTop: height * 0.13,
        display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${dot * 0.9}px`, opacity: gridIn }}>
        {new Array(total).fill(0).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          // edge fade -> implies infinity
          const edge = Math.min(r, rows - 1 - r, c, cols - 1 - c);
          const edgeFade = interpolate(edge, [0, 3], [0.25, 1], { extrapolateRight: "clamp" });
          const isLit = litSet.has(i);
          const pop = isLit ? interpolate(frame, [litFrame, litFrame + 6, litFrame + 12], [1, 1.3, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
          return (
            <div key={i} style={{ width: dot, height: dot, borderRadius: "50%", justifySelf: "center", alignSelf: "center",
              background: isLit ? glow : GREY_DOT, opacity: isLit ? 1 : 0.55 * edgeFade,
              transform: `scale(${pop})`, boxShadow: isLit ? `0 0 ${dot * 1.4}px ${glow}` : "none" }} />
          );
        })}
        {/* radar ping from center */}
        {ping > 0 && ping < 1 ? (
          <div style={{ position: "absolute", left: "50%", top: "50%", width: gw * ping, height: gw * ping,
            transform: "translate(-50%,-50%)", borderRadius: "50%", border: `2px solid ${glow}`, opacity: (1 - ping) * 0.6 }} />
        ) : null}
      </div>
      {/* precise number */}
      <div style={{ position: "absolute", bottom: "12%", width: "100%", textAlign: "center" }}>
        <PunchLabel frame={frame} at={litFrame + 2} text={label} glow={glow} />
      </div>
    </AbsoluteFill>
  );
};

const PunchLabel: React.FC<{ frame: number; at: number; text: string; glow: string }> = ({ frame, at, text, glow }) => {
  const s = interpolate(frame, [at, at + 11], [0.92, 1], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{ display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: INK,
      transform: `scale(${s})`, opacity: o, letterSpacing: 1, textShadow: `0 4px 18px ${glow}88` }}>{text}</span>
  );
};
