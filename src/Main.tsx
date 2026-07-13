import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import data from "./scenes.json";
import type { Data } from "./types";
import { SceneShell } from "./scene/SceneShell";
import { Intro } from "./Intro";
import { FilmGrain } from "./overlay/FilmGrain";

const D = data as unknown as Data;
const CROSSFADE = 8;

export const Main: React.FC = () => {
  const scenes = D.scenes;
  return (
    <AbsoluteFill style={{ backgroundColor: "#130c07" }}>
      {/* Cinematic intro (silent) */}
      <Sequence from={0} durationInFrames={D.introFrames} name="Intro" layout="none">
        <Intro />
      </Sequence>

      {/* Programme — voiceover-relative timeline begins here */}
      <Sequence from={D.introFrames} durationInFrames={D.totalFrames} name="Programme" layout="none">
        {scenes.map((scene, i) => {
          const isLast = i === scenes.length - 1;
          const dur = scene.duration + (isLast ? 0 : CROSSFADE);
          return (
            <Sequence key={i} from={scene.start} durationInFrames={dur} name={`S${scene.seq}-IMG${scene.img}-${scene.kind}`} layout="none">
              <SceneShell scene={scene} isFirst={i === 0} />
            </Sequence>
          );
        })}
        <Audio src={staticFile("final_voiceover.mp3")} />
      </Sequence>

      <FilmGrain opacity={0.035} />
    </AbsoluteFill>
  );
};
