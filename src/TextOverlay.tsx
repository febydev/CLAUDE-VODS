import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, PAL, overlayText, strokeRing } from "./theme";
import type { Shot } from "./types";

/**
 * CAPTION ENGINE v4 — reels-scale type, art-directed rather than default.
 *
 * PLACEMENT is still ONLY the spec's fixed reserved-zone coordinates (section 8). Never chosen by
 * analysis, never relocated. Measurement decides SIZE, PLATE and CONTRAST only.
 *
 * SIZE is auto-fitted at build time (build_data_god_v2.py): every legal wrap of 1-3 lines at <= 3
 * words per line is costed by the font size it permits and the largest wins, bounded by the
 * MEASURED calm depth of that image's reserved band (analyze_zones.py) so a huge caption can never
 * spill onto the artwork.
 *
 * Carried forward from the INBREEDING pass and extended:
 *   1. per-line staggered entrance, so the block reads as designed motion, not a flat paste-in
 *   2. gradient fill on the letters (ivory -> gold) so type has dimension under firelight
 *   3. a glowing accent spine down the leading edge, tying the lines together (broadcast
 *      lower-third language, not a rectangle)
 *   4. a layered dark glass plate with a warm top highlight - it sits ON the art, not over it
 *   5. an underline wipe that draws under the final line
 *   6. letter-spacing that tightens as the line settles
 *   NEW in v2:
 *   7. HEDGE RESTRAINT. FULL_PACKAGE 7A protects the hedging beats ("none of it is proof", the
 *      Shanidar pollen, the naledi claim, the bear cult collapse). Those captions drop the spine,
 *      the underline and the gold, and enter without overshoot - the design stops selling on the
 *      exact lines where the video is admitting uncertainty. Same font, same size, calmer voice.
 *   8. SUPPRESSION. Where the vision pass found the image already carries readable lettering
 *      (text_report.json), the caption is dropped entirely at build time rather than stacked on
 *      top of baked words. This component never receives those shots.
 *
 * Kept from the spec: uppercase, ivory #F7E5BC fill, ~8px charcoal #241B16 stroke, entrance on the
 * spoken noun, hold >= 2.0s (verified for every caption at build time).
 */
const ANCHOR_T: Record<string, string> = {
  "top-left": "translate(0%, 0%)",
  "top-right": "translate(-100%, 0%)",
  "bottom-left": "translate(0%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  "top-center": "translate(-50%, 0%)",
  "bottom-center": "translate(-50%, -100%)",
};
const ALIGN: Record<string, "left" | "right" | "center"> = {
  "top-left": "left",
  "bottom-left": "left",
  "top-right": "right",
  "bottom-right": "right",
  "top-center": "center",
  "bottom-center": "center",
};

