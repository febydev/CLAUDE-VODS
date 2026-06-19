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

  // heartbeat: subtle scale pulse synced to a ~1s rhythm
  let beat = 0;
  if (scene.heartbeat) beat = Math.sin(frame / 9) * 0.008 + Math.sin(frame / 4.5) * 0.004;
  const totalScale = scale + beat;

  // parallax: background layer moves slightly more than foreground tint
  const bgX = scene.parallax ? tx * 1.25 : tx;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${scene.file}`)}
        style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${totalScale}) translate(${bgX}px, ${ty}px)`,
          filter: scene.filter, willChange: "transform",
        }}
      />
      {/* LUT-style color tint overlay */}
      <AbsoluteFill style={{ background: scene.tint, mixBlendMode: scene.blend as any, opacity: scene.tintOp }} />
      {/* gentle bottom gradient so captions stay readable */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 32%)" }} />
    </AbsoluteFill>
  );
};
