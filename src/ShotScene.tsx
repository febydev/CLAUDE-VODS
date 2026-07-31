import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, GRADE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import { ShimmerOverlay } from "./overlay/ShimmerOverlay";
import { Dust } from "./fx/Dust";
import { Embers } from "./fx/Embers";
import { LightShafts } from "./fx/LightShafts";
import { IceMist } from "./fx/IceMist";
import { MythCancel } from "./motif/MythCancel";
import { DashedBorder } from "./motif/DashedBorder";
import type { Shot } from "./types";

/**
 * ANIMATION ENGINE - all 32 styles from FULL_PACKAGE section 10.
 *
 * Rules (enforced here, validated in build_data_my.py): ease everything, settle by ~40% of the shot
 * then hold, each shot reverses the drift direction of the one before it, no two adjacent shots share
 * a style, nothing fully static for more than 1.0s.
 *
 * CROSS-OUT IS THE SIGNATURE STYLE OF THIS PACKAGE and section 10 reserves it exclusively for the
 * faded myth cards: "Every time a myth is refused, the marker cross strokes on live. That repetition
 * is deliberate and it is the rhythm of the whole video." So on those shots the sweeping band of doubt
 * is joined by MythCancel, an identical cancellation event at an identical local frame, and by the one
 * signature sound - see motif/MythCancel.tsx.
 */
