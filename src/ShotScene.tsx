import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, GRADE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import { ShimmerOverlay } from "./overlay/ShimmerOverlay";
import { Dust } from "./fx/Dust";
import { Embers } from "./fx/Embers";
import { LightShafts } from "./fx/LightShafts";
import { EyeMotif } from "./motif/EyeMotif";
import { DottedOutline } from "./motif/DottedOutline";
import { EchoRings } from "./motif/EchoRings";
import type { Shot } from "./types";

/**
 * ANIMATION ENGINE v2 — all 31 styles from FULL_PACKAGE section 10.
 *
 * Rules (enforced here, validated in build_data_god_v2.py): ease everything, settle by ~40% of the
 * shot then hold, each shot reverses the drift direction of the one before it, no two adjacent
 * shots share a style, nothing fully static for more than 1.0s.
 *
 * WHAT v2 CHANGED, and why (the v1 cut was technically correct but flat):
 *
 *  1. 2.5D SEPARATION. v1 drew one flat <Img> per shot, so a "parallax" style was really just a
 *     pan - the whole picture moved as one rigid plane and the eye read it as a slideshow. On the
 *     depth styles v2 now composites the same coherent image twice: a softened plate that moves
 *     slightly further and faster, and the sharp plate masked to the centre of interest. The two
 *     rates give real separation without a second asset and without breaking "one coherent image
 *     per shot" (it is the same file, layered - explicitly permitted: "layered pipeline
 *     transforms").
 *  2. MICRO-PERSPECTIVE. The push styles carry a fraction of a degree of Y/X rotation under a
 *     1400px perspective, so a dolly reads as moving through space instead of scaling a bitmap.
 *  3. LIGHT AS THE DIAL. Every stage now owns a bloom level and a volumetric shaft level
 *     (theme.ts), so the arc is carried by light and air, not only by tint. Embers rise on the
 *     firelight stages, dust falls on the cold ones.
 *  4. THE MOTIFS ARE REAL NOW. Section 8's eye (ten appearances, growing) and dotted empty
 *     outline (five appearances, never filled) are drawn in code and mounted here. v1 had neither,
 *     so the spec's central visual argument was missing from the video.
 *  5. Every reveal gesture (wipes, bands, grids) is an INK gesture now rather than a flat charcoal
 *     rectangle sliding off, matching the hand-drawn world.
 */
