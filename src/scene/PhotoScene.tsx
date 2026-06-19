import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE } from "../theme";
import type { Scene } from "../types";

export const PhotoScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE, extrapolateRight: "clamp" });

  let scale = 1.07, tx = 0, ty = 0;
  switch (scene.kenBurns) {
    case "zoomIn": scale = interpolate(p, [0, 1], [1.03, 1.14]); break;
    case "zoomOut": scale = interpolate(p, [0, 1], [1.16, 1.04]); break;
    case "panLeft": scale = 1.12; tx = interpolate(p, [0, 1], [42, -42]); break;
    case "panRight": scale = 1.12; tx = interpolate(p, [0, 1], [-42, 42]); break;
    case "drift": scale = interpolate(p, [0, 1], [1.06, 1.12]); tx = interpolate(p, [0, 1], [-24, 24]); ty = interpolate(p, [0, 1], [16, -16]); break;
  }

  const src = staticFile(`images/${scene.file}`);

  // TRUE PARALLAX: two layers from the image moving at different speeds.
  // Background = enlarged + blurred, travels ~1.6x (far plane).
  // Foreground = sharper, center-masked, travels ~0.5x (near plane).
  if (scene.parallax) {
    const bgScale = scale * 1.16;
    const bgX = tx * 1.6, bgY = ty * 1.6;
    const fgScale = scale * 1.0;
    const fgX = tx * 0.5, fgY = ty * 0.5;
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
        {/* far background plane */}
        <Img src={src} style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${bgScale}) translate(${bgX}px, ${bgY}px)`,
          filter: `${scene.filter} blur(3px) brightness(0.82)`, willChange: "transform",
        }} />
        {/* near foreground plane, masked to centre so edges reveal the moving bg */}
        <Img src={src} style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${fgScale}) translate(${fgX}px, ${fgY}px)`,
          filter: scene.filter, willChange: "transform",
          WebkitMaskImage: "radial-gradient(ellipse 62% 70% at 50% 52%, #000 52%, transparent 86%)",
          maskImage: "radial-gradient(ellipse 62% 70% at 50% 52%, #000 52%, transparent 86%)",
        }} />
        <AbsoluteFill style={{ background: scene.tint, mixBlendMode: scene.blend as any, opacity: scene.tintOp }} />
        <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 32%)" }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img src={src} style={{
        position: "absolute", width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        filter: scene.filter, willChange: "transform",
      }} />
      <AbsoluteFill style={{ background: scene.tint, mixBlendMode: scene.blend as any, opacity: scene.tintOp }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 32%)" }} />
    </AbsoluteFill>
  );
};
