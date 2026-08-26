import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL, overlayText } from "./theme";
import type { Shot } from "./types";

// ═══ CAPTION ENGINE v3 — "make the text better" pass ═══
// Kept: fixed reserved-zone coords (never chosen by analysis), auto-fit sizing, plate contrast.
// NEW design work so captions look art-directed instead of default:
//   1. PER-LINE STAGGERED entrance (each line lands 3f after the last) — reads as designed motion
//      instead of one flat block appearing.
//   2. GRADIENT FILL on the type (warm ivory -> gold) via background-clip, so the letters have
//      dimension under firelight instead of flat cream.
//   3. ACCENT SPINE: a thick vertical bar grows down the leading edge of the block, tying the
//      lines together (broadcast lower-third language, not a rectangle).
//   4. LAYERED PLATE: blurred dark glass + a 1px top highlight + soft shadow, so it sits on the
//      art rather than covering it.
//   5. UNDERLINE WIPE that draws left-to-right under the final line instead of just existing.
//   6. Slight overshoot + settle on each line (spring), and a subtle letter-spacing tighten-in.
const ANCHOR_T: Record<string, string> = {
  "top-left": "translate(0%, 0%)",
  "top-right": "translate(-100%, 0%)",
  "bottom-left": "translate(0%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  "top-center": "translate(-50%, 0%)",
  "bottom-center": "translate(-50%, -100%)",
};
const ALIGN: Record<string, "left" | "right" | "center"> = {
  "top-left": "left", "bottom-left": "left",
  "top-right": "right", "bottom-right": "right",
  "top-center": "center", "bottom-center": "center",
};

export const TextOverlay: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const reveal = 15; // ~0.5s after the in-point, on the spoken noun
  if (frame < reveal || !shot.lines.length || shot.x === null || shot.y === null) return null;

  const zoneW = shot.maxw * width;
  const longest = Math.max(...shot.lines.map((l) => l.length));
  const byWidth = (zoneW * 0.94) / (longest * 0.44);       // Anton advance ~0.44em
  const byHeight = (height * 0.30) / (shot.lines.length * 1.10);
  const size = Math.round(Math.max(76, Math.min(152, byWidth, byHeight)));

  const align = ALIGN[shot.anchor] || "left";
  const padX = Math.round(size * 0.34);
  const padY = Math.round(size * 0.17);
  const accent = shot.accent || PAL.ochre;
  const spineW = Math.max(6, Math.round(size * 0.075));

  // block-level entrance (position/opacity), then per-line stagger inside it
  const blockLocal = frame - reveal;
  const blockOp = interpolate(blockLocal, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blockY = interpolate(blockLocal, [0, 10], [size * 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // spine grows down the block
  const spineH = interpolate(blockLocal, [2, 14], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lastLocal = blockLocal - (shot.lines.length - 1) * 3;
  const uw = interpolate(lastLocal, [8, 22], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left: shot.x * width, top: shot.y * height,
      transform: `${ANCHOR_T[shot.anchor] || "translate(0%,0%)"} translateY(${blockY}px)`,
      maxWidth: zoneW, opacity: blockOp, zIndex: 42,
      display: "flex",
      flexDirection: align === "right" ? "row-reverse" : "row",
      alignItems: "stretch",
      gap: Math.round(size * 0.20),
    }}>
      {/* 3. accent spine along the leading edge */}
      {align !== "center" ? (
        <div style={{ width: spineW, alignSelf: "stretch", display: "flex", alignItems: "flex-start" }}>
          <div style={{
            width: spineW, height: `${spineH}%`, background: accent, borderRadius: spineW,
            boxShadow: `0 0 ${spineW * 2.4}px ${accent}aa`,
          }} />
        </div>
      ) : null}

      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: Math.round(size * 0.07),
      }}>
        {shot.lines.map((line, i) => {
          const local = blockLocal - i * 3;                 // 1. per-line stagger
          if (local < 0) return <div key={i} style={{ height: size * 1.02, opacity: 0 }} />;
          const s = spring({ frame: local, fps, config: { damping: 13, mass: 0.5, stiffness: 200 } });
          const lineScale = interpolate(s, [0, 1], [0.9, 1]);
          const track = interpolate(s, [0, 1], [size * 0.06, -1]);  // 6. letter-spacing tightens in
          const lineOp = interpolate(local, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isLast = i === shot.lines.length - 1;
          return (
            <div key={i} style={{ position: "relative", opacity: lineOp, transform: `scale(${lineScale})`,
              transformOrigin: align === "center" ? "center" : align === "right" ? "right" : "left" }}>
              {/* 4. layered glass plate */}
              {shot.plate ? (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: Math.round(size * 0.15),
                  background: "linear-gradient(180deg, rgba(46,38,32,0.60), rgba(18,15,12,0.74))",
                  backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
                  boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,236,200,0.22)`,
                }} />
              ) : null}
              <div style={{
                ...overlayText,
                position: "relative",
                fontSize: size, letterSpacing: track, whiteSpace: "nowrap",
                padding: shot.plate ? `${padY}px ${padX}px` : 0,
                // 2. gradient fill on the letters
                background: `linear-gradient(180deg, ${PAL.ivory} 0%, #FFF3D6 42%, ${PAL.ochre} 100%)`,
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextStroke: `${Math.max(5, Math.round(size * 0.055))}px ${PAL.charcoal}`,
                paintOrder: "stroke fill",
                color: "transparent",
                filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.62))",
              }}>{line}</div>
              {/* 5. underline wipe beneath the final line */}
              {isLast ? (
                <div style={{
                  position: "absolute", left: shot.plate ? padX : 0, right: shot.plate ? padX : 0,
                  bottom: shot.plate ? Math.round(padY * 0.42) : -Math.round(size * 0.10),
                  height: Math.max(5, Math.round(size * 0.062)),
                  background: accent, borderRadius: 4,
                  transform: `scaleX(${uw / 100})`,
                  transformOrigin: align === "right" ? "right" : "left",
                  boxShadow: `0 0 ${size * 0.18}px ${accent}88`,
                }} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
