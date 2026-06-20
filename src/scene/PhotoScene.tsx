import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE } from "../theme";
import type { Scene } from "../types";

// Full-bleed photo + Ken Burns + LUT-style grade. No parallax, no heartbeat (Section 4).
export const PhotoScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE, extrapolateRight: "clamp" });

  // subtle Ken Burns (Section 7.3): slow, felt not noticed
  let scale = 1.05, tx = 0;
  switch (scene.kenBurns) {
    case "zoomIn": scale = interpolate(p, [0, 1], [1.0, 1.08]); break;
    case "zoomOut": scale = interpolate(p, [0, 1], [1.08, 1.0]); break;
    case "panLeft": scale = 1.06; tx = interpolate(p, [0, 1], [0, -30]); break;
    case "panRight": scale = 1.06; tx = interpolate(p, [0, 1], [-30, 0]); break;
    case "none": scale = 1.04; break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0d14", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${scene.file}`)}
        style={{
          position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale}) translateX(${tx}px)`,
          filter: scene.filter, willChange: "transform",
        }}
      />
      {/* LUT-style warm/cool tint overlay */}
      <AbsoluteFill style={{ background: scene.tint, mixBlendMode: "soft-light", opacity: scene.tintOp }} />
      {/* gentle bottom gradient for any lower-third legibility */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(20,10,16,0.4) 0%, rgba(0,0,0,0) 26%)" }} />
    </AbsoluteFill>
  );
};
