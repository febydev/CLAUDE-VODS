import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import type {Scene} from "../types";
import {EASE} from "../theme";

export const PhotoScene: React.FC<{scene: Scene; inset?: boolean}> = ({scene, inset = false}) => {
  const frame = useCurrentFrame();
  const motionFrames = Math.max(45, scene.duration);
  const p = interpolate(frame, [0, motionFrames], [0, 1], {
    easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  let scale = 1.055;
  let x = 0;
  let y = 0;
  if (scene.kenBurns === "zoomIn") scale = 1 + p * 0.065;
  if (scene.kenBurns === "zoomOut") scale = 1.07 - p * 0.065;
  if (scene.kenBurns === "panLeft") x = -34 * p;
  if (scene.kenBurns === "panRight") x = -34 + 34 * p;
  y = (scene.img % 3 - 1) * p * 8;
  const image = (
    <>
      <Img src={staticFile(`images/${scene.file}`)} style={{width: "100%", height: "100%", objectFit: "cover",
        transform: `translate(${x}px, ${y}px) scale(${scale})`, filter: scene.filter, willChange: "transform"}} />
      <AbsoluteFill style={{background: scene.tint, mixBlendMode: "soft-light", opacity: scene.tintOp}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, transparent 48%, rgba(23,19,15,${scene.vig}) 100%)`}} />
    </>
  );
  if (!inset) return <AbsoluteFill style={{overflow: "hidden", background: "#17130F"}}>{image}</AbsoluteFill>;
  return (
    <div style={{position: "absolute", right: scene.img % 2 ? 88 : 760, bottom: 76, width: 760, height: 430,
      overflow: "hidden", clipPath: "polygon(2% 4%,98% 0,100% 94%,94% 100%,0 96%)",
      border: "5px solid rgba(247,229,188,.72)", boxShadow: "0 24px 70px rgba(23,19,15,.5)"}}>
      {image}
    </div>
  );
};