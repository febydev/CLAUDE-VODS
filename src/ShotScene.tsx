import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, GRADE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import { Rain } from "./fx/Rain";
import type { Shot } from "./types";

// One coherent image per shot, animated by transforms (§9A). 18 styles, including this video's
// four new ones: DRIP-REVEAL, LAMP-REVEAL (deep cave), SHIVER-HOLD, FIRELIGHT-FLICKER.
export const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const dir = shot.reverse ? -1 : 1;

  const full = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const settle = interpolate(frame, [0, Math.max(6, durationInFrames * 0.4)], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const sway = Math.sin(frame / 34) * dir;

  let scale = 1.04, tx = 0, ty = 0, rot = 0;
  let clip: string | undefined;
  let sweepX: number | null = null;
  let dripMask = false;
  let lampR: number | null = null;
  let flicker = 1;

  switch (shot.anim) {
    case "PUSH-IN":
    case "KENBURNS-PUSH":
      scale = interpolate(full, [0, 1], [1.0, 1.05]); ty = sway * 4; break;
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
      scale = 1.02 + Math.sin(frame / 40) * 0.006; ty = sway * 2; break;
    case "PAPER-WIPE-IN":
      scale = interpolate(full, [0, 1], [1.02, 1.05]); break;
    case "SWEEP-HIGHLIGHT":
      scale = interpolate(full, [0, 1], [1.02, 1.05]); sweepX = interpolate(settle, [0, 1], [-30, 130]); break;
    case "IRIS-REVEAL":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      clip = `circle(${interpolate(settle, [0, 1], [0, 78])}% at 50% 50%)`; break;

    // ── NEW: water sheets off glass, clearing the image downward
    case "DRIP-REVEAL":
      scale = interpolate(full, [0, 1], [1.03, 1.06]);
      dripMask = true; break;

    // ── NEW: a small circle of lamplight expands out of darkness (deep cave only)
    case "LAMP-REVEAL":
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      lampR = interpolate(settle, [0, 1], [8, 96]);
      flicker = 1 + Math.sin(frame / 6) * 0.018 + Math.sin(frame / 2.7) * 0.008;
      break;

    // ── NEW: fine cold tremor for soaked/freezing shots + slow push-in
    case "SHIVER-HOLD": {
      scale = interpolate(full, [0, 1], [1.02, 1.055]);
      const ramp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
      const shiver = ramp * (1 + 0.45 * Math.sin(frame / 22));   // cold comes in waves
      tx = Math.sin(frame * 2.6) * 1.9 * shiver;
      ty = Math.sin(frame * 3.4 + 0.8) * 1.5 * shiver + sway * 1.5;
      rot = Math.sin(frame * 2.1) * 0.10 * shiver;
      break;
    }

    // ── NEW: near-static hold with firelight rising and falling across the face
    case "FIRELIGHT-FLICKER":
      scale = 1.025 + Math.sin(frame / 44) * 0.005;
      ty = sway * 2;
      flicker = 1 + Math.sin(frame / 8) * 0.030 + Math.sin(frame / 3.1) * 0.014 + Math.sin(frame / 1.7) * 0.006;
      break;

    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
  }

  const g = GRADE[shot.grade] || GRADE.COLD;
  if (clip === undefined && lampR !== null) clip = `circle(${lampR}% at 50% 52%)`;

  return (
    <AbsoluteFill style={{ backgroundColor: shot.deep ? "#0b0907" : PAL.charcoal, overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        <Img
          src={staticFile(shot.file)}
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
            filter: `${g.filter} brightness(${flicker})`, willChange: "transform",
          }}
        />
        {/* DRIP-REVEAL: a soft horizontal edge sheets downward, clearing the frame */}
        {dripMask ? (
          <AbsoluteFill style={{
            background: `linear-gradient(to bottom, rgba(11,9,7,0) ${interpolate(settle, [0, 1], [-12, 102])}%, rgba(20,26,30,0.92) ${interpolate(settle, [0, 1], [4, 118])}%)`,
            backdropFilter: "blur(2px)", pointerEvents: "none",
          }} />
        ) : null}
      </AbsoluteFill>

      {/* stage grade tint + stage vignette (DEEP is the darkest section in the video) */}
      <AbsoluteFill style={{ background: g.tint, mixBlendMode: "soft-light", opacity: g.op }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 82% 82% at 50% 48%, rgba(0,0,0,0) ${shot.deep ? 30 : 54}%, rgba(8,7,6,${g.vig}) 100%)` }} />

      {/* lamp warmth pooling in the deep cave */}
      {shot.deep ? (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 54%, ${PAL.firelight}22, transparent 46%)`, mixBlendMode: "screen", opacity: 0.7 * flicker }} />
      ) : null}

      {/* §8A rain particles, driven by the stage */}
      <Rain mode={shot.rainMode} intensity={shot.rainI} dir={dir} />

      {sweepX !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweepX}%`, width: "34%", transform: "skewX(-14deg)",
            background: `linear-gradient(90deg, transparent, ${PAL.ivory}2e, transparent)` }} />
        </AbsoluteFill>
      ) : null}

      {shot.anim === "PAPER-WIPE-IN" ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.storm,
          clipPath: `inset(0 0 0 ${interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" })}%)` }} />
      ) : null}

      {shot.type === "VOX" && shot.lines.length ? <TextOverlay shot={shot} /> : null}
    </AbsoluteFill>
  );
};
