import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { KB_EASE, GRADE_FILTER, GRADE_TINT } from "../theme";
import type { Scene } from "../types";

// Every held image gets motion (spec CORE PRINCIPLE — nothing static > 1s).
// Ken Burns per category with the binding bezier(0.45,0,0.55,1):
//   default 100->108% · emotional 100->115% · diagram 100->104% (legible).
// Rendered oversized (base 1.12) for headroom. Parallax scenes get a 2nd center-masked
// layer drifting at 1.5x the base (spec fallback for flat single-layer assets).
// exitZoom scenes fly to ~3.5x + blur on their tail (zoom-through pivot into next topic).
export const PhotoScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { easing: KB_EASE, extrapolateRight: "clamp" });

  const kbTo = scene.kb === "emotional" ? 1.15 : scene.kb === "diagram" ? 1.04 : 1.08;
  const kb = interpolate(p, [0, 1], [1.0, kbTo]);
  const base = 1.12;

  // zoom-through exit on the tail
  let exitScale = 1, exitBlur = 0;
  if (scene.exitZoom) {
    const zStart = durationInFrames - 8;
    exitScale = interpolate(frame, [zStart, durationInFrames], [1, 3.6], { easing: KB_EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    exitBlur = interpolate(frame, [zStart, durationInFrames], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  const drift = interpolate(p, [0, 1], [0, -18]); // gentle base camera drift
  const filter = `${GRADE_FILTER[scene.grade]}${exitBlur ? ` blur(${exitBlur}px)` : ""}`;
  const tint = GRADE_TINT[scene.grade];

  const bgScale = base * kb * exitScale;
  const bgTx = drift * 0.5; // background parallax layer moves slower (0.5x)

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0e", overflow: "hidden" }}>
      {/* base / background layer */}
      <Img
        src={staticFile(`images/${scene.file}`)}
        style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${bgScale}) translateX(${bgTx}px)`,
          filter, willChange: "transform",
        }}
      />

      {/* parallax foreground layer: same art, pushed slightly more, drifting 1.5x, center-masked */}
      {scene.parallax && !scene.exitZoom ? (
        <Img
          src={staticFile(`images/${scene.file}`)}
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${base * kb * 1.04}) translateX(${drift * 1.5}px)`,
            filter,
            WebkitMaskImage: "radial-gradient(ellipse 58% 72% at 50% 54%, #000 40%, transparent 78%)",
            maskImage: "radial-gradient(ellipse 58% 72% at 50% 54%, #000 40%, transparent 78%)",
            willChange: "transform",
          }}
        />
      ) : null}

      {/* LUT-style grade tint */}
      <AbsoluteFill style={{ background: tint.color, mixBlendMode: "soft-light", opacity: tint.op }} />
      {/* legibility gradient for bottom-anchored text */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(6,6,12,0.5) 0%, rgba(0,0,0,0) 28%)" }} />
    </AbsoluteFill>
  );
};
