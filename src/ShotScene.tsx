import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, PAL } from "./theme";
import { TextOverlay } from "./TextOverlay";
import type { Shot } from "./types";

// One coherent image per shot, animated by pipeline transforms (no AI video, no layers).
// Camera styles run continuously (never static > 1s); reveal styles settle by ~40% then hold.
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
      scale = interpolate(full, [0, 1], [1.02, 1.05]); break; // wipe handled by mask overlay below
    case "SWEEP-HIGHLIGHT":
      scale = interpolate(full, [0, 1], [1.02, 1.05]); sweepX = interpolate(settle, [0, 1], [-30, 130]); break;
    case "IRIS-REVEAL": {
      scale = interpolate(full, [0, 1], [1.02, 1.05]);
      const r = interpolate(settle, [0, 1], [0, 78]);
      clip = `circle(${r}% at 50% 50%)`;
      break;
    }
    default:
      scale = interpolate(full, [0, 1], [1.0, 1.04]);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.caveBlack, overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        <Img
          src={staticFile(shot.file)}
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
            filter: "brightness(1.02) contrast(1.04) saturate(1.03)", willChange: "transform",
          }}
        />
      </AbsoluteFill>

      {/* shared-world warm grade + soft vignette (faces stay bright) */}
      <AbsoluteFill style={{ background: PAL.ochre, mixBlendMode: "soft-light", opacity: 0.06 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 82% 82% at 50% 48%, rgba(0,0,0,0) 55%, rgba(23,19,15,0.28) 100%)` }} />

      {/* SWEEP-HIGHLIGHT lead-the-eye pass */}
      {sweepX !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweepX}%`, width: "34%", transform: "skewX(-14deg)",
            background: `linear-gradient(90deg, transparent, ${PAL.ivory}33, transparent)` }} />
        </AbsoluteFill>
      ) : null}

      {/* PAPER-WIPE-IN irregular reveal mask */}
      {shot.anim === "PAPER-WIPE-IN" ? (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: PAL.caveBlack,
          clipPath: `inset(0 0 0 ${interpolate(settle, [0, 1], [0, 100], { extrapolateRight: "clamp" })}%)`,
        }} />
      ) : null}

      {/* VOX fixed-coordinate text overlay */}
      {shot.type === "VOX" && shot.text && shot.x !== null && shot.y !== null ? (
        <TextOverlay text={shot.text} x={shot.x} y={shot.y} anchor={shot.anchor} maxw={shot.maxw} />
      ) : null}
    </AbsoluteFill>
  );
};