export const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const dir = shot.reverse ? -1 : 1;

  const full = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: EASE,
    extrapolateRight: "clamp",
  });
  const settle = interpolate(frame, [0, Math.max(8, durationInFrames * 0.4)], [0, 1], {
    easing: EASE,
    extrapolateRight: "clamp",
  });
  const sway = Math.sin(frame / 36) * dir;

  let scale = 1.04;
  let tx = 0;
  let ty = 0;
  let rot = 0;
  let ry = 0;
  let rx = 0;
  let flicker = 1;
  let vigBoost = 0; // positive tightens the frame, negative opens it out

  let paperWipe: number | null = null;
  let drawWipe: number | null = null;
  let gridBands: number | null = null;
  let branch: number | null = null;
  let strikeBand: number | null = null;
  let splitP: number | null = null;
  let inkRule: number | null = null;

  switch (shot.anim) {
    // ── the style built for this video ────────────────────────────────────────────────────
    case "SCALE-REVEAL":
      // the space opens up and the figure is left small in it; the vignette OPENS rather than closing
      scale = interpolate(full, [0, 1], [1.14, 1.0]);
      ty = interpolate(full, [0, 1], [0.012, -0.006]) * height;
      tx = interpolate(full, [0, 1], [0.008, -0.008]) * width * dir;
      vigBoost = interpolate(full, [0, 1], [0.06, -0.06]);
      break;

    // ── ANCIENT / CTA POOL ────────────────────────────────────────────────────────────────
    case "ISOLATE-DRIFT":
      scale = interpolate(full, [0, 1], [1.115, 1.0]);
      ty = interpolate(full, [0, 1], [0.006, -0.012]) * height;
      tx = interpolate(full, [0, 1], [0.012, -0.012]) * width * dir;
      vigBoost = interpolate(full, [0, 1], [0, 0.10]);
      break;
    case "CROWD-PRESS":
      scale = interpolate(full, [0, 1], [1.005, 1.115]);
      ty = interpolate(full, [0, 1], [0, 0.008]) * height * dir;
      vigBoost = interpolate(full, [0, 1], [0, 0.13]);
      break;
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
      scale = interpolate(full, [0, 1], [1.05, 1.135]);
      tx = interpolate(full, [0, 1], [0.02, -0.03]) * width * dir;
      rot = interpolate(full, [0, 1], [0.25, -0.2]) * dir;
      ry = interpolate(full, [0, 1], [1.1, -0.9]) * dir;
      break;
    case "FIRELIGHT-FLICKER":
      scale = 1.032 + Math.sin(frame / 46) * 0.006;
      ty = sway * 2;
      flicker = 1 + Math.sin(frame / 9) * 0.028 + Math.sin(frame / 3.3) * 0.013 + Math.sin(frame / 1.9) * 0.005;
      break;
    case "DOLLY-IN-LOW":
      scale = interpolate(full, [0, 1], [1.02, 1.105]);
      ty = interpolate(full, [0, 1], [0.012, -0.008]) * height;
      rot = interpolate(settle, [0, 1], [0.3, 0]) * dir;
      rx = interpolate(full, [0, 1], [-0.9, 0]) * dir;
      break;
    case "SLOW-ORBIT":
      scale = 1.095;
      rot = Math.sin(frame / 58) * 1.3 * dir;
      tx = Math.sin(frame / 62) * width * 0.016 * dir;
      ty = Math.cos(frame / 70) * height * 0.008;
      ry = Math.sin(frame / 62) * 1.6 * dir;
      break;
    case "CRAWL-FORWARD": {
      // the genuine squeeze shots: forward push with an irregular handheld tremor
      scale = interpolate(full, [0, 1], [1.04, 1.165]);
      const j = 1 + 0.4 * Math.sin(frame / 19);
      tx = (Math.sin(frame * 1.7) * 2.6 + Math.sin(frame * 0.9) * 1.8) * j * dir;
      ty = (Math.sin(frame * 2.3 + 1.1) * 2.2 + Math.sin(frame * 1.1) * 1.4) * j;
      rot = Math.sin(frame * 1.3) * 0.22 * j * dir;
      ry = Math.sin(frame / 23) * 0.8 * dir;
      break;
    }
    case "CTA-BUTTON-IN":
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
    case "PAN-LEFT":
      scale = 1.09;
      tx = interpolate(full, [0, 1], [0.05, -0.05]) * width * dir;
      break;
    case "PAPER-WIPE-IN":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      paperWipe = interpolate(settle, [0, 1], [0, 104], { extrapolateRight: "clamp" });
      break;
    case "TIMELINE-SLIDE":
      scale = 1.05;
      tx = interpolate(settle, [0, 1], [0.035, 0]) * width * dir;
      ty = sway * 1.6;
      inkRule = settle;
      break;
    case "DIAGRAM-DRAW":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      drawWipe = interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" });
      break;
    case "GRID-REVEAL":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      gridBands = settle;
      break;
    case "MAP-DRIFT":
      scale = 1.1;
      tx = interpolate(full, [0, 1], [0.03, -0.03]) * width * dir;
      ty = interpolate(full, [0, 1], [0.014, -0.014]) * height * dir;
      break;
    case "STACK-BUILD":
      scale = interpolate(full, [0, 1], [1.03, 1.06]);
      ty = interpolate(settle, [0, 1], [0.04, 0]) * height;
      break;
    case "CROSS-OUT":
      scale = interpolate(full, [0, 1], [1.045, 1.02]);
      strikeBand = interpolate(settle, [0, 1], [-35, 135]);
      ty = sway * 2;
      break;
    case "SPLIT-COMPARE":
      scale = interpolate(full, [0, 1], [1.03, 1.06]);
      splitP = settle;
      break;
    case "DOT-MULTIPLY":
      scale = interpolate(full, [0, 1], [1.02, 1.06]) + Math.sin(frame / 11) * 0.004;
      ty = sway * 2;
      break;
    case "ZOOM-DETAIL":
      scale = interpolate(full, [0, 1], [1.02, 1.195]);
      tx = interpolate(full, [0, 1], [0, -0.012]) * width * dir;
      ry = interpolate(full, [0, 1], [0.9, 0]) * dir;
      break;
    case "TILT-PAN-DOWN":
      scale = 1.08;
      ty = interpolate(full, [0, 1], [-0.03, 0.03]) * height;
      tx = interpolate(full, [0, 1], [0.01, -0.01]) * width * dir;
      rx = interpolate(full, [0, 1], [-0.6, 0.6]) * dir;
      break;
    case "SCALE-TIP":
      scale = interpolate(full, [0, 1], [1.03, 1.055]);
      rot = interpolate(settle, [0, 0.55, 1], [1.15 * dir, -0.55 * dir, 0]);
      ty = interpolate(settle, [0, 1], [0.008, 0]) * height;
      break;
    case "BRANCH-TRACE":
    case "TREE-TRACE":
      // structure traced outward from its root, then held complete. It gets its OWN decelerating ramp
      // rather than the shared `settle`: EASE is front-loaded, so driving a reveal off settle finishes
      // it within a few frames and nobody sees it (measured and fixed on the previous project).
      scale = interpolate(full, [0, 1], [1.03, 1.065]);
      branch = interpolate(frame, [0, Math.max(24, durationInFrames * 0.45)], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      tx = interpolate(full, [0, 1], [0.014, -0.014]) * width * dir;
      break;

    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
      ty = sway * 2;
  }

  const g = GRADE[shot.grade] || GRADE.CAVEATS;
  const transform = `perspective(1400px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale}) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

  const imgStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: `${g.filter} brightness(${flicker})`,
    willChange: "transform",
  };

  const backTransform = `perspective(1400px) rotateY(${ry * 1.5}deg) rotateX(${rx * 1.5}deg) scale(${
    scale * 1.05
  }) translate(${tx * 1.55}px, ${ty * 1.4}px) rotate(${rot * 1.3}deg)`;
  const CENTRE_MASK =
    "radial-gradient(ellipse 62% 66% at 50% 47%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 54%, rgba(0,0,0,0) 88%)";

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.charcoal, overflow: "hidden" }}>
      <AbsoluteFill>
        {splitP === null ? (
          shot.depth ? (
            <>
              <Img
                src={staticFile(shot.file)}
                style={{ ...imgStyle, transform: backTransform, filter: `${imgStyle.filter} blur(6px)` }}
              />
              <Img
                src={staticFile(shot.file)}
                style={{ ...imgStyle, transform, maskImage: CENTRE_MASK, WebkitMaskImage: CENTRE_MASK }}
              />
            </>
          ) : (
            <Img src={staticFile(shot.file)} style={{ ...imgStyle, transform }} />
          )
        ) : (
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

        {drawWipe !== null ? (
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background: `linear-gradient(90deg, ${PAL.charcoal} 0%, ${PAL.charcoal} 92%, ${PAL.slate} 100%)`,
              clipPath: `inset(0 0 0 ${drawWipe}%)`,
              WebkitClipPath: `inset(0 0 0 ${drawWipe}%)`,
            }}
          />
        ) : null}

        {/* BRANCH-TRACE / TREE-TRACE: a charcoal cover with a GROWING HOLE punched at the diagram's
            root, so the structure is revealed outward from where it starts. An SVG mask is used rather
            than an inverted clip-path, because clip-path cannot express "everything except this
            circle" and the naive version reveals the wrong half of the frame. */}
        {branch !== null ? (
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
              <defs>
                <mask id={`branchmask-${shot.i}`}>
                  <rect x={0} y={0} width={width} height={height} fill="white" />
                  <circle
                    cx={width * (shot.reverse ? 0.82 : 0.18)}
                    cy={height * 0.52}
                    r={interpolate(branch, [0, 1], [0, 0.92], { extrapolateRight: "clamp" }) * width}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect x={0} y={0} width={width} height={height} fill={PAL.charcoal} mask={`url(#branchmask-${shot.i})`} />
            </svg>
          </AbsoluteFill>
        ) : null}

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

      {g.bloom > 0.001 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(ellipse 70% 62% at 50% 44%, ${PAL.firelight}, transparent 68%)`,
            mixBlendMode: "screen",
            opacity: g.bloom * flicker,
          }}
        />
      ) : null}

      <LightShafts strength={g.shaft} seed={shot.i} warm={g.bloom > 0.1} />
      {shot.mist > 0.001 ? <IceMist strength={shot.mist} seed={shot.i} /> : null}

      <AbsoluteFill style={{ background: g.tint, mixBlendMode: "soft-light", opacity: g.op }} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse ${84 - vigBoost * 40}% ${84 - vigBoost * 40}% at 50% 48%, rgba(0,0,0,0) 48%, rgba(8,7,6,${Math.max(
            0.06,
            g.vig + vigBoost,
          )}) 100%)`,
        }}
      />

      {strikeBand !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "-14%",
              bottom: "-14%",
              left: `${strikeBand}%`,
              width: "26%",
              transform: "skewX(-18deg)",
              background: `linear-gradient(90deg, transparent, ${PAL.charcoal}30, transparent)`,
            }}
          />
        </AbsoluteFill>
      ) : null}

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

      {/* ── section 8 / section 12 motifs, drawn in code ── */}
      {shot.mythCard ? <MythCancel /> : null}
      {shot.dashed && !shot.dashedInArt ? <DashedBorder seed={shot.i} /> : null}

      {shot.ember ? <Embers seed={shot.i + 3} intensity={0.9} /> : null}
      {shot.dust ? <Dust seed={shot.i + 1} intensity={0.9} /> : null}
      {shot.shimmer ? <ShimmerOverlay delay={14} /> : null}

      {shot.type === "VOX" && shot.lines.length ? <TextOverlay shot={shot} /> : null}
    </AbsoluteFill>
  );
};
