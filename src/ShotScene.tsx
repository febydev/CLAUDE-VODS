import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, PUNCH, GRADE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import { Dust } from "./fx/Dust";
import type { Shot } from "./types";

// One coherent image per shot, animated by transforms (§9A). 16 styles incl. this video's two
// new ones: PUNCH-SETTLE (comedic snap) and EFFORT-SHAKE (strain tremor on heavy work).
export const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const dir = shot.reverse ? -1 : 1;

  const full = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const settle = interpolate(frame, [0, Math.max(6, durationInFrames * 0.4)], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const sway = Math.sin(frame / 34) * dir;

  let scale = 1.04, tx = 0, ty = 0, rot = 0;
  let clip: string | undefined;
  let sweepX: number | null = null;

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

    // ── NEW: comedic snap — punches in oversized then bounces back, then drifts gently
    case "PUNCH-SETTLE": {
      const s = spring({ frame, fps, config: { damping: 11, mass: 0.55, stiffness: 190 } });
      const punch = interpolate(s, [0, 1], [1.13, 1.0]);          // overshoot settle
      scale = punch + interpolate(full, [0, 1], [0, 0.025]);       // then a slow creep so it's never static
      ty = interpolate(s, [0, 1], [-height * 0.012, 0]) * dir;
      break;
    }
    // ── NEW: strain tremor — heavy effort reads physically, plus a slow push-in
    case "EFFORT-SHAKE": {
      scale = interpolate(full, [0, 1], [1.02, 1.06]);
      const ramp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }); // ease the tremor in
      const tremor = ramp * (1 + 0.5 * Math.sin(frame / 26));       // effort swells and eases
      tx = Math.sin(frame * 1.9) * 2.6 * tremor;
      ty = Math.sin(frame * 2.7 + 1.1) * 2.0 * tremor + sway * 2;
      rot = Math.sin(frame * 1.55) * 0.16 * tremor;                 // degrees
      break;
    }
    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
  }

  const g = shot.modern ? GRADE.MODERN : GRADE.ANCIENT;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.charcoal, overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        <Img
          src={staticFile(shot.file)}
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
            filter: g.filter, willChange: "transform",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: g.tint, mixBlendMode: "soft-light", opacity: g.op }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 84% 84% at 50% 48%, rgba(0,0,0,0) 56%, rgba(36,27,22,0.30) 100%)" }} />

      {/* ancient dust motes; modern shots stay clean (part of the visual gag) */}
      {shot.dust ? <Dust dir={dir} /> : null}

      {sweepX !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweepX}%`, width: "34%", transform: "skewX(-14deg)",
            background: `linear-gradient(90deg, transparent, ${PAL.ivory}2e, transparent)` }} />
        </AbsoluteFill>
      ) : null}

      {shot.anim === "PAPER-WIPE-IN" ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.charcoal,
          clipPath: `inset(0 0 0 ${interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" })}%)` }} />
      ) : null}

      {shot.type === "VOX" && shot.lines.length ? <TextOverlay shot={shot} /> : null}
    </AbsoluteFill>
  );
};