export const TextOverlay: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  if (!shot.lines.length || shot.x === null || shot.y === null) return null;

  // The cut already lands on the trigger word (section 10), so the label writes on a beat later -
  // on the spoken noun itself - and then holds.
  const local = frame - shot.revealFrame;
  if (local < 0) return null;

  const calm = shot.hedge;
  const size = shot.fontSize;
  const align = ALIGN[shot.anchor] || "left";
  const padX = Math.round(size * 0.3);
  const padY = Math.round(size * 0.14);
  const accent = ACCENT[shot.stage] || PAL.ochre;
  const spineW = Math.max(6, Math.round(size * 0.072));
  const stroke = Math.max(5, Math.round(size * 0.055));

  // block entrance (position + opacity), then per-line stagger inside it
  const blockOp = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blockY = interpolate(local, [0, 10], [size * 0.16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spineH = interpolate(local, [2, 14], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lastLocal = local - (shot.lines.length - 1) * 3;
  const uw = interpolate(lastLocal, [8, 22], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: shot.x * width,
        top: shot.y * height,
        transform: `${ANCHOR_T[shot.anchor] || "translate(0%,0%)"} translateY(${blockY}px)`,
        maxWidth: shot.maxw * width,
        opacity: blockOp,
        zIndex: 42,
        display: "flex",
        flexDirection: align === "right" ? "row-reverse" : "row",
        alignItems: "stretch",
        gap: Math.round(size * 0.18),
        pointerEvents: "none",
      }}
    >
      {/* accent spine along the leading edge - dropped on the protected hedging beats */}
      {align !== "center" && !calm ? (
        <div style={{ width: spineW, alignSelf: "stretch", display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              width: spineW,
              height: `${spineH}%`,
              background: accent,
              borderRadius: spineW,
              boxShadow: `0 0 ${spineW * 2.4}px ${accent}aa`,
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          gap: Math.round(size * 0.06),
        }}
      >
        {shot.lines.map((line, i) => {
          const lineLocal = local - i * 3;
          if (lineLocal < 0) return <div key={i} style={{ height: size * 1.02, opacity: 0 }} />;
          const s = spring({
            frame: lineLocal,
            fps,
            config: calm ? { damping: 200 } : { damping: 13, mass: 0.5, stiffness: 200 },
          });
          const lineScale = interpolate(s, [0, 1], [calm ? 0.96 : 0.9, 1]);
          const track = interpolate(s, [0, 1], [size * 0.055, -1.5]);
          const lineOp = interpolate(lineLocal, [0, 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isLast = i === shot.lines.length - 1;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                opacity: lineOp,
                transform: `scale(${lineScale})`,
                transformOrigin: align === "center" ? "center" : align === "right" ? "right" : "left",
              }}
            >
              {/* layered glass plate: measured alpha does the contrast work */}
              {shot.plate ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: Math.round(size * 0.14),
                    background: `linear-gradient(180deg, rgba(46,38,32,${shot.plateAlpha * 0.82}), rgba(18,15,12,${shot.plateAlpha}))`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,236,200,0.20)`,
                  }}
                />
              ) : null}
              {/* TWO SOLID LAYERS, not a gradient fill.
                  A gradient on the letters via `-webkit-background-clip: text` with a transparent
                  text colour LOOKS right in a browser and renders the glyphs INVISIBLE in the
                  headless Chromium we render with - measured on this project: YMAX inside the text
                  band was 86 (plate + outline only) against 213 for a solid fill. So the warm
                  underlight is built from a second solid-colour copy of the same line instead:
                  gold, nudged down a few px, carrying the charcoal stroke ring, with the ivory face
                  sitting on top of it. All solid colours, nothing exotic, renders identically
                  headless. */}
              {!calm ? (
                <div
                  aria-hidden
                  style={{
                    ...overlayText,
                    position: "absolute",
                    inset: 0,
                    fontSize: size,
                    letterSpacing: track,
                    whiteSpace: "nowrap",
                    padding: shot.plate ? `${padY}px ${padX}px` : 0,
                    color: PAL.gold,
                    textShadow: strokeRing(stroke) + ", 0 10px 26px rgba(0,0,0,0.6)",
                    transform: `translateY(${Math.max(3, Math.round(size * 0.035))}px)`,
                  }}
                >
                  {line}
                </div>
              ) : null}
              <div
                style={{
                  ...overlayText,
                  position: "relative",
                  fontSize: size,
                  letterSpacing: track,
                  whiteSpace: "nowrap",
                  padding: shot.plate ? `${padY}px ${padX}px` : 0,
                  color: PAL.ivory,
                  textShadow: calm
                    ? strokeRing(stroke) + ", 0 10px 26px rgba(0,0,0,0.6)"
                    : `0 2px 0 ${PAL.charcoal}88`,
                }}
              >
                {line}
              </div>
              {/* underline wipe beneath the final line - dropped on the hedging beats */}
              {isLast && !calm ? (
                <div
                  style={{
                    position: "absolute",
                    left: shot.plate ? padX : 0,
                    right: shot.plate ? padX : 0,
                    bottom: shot.plate ? Math.round(padY * 0.34) : -Math.round(size * 0.09),
                    height: Math.max(5, Math.round(size * 0.058)),
                    background: accent,
                    borderRadius: 4,
                    transform: `scaleX(${uw / 100})`,
                    transformOrigin: align === "right" ? "right" : "left",
                    boxShadow: `0 0 ${size * 0.18}px ${accent}88`,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
