import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from "remotion";
import type {Scene} from "../types";
import {ConceptScene} from "../gfx/ConceptScene";
import {PhotoScene} from "./PhotoScene";

const Layer: React.FC<{scene: Scene; inset: boolean; first: boolean}> = ({scene, inset, first}) => {
  const frame = useCurrentFrame();
  const opacity = first ? 1 : interpolate(frame, [0, 8], [0, 1], {extrapolateRight: "clamp"});
  const content = scene.kind === "CODE" ? <ConceptScene scene={scene}/> : <PhotoScene scene={scene} inset={inset}/>;
  return <AbsoluteFill style={{opacity, pointerEvents: "none"}}>{content}</AbsoluteFill>;
};

export const SentenceSequence: React.FC<{scenes: Scene[]; duration: number}> = ({scenes, duration}) => {
  const start = scenes[0].start;
  const secondInset = scenes[1].kind === "PHOTO" && scenes[1].duration < 39;
  const basePersists = scenes[0].duration < 39 || secondInset;
  return (
    <AbsoluteFill style={{background: "#17130F", overflow: "hidden"}}>
      {scenes.map((scene, index) => {
        const offset = scene.start - start;
        const inset = index > 0 && scene.kind === "PHOTO" && scene.duration < 39;
        const remaining = Math.max(1, duration - offset);
        const layerDuration = index === 0 && basePersists ? duration : index === 2 ? remaining : Math.min(remaining, scene.duration + 8);
        return (
          <Sequence key={scene.img} from={offset} durationInFrames={Math.max(1, layerDuration)} layout="none" name={`IMG-${scene.img}`}>
            <Layer scene={scene} inset={inset} first={index === 0}/>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};