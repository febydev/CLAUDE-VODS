import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, GRADE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import type { Shot } from "./types";

// One coherent image per shot, animated by transforms (§9A). 18 styles including this video's
// three new ones: WEB-EXPAND, TREE-TRACE, WALK-TRACK.
// §9 ring-vs-web spine: closed-ring beats stay TIGHT and constrained; web/network beats OPEN
// outward so the network reads bigger. That's baked into the scale ranges below.
export const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const dir = shot.reverse ? -1 : 1;

  const full = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const settle = interpolate(frame, [0, Math.max(6, durationInFrames * 0.4)], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const sway = Math.sin(frame / 34) * dir;
  const tight = !shot.web;   // ring sections sit tighter in frame

  let scale = 1.04, tx = 0, ty = 0;
  let clip: string | undefined;
  let sweepX: number | null = null;
  let flicker = 1;

  switch (shot.anim) {
    case "PUSH-IN":
    case "KENBURNS-PUSH":
      scale = interpolate(full, [0, 1], tight ? [1.03, 1.085] : [1.0, 1.05]); ty = sway * 4; break;
    case "PULL-BACK":
    case "KENBURNS-PULL":
      scale = interpolate(full, [0, 1], [1.05, 1.0]); ty = sway * 4; break;
    case "PAN-LEFT":
      scale = 1.09; tx = interpolate(full, [0, 1], [0.05, -0.05]) * width * dir; break;
    case "PAN-RIGHT":
      scale = 1.09; tx = interpolate(full, [0, 1], [-0.05, 0.05]) * width * dir; break;
    case "PARALLAX-PAN-L":
      scale = interpolate(full, [0, 1], [1.07, 1.10]); tx = interpolate(full, [0, 1], [0.045, -0.045]) * width * dir; break;
    case "PARALLAX-PAN-R":
      scale = interpolate(full, [0, 1], [1.07, 1.10]); tx = interpolate(full, [0, 1], [-0.045, 0.045]) * width * dir; break;
    case "SLOW-RISE":
      scale = interpolate(full, [0, 1], [1.0, 1.035]); ty = interpolate(full, [0, 1], [0.035, -0.01]) * height; break;
    case "GENTLE-SWAY":
      scale = 1.05; tx = sway * width * 0.008; ty = Math.cos(frame / 40) * height * 0.006 * dir; break;
    case "BREATHING-HOLD":
      scale = (tight ? 1.05 : 1.02) + Math.sin(frame / 40) * 0.006; ty = sway * 2; break;
    case "PAPER-WIPE-IN":
      scale = interpolate(full, [0, 1], [1.02, 1.05]); break;
    case "SWEEP-HIGHLIGHT":
      scale = interpolate(full, [0, 1], [1.02, 1.05]); sweepX = interpolate(settle, [0, 1], [-30, 130]); break;
    case "IRIS-REVEAL":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      clip = `circle(${interpolate(settle, [0, 1], [0, 78])}% at 50% 50%)`; break;
    case "FIRELIGHT-FLICKER":
      scale = 1.025 + Math.sin(frame / 44) * 0.005; ty = sway * 2;
      flicker = 1 + Math.sin(frame / 8) * 0.030 + Math.sin(frame / 3.1) * 0.014 + Math.sin(frame / 1.7) * 0.006;
      break;

    // ── NEW: the network opens outward — starts close on one node, pulls wide so the web grows
    case "WEB-EXPAND":
      scale = interpolate(full, [0, 1], [1.13, 1.0]);
      ty = interpolate(full, [0, 1], [0.010, 0]) * height * dir;
      break;

    // ── NEW: drifts along the diagram as if tracing its links (diagonal, slow, deliberate)
    case "TREE-TRACE":
      scale = 1.085;
      tx = interpolate(full, [0, 1], [-0.030, 0.030]) * width * dir;
      ty = interpolate(full, [0, 1], [0.022, -0.022]) * height * dir;
      break;

    // ── NEW: lateral tracking following the departing/arriving figure, background parallaxing
    case "WALK-TRACK":
      scale = interpolate(full, [0, 1], [1.10, 1.07]);
      tx = interpolate(full, [0, 1], [0.058, -0.058]) * width * dir;
      ty = Math.sin(frame / 12) * 2.2;     // slight gait bob
      break;

    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
  }

  const g = GRADE[shot.grade] || GRADE.TRAP;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.charcoal, overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        <Img
          src={staticFile(shot.file)}
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
            filter: `${g.filter} brightness(${flicker})`, willChange: "transform",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: g.tint, mixBlendMode: "soft-light", opacity: g.op }} />
      {/* ring sections get a tighter, heavier vignette; web sections breathe */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${tight ? 74 : 88}% ${tight ? 74 : 88}% at 50% 48%, rgba(0,0,0,0) ${tight ? 44 : 60}%, rgba(10,9,8,${g.vig}) 100%)` }} />

      {sweepX !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweepX}%`, width: "34%", transform: "skewX(-14deg)",
            background: `linear-gradient(90deg, transparent, ${PAL.ivory}2e, transparent)` }} />
        </AbsoluteFill>
      ) : null}

      {shot.anim === "PAPER-WIPE-IN" ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.slate,
          clipPath: `inset(0 0 0 ${interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" })}%)` }} />
      ) : null}

      {shot.type === "VOX" && shot.lines.length ? <TextOverlay shot={shot} /> : null}
    </AbsoluteFill>
  );
};
