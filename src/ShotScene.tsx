import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, GRADE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import { Snow } from "./fx/Snow";
import type { Shot } from "./types";

// One coherent image per shot, animated by transforms (§9A). Ease everything; camera styles run
// continuously (never static > 1s); reveal styles settle by ~40% then hold; drift reverses between
// adjacent shots. Exteriors get cold desaturated grade + snow; interiors get warm firelight.
export const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const dir = shot.reverse ? -1 : 1;

  const full = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const settle = interpolate(frame, [0, Math.max(6, durationInFrames * 0.4)], [0, 1], { easing: EASE, extrapolateRight: "clamp" });
  const sway = Math.sin(frame / 34) * dir;

  let scale = 1.04, tx = 0, ty = 0;
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
    case "IRIS-REVEAL": {
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      clip = `circle(${interpolate(settle, [0, 1], [0, 78])}% at 50% 50%)`;
      break;
    }
    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
  }

  const g = shot.snow ? GRADE.EXT : GRADE.INT;
  // firelight flicker on interior emotional holds
  const flicker = !shot.snow && shot.anim === "BREATHING-HOLD"
    ? 1 + Math.sin(frame / 7) * 0.012 + Math.sin(frame / 3.3) * 0.006 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.night, overflow: "hidden" }}>
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

      {/* grade tint + soft vignette (faces stay bright) */}
      <AbsoluteFill style={{ background: g.tint, mixBlendMode: "soft-light", opacity: g.op }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 84% 84% at 50% 48%, rgba(0,0,0,0) 56%, rgba(20,24,28,0.30) 100%)` }} />

      {/* exterior weather */}
      {shot.snow ? <Snow dir={dir} /> : null}

      {/* SWEEP-HIGHLIGHT lead-the-eye pass */}
      {sweepX !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweepX}%`, width: "34%", transform: "skewX(-14deg)",
            background: `linear-gradient(90deg, transparent, ${PAL.firelight}30, transparent)` }} />
        </AbsoluteFill>
      ) : null}

      {/* PAPER-WIPE-IN irregular reveal */}
      {shot.anim === "PAPER-WIPE-IN" ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.night,
          clipPath: `inset(0 0 0 ${interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" })}%)` }} />
      ) : null}

      {shot.type === "VOX" && shot.lines.length ? <TextOverlay shot={shot} /> : null}
    </AbsoluteFill>
  );
};