export const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const dir = shot.reverse ? -1 : 1;

  const full = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: EASE,
    extrapolateRight: "clamp",
  });
  // settle by ~40% of the shot, then hold (resolve-then-hold, never fade out mid-animation)
  const settle = interpolate(frame, [0, Math.max(8, durationInFrames * 0.4)], [0, 1], {
    easing: EASE,
    extrapolateRight: "clamp",
  });
  const sway = Math.sin(frame / 36) * dir;

  let scale = 1.04;
  let tx = 0;
  let ty = 0;
  let rot = 0;
  let ry = 0; // micro-perspective yaw
  let rx = 0; // micro-perspective pitch
  let flicker = 1;

  // optional overlay gestures
  let paperWipe: number | null = null; // retreating paper panel (%)
  let drawWipe: number | null = null; // left-to-right reveal (%)
  let gridBands: number | null = null; // staggered band reveal progress
  let riseWipe: number | null = null; // bottom-up reveal (%)
  let strike: number | null = null; // single sweeping band of doubt (%)
  let splitP: number | null = null; // two halves sliding together
  let inkRule: number | null = null; // an ink line drawing itself under the frame

  switch (shot.anim) {
    // ── ANCIENT / CTA POOL ────────────────────────────────────────────────────────────────
    case "KENBURNS-PUSH":
      scale = interpolate(full, [0, 1], [1.0, 1.06]);
      ty = sway * 3;
      ry = interpolate(full, [0, 1], [0.5, 0]) * dir;
      break;
    case "KENBURNS-PULL":
      scale = interpolate(full, [0, 1], [1.065, 1.005]);
      ty = sway * 3;
      ry = interpolate(full, [0, 1], [0, 0.5]) * dir;
      break;
    case "PARALLAX-PAN-L":
      scale = interpolate(full, [0, 1], [1.085, 1.115]);
      tx = interpolate(full, [0, 1], [0.045, -0.045]) * width * dir;
      ry = interpolate(full, [0, 1], [-0.7, 0.7]) * dir;
      break;
    case "PARALLAX-PAN-R":
      scale = interpolate(full, [0, 1], [1.085, 1.115]);
      tx = interpolate(full, [0, 1], [-0.045, 0.045]) * width * dir;
      ry = interpolate(full, [0, 1], [0.7, -0.7]) * dir;
      break;
    case "BREATHING-HOLD":
      scale = 1.028 + Math.sin(frame / 40) * 0.008;
      ty = sway * 2.5;
      rx = Math.sin(frame / 54) * 0.22 * dir;
      break;
    case "WALK-TRACK":
      // a tracking camera keeping pace with a walker: lateral drift + a soft footfall bob
      scale = 1.095;
      tx = interpolate(full, [0, 1], [0.04, -0.04]) * width * dir;
      ty = Math.sin(frame / 7) * 3.2 + sway * 1.5;
      ry = interpolate(full, [0, 1], [-0.5, 0.5]) * dir;
      break;
    case "TILT-UP":
      scale = 1.075;
      ty = interpolate(full, [0, 1], [0.035, -0.005]) * height;
      rx = interpolate(full, [0, 1], [0.8, 0]) * dir;
      break;
    case "TILT-DOWN":
      scale = 1.075;
      ty = interpolate(full, [0, 1], [-0.035, 0.005]) * height;
      rx = interpolate(full, [0, 1], [-0.8, 0]) * dir;
      break;
    case "PARALLAX-DEPTH":
      // push through depth: the frame grows while drifting against the move
      scale = interpolate(full, [0, 1], [1.05, 1.135]);
      tx = interpolate(full, [0, 1], [0.02, -0.03]) * width * dir;
      rot = interpolate(full, [0, 1], [0.25, -0.2]) * dir;
      ry = interpolate(full, [0, 1], [1.1, -0.9]) * dir;
      break;
    case "FIRELIGHT-FLICKER":
      // near-static hold with firelight rising and falling; low amplitude and slow (section 12)
      scale = 1.032 + Math.sin(frame / 46) * 0.006;
      ty = sway * 2;
      flicker = 1 + Math.sin(frame / 9) * 0.028 + Math.sin(frame / 3.3) * 0.013 + Math.sin(frame / 1.9) * 0.005;
      break;
    case "DOLLY-IN-LOW":
      // low, slow dolly toward the subject
      scale = interpolate(full, [0, 1], [1.02, 1.105]);
      ty = interpolate(full, [0, 1], [0.012, -0.008]) * height;
      rot = interpolate(settle, [0, 1], [0.3, 0]) * dir;
      rx = interpolate(full, [0, 1], [-0.9, 0]) * dir;
      break;
    case "CRAWL-FORWARD": {
      // genuine crawl/squeeze shots: forward push with an irregular handheld tremor
      scale = interpolate(full, [0, 1], [1.04, 1.165]);
      const j = 1 + 0.4 * Math.sin(frame / 19);
      tx = (Math.sin(frame * 1.7) * 2.6 + Math.sin(frame * 0.9) * 1.8) * j * dir;
      ty = (Math.sin(frame * 2.3 + 1.1) * 2.2 + Math.sin(frame * 1.1) * 1.4) * j;
      rot = Math.sin(frame * 1.3) * 0.22 * j * dir;
      ry = Math.sin(frame / 23) * 0.8 * dir;
      break;
    }
    case "SLOW-ORBIT":
      // the camera arcs around a standing object
      scale = 1.095;
      rot = Math.sin(frame / 58) * 1.3 * dir;
      tx = Math.sin(frame / 62) * width * 0.016 * dir;
      ty = Math.cos(frame / 70) * height * 0.008;
      ry = Math.sin(frame / 62) * 1.6 * dir;
      break;
    case "CTA-BUTTON-IN":
      // backdrop plates stay deliberately calm so the coded module owns the frame
      scale = interpolate(full, [0, 1], [1.0, 1.03]);
      ty = sway * 2;
      break;
    case "CTA-BUTTON-OUT":
      scale = interpolate(full, [0, 1], [1.03, 1.0]);
      ty = sway * 2;
      break;

    // ── VOX POOL ──────────────────────────────────────────────────────────────────────────
    case "PUSH-IN":
      scale = interpolate(full, [0, 1], [1.0, 1.055]);
      ty = sway * 2.5;
      ry = interpolate(full, [0, 1], [0.45, 0]) * dir;
      break;
    case "PULL-BACK":
      scale = interpolate(full, [0, 1], [1.055, 1.0]);
      ty = sway * 2.5;
      ry = interpolate(full, [0, 1], [0, 0.45]) * dir;
      break;
    case "PAN-RIGHT":
      scale = 1.09;
      tx = interpolate(full, [0, 1], [-0.05, 0.05]) * width * dir;
      break;
    case "PAPER-WIPE-IN":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      paperWipe = interpolate(settle, [0, 1], [0, 104], { extrapolateRight: "clamp" });
      break;
    case "TIMELINE-SLIDE":
      // a time bar sliding into register, then locked, with the ink rule drawing under it
      scale = 1.05;
      tx = interpolate(settle, [0, 1], [0.035, 0]) * width * dir;
      ty = sway * 1.6;
      inkRule = settle;
      break;
    case "DIAGRAM-DRAW":
      // the diagram draws itself left to right, then holds complete
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      drawWipe = interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" });
      break;
    case "GRID-REVEAL":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      gridBands = settle;
      break;
    case "MAP-DRIFT":
      // a slow diagonal drift across a stylised map
      scale = 1.1;
      tx = interpolate(full, [0, 1], [0.03, -0.03]) * width * dir;
      ty = interpolate(full, [0, 1], [0.014, -0.014]) * height * dir;
      break;
    case "STACK-BUILD":
      // the list stacks upward into place
      scale = interpolate(full, [0, 1], [1.03, 1.06]);
      ty = interpolate(settle, [0, 1], [0.04, 0]) * height;
      break;
    case "CROSS-OUT":
      // the negation beat: one band of doubt sweeps the frame and leaves. Deliberately NOT a
      // drawn cross - the hand-drawn annotation is already inside the image.
      scale = interpolate(full, [0, 1], [1.045, 1.02]);
      strike = interpolate(settle, [0, 1], [-35, 135]);
      ty = sway * 2;
      break;
    case "SPLIT-COMPARE":
      // two halves slide in from opposite edges and meet flush
      scale = interpolate(full, [0, 1], [1.03, 1.06]);
      splitP = settle;
      break;
    case "DOT-MULTIPLY":
      // quantity growing: a steady push with a soft multiplying pulse
      scale = interpolate(full, [0, 1], [1.02, 1.06]) + Math.sin(frame / 11) * 0.004;
      ty = sway * 2;
      break;
    case "ZOOM-DETAIL":
      // hard push into the detail being described
      scale = interpolate(full, [0, 1], [1.02, 1.195]);
      tx = interpolate(full, [0, 1], [0, -0.012]) * width * dir;
      ry = interpolate(full, [0, 1], [0.9, 0]) * dir;
      break;
    case "RING-ROTATE":
      // the concentric wheels: a slow real rotation, never a spin
      scale = 1.07;
      rot = Math.sin(frame / 74) * 2.2 * dir;
      ty = sway * 1.5;
      break;
    case "TILT-PAN-DOWN":
      scale = 1.08;
      ty = interpolate(full, [0, 1], [-0.03, 0.03]) * height;
      tx = interpolate(full, [0, 1], [0.01, -0.01]) * width * dir;
      rx = interpolate(full, [0, 1], [-0.6, 0.6]) * dir;
      break;
    case "TREE-TRACE":
      // a branching structure traced upward from the root
      scale = interpolate(full, [0, 1], [1.03, 1.06]);
      riseWipe = interpolate(settle, [0, 1], [0, 104], { extrapolateRight: "clamp" });
      break;

    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
      ty = sway * 2;
  }

  const g = GRADE[shot.grade] || GRADE.METHOD;
  const transform = `perspective(1400px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale}) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

  const imgStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: `${g.filter} brightness(${flicker})`,
    willChange: "transform",
  };

  // 2.5D separation: the soft plate travels ~1.5x further so the frame has two depths.
  const backTransform = `perspective(1400px) rotateY(${ry * 1.5}deg) rotateX(${rx * 1.5}deg) scale(${
    scale * 1.05
  }) translate(${tx * 1.55}px, ${ty * 1.4}px) rotate(${rot * 1.3}deg)`;
  const CENTRE_MASK =
    "radial-gradient(ellipse 62% 66% at 50% 47%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 54%, rgba(0,0,0,0) 88%)";

  return (
    <AbsoluteFill style={{ backgroundColor: shot.deep ? PAL.nearBlack : PAL.charcoal, overflow: "hidden" }}>
      <AbsoluteFill>
        {splitP === null ? (
          shot.depth ? (
            <>
              {/* softened far plate */}
              <Img
                src={staticFile(shot.file)}
                style={{ ...imgStyle, transform: backTransform, filter: `${imgStyle.filter} blur(6px)` }}
              />
              {/* sharp near plate, masked to the centre of interest */}
              <Img
                src={staticFile(shot.file)}
                style={{
                  ...imgStyle,
                  transform,
                  maskImage: CENTRE_MASK,
                  WebkitMaskImage: CENTRE_MASK,
                }}
              />
            </>
          ) : (
            <Img src={staticFile(shot.file)} style={{ ...imgStyle, transform }} />
          )
        ) : (
          // SPLIT-COMPARE: the same coherent image, halved, each side arriving from its own edge
          <>
            {([0, 1] as const).map((half) => {
              const off =
                interpolate(splitP, [0, 1], [half === 0 ? -0.14 : 0.14, 0], {
                  extrapolateRight: "clamp",
                }) * width;
              return (
                <AbsoluteFill
                  key={half}
                  style={{
                    clipPath: half === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
                    WebkitClipPath: half === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
                  }}
                >
                  <Img
                    src={staticFile(shot.file)}
                    style={{
                      ...imgStyle,
                      transform: `perspective(1400px) scale(${scale}) translate(${tx + off}px, ${ty}px) rotate(${rot}deg)`,
                    }}
                  />
                </AbsoluteFill>
              );
            })}
            {/* the seam only exists while the halves are travelling */}
            <AbsoluteFill style={{ pointerEvents: "none", opacity: 1 - splitP }}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: 3,
                  marginLeft: -1.5,
                  background: `linear-gradient(to bottom, transparent, ${PAL.charcoal}cc, transparent)`,
                }}
              />
            </AbsoluteFill>
          </>
        )}

        {/* DIAGRAM-DRAW: reveal left to right on a torn ink edge, then hold complete */}
        {drawWipe !== null ? (
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background: `linear-gradient(90deg, ${PAL.charcoal} 0%, ${PAL.charcoal} 92%, ${PAL.deepStone} 100%)`,
              clipPath: `inset(0 0 0 ${drawWipe}%)`,
              WebkitClipPath: `inset(0 0 0 ${drawWipe}%)`,
            }}
          />
        ) : null}

        {/* TREE-TRACE: traced upward from the root */}
        {riseWipe !== null ? (
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background: PAL.charcoal,
              clipPath: `inset(0 0 ${riseWipe}% 0)`,
              WebkitClipPath: `inset(0 0 ${riseWipe}% 0)`,
            }}
          />
        ) : null}

        {/* GRID-REVEAL: four bands clearing on a stagger, so the frame assembles as a grid */}
        {gridBands !== null
          ? [0, 1, 2, 3].map((b) => {
              const p = interpolate(gridBands as number, [b * 0.16, 0.52 + b * 0.16], [0, 1], {
                easing: Easing.out(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <AbsoluteFill
                  key={b}
                  style={{
                    pointerEvents: "none",
                    background: PAL.charcoal,
                    opacity: 1 - p,
                    clipPath: `inset(0 ${100 - (b + 1) * 25}% 0 ${b * 25}%)`,
                    WebkitClipPath: `inset(0 ${100 - (b + 1) * 25}% 0 ${b * 25}%)`,
                  }}
                />
              );
            })
          : null}

        {/* PAPER-WIPE-IN: a torn paper panel slides off to reveal the shot */}
        {paperWipe !== null ? (
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background: `linear-gradient(100deg, ${PAL.paper}, ${PAL.stone})`,
              clipPath: `inset(0 0 0 ${paperWipe}%)`,
              WebkitClipPath: `inset(0 0 0 ${paperWipe}%)`,
            }}
          />
        ) : null}
      </AbsoluteFill>

      {/* warm bloom: light spill belongs to the stage, so the arc is felt in the light itself */}
      {g.bloom > 0.001 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(ellipse 70% 62% at 50% ${shot.deep ? 54 : 42}%, ${PAL.firelight}, transparent 68%)`,
            mixBlendMode: "screen",
            opacity: g.bloom * flicker,
          }}
        />
      ) : null}

      <LightShafts strength={g.shaft} seed={shot.i} warm={g.bloom > 0.1} />

      {/* stage tint + stage vignette. Depth comes from these, never from crushing the image. */}
      <AbsoluteFill style={{ background: g.tint, mixBlendMode: "soft-light", opacity: g.op }} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse 84% 84% at 50% 48%, rgba(0,0,0,0) ${
            shot.deep ? 26 : 52
          }%, rgba(8,7,6,${g.vig}) 100%)`,
        }}
      />

      {/* deep cave: a pool of lamp warmth, because someone carried fat-light into the dark */}
      {shot.deep ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 54%, ${PAL.firelight}26, transparent 48%)`,
            mixBlendMode: "screen",
            opacity: 0.68 * flicker,
          }}
        />
      ) : null}

      {/* CROSS-OUT: the single band of doubt */}
      {strike !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "-14%",
              bottom: "-14%",
              left: `${strike}%`,
              width: "26%",
              transform: "skewX(-18deg)",
              background: `linear-gradient(90deg, transparent, ${PAL.charcoal}30, transparent)`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* TIMELINE-SLIDE: an ink rule draws itself along the base, locking the bar into register */}
      {inkRule !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              bottom: "6.5%",
              height: 5,
              borderRadius: 3,
              background: PAL.charcoal,
              opacity: 0.5,
              transform: `scaleX(${interpolate(inkRule, [0, 1], [0, 1], { extrapolateRight: "clamp" })})`,
              transformOrigin: shot.reverse ? "right" : "left",
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* ── section 8 motifs, drawn in code ── */}
      {shot.rings > 0.001 ? (
        <EchoRings strength={shot.rings} warm={g.bloom > 0.1} cy={shot.deep ? 0.54 : 0.5} />
      ) : null}
      {shot.eye !== null ? <EyeMotif growth={shot.eye} seed={shot.i} cy={shot.y !== null && shot.y > 0.5 ? 0.42 : 0.52} /> : null}
      {shot.outline ? <DottedOutline seed={shot.i} cy={shot.y !== null && shot.y > 0.5 ? 0.43 : 0.53} /> : null}

      {shot.ember ? <Embers seed={shot.i + 3} intensity={shot.deep ? 1.15 : 0.85} /> : null}
      {shot.dust ? <Dust seed={shot.i + 1} intensity={shot.deep ? 1.15 : 0.9} /> : null}
      {shot.shimmer ? <ShimmerOverlay delay={14} /> : null}

      {shot.type === "VOX" && shot.lines.length ? <TextOverlay shot={shot} /> : null}
    </AbsoluteFill>
  );
};
