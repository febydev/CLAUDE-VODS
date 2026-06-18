import { AbsoluteFill, Img, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Vignette } from "./Vignette";

type KB = "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift";

const ease = Easing.bezier(0.33, 0, 0.2, 1);

export const PhotoScene: React.FC<{
  file: string;
  kenBurns: KB;
  grade: string;
  vignette: number;
}> = ({ file, kenBurns, grade, vignette }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: ease,
    extrapolateRight: "clamp",
  });

  let scale = 1.06;
  let tx = 0;
  let ty = 0;
  switch (kenBurns) {
    case "zoomIn":
      scale = interpolate(p, [0, 1], [1.02, 1.12]);
      break;
    case "zoomOut":
      scale = interpolate(p, [0, 1], [1.14, 1.03]);
      break;
    case "panLeft":
      scale = 1.1;
      tx = interpolate(p, [0, 1], [38, -38]);
      break;
    case "panRight":
      scale = 1.1;
      tx = interpolate(p, [0, 1], [-38, 38]);
      break;
    case "drift":
      scale = interpolate(p, [0, 1], [1.05, 1.1]);
      tx = interpolate(p, [0, 1], [-22, 22]);
      ty = interpolate(p, [0, 1], [16, -16]);
      break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${file}`)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          filter: grade,
          willChange: "transform",
        }}
      />
      <Vignette intensity={vignette} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
