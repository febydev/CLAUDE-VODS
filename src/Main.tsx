import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import data from "./scenes.json";
import type { Data } from "./types";
import { SceneShell } from "./scene/SceneShell";
import { FilmGrain } from "./overlay/FilmGrain";

const D = data as unknown as Data;
const CROSSFADE = 14;

export const Main: React.FC = () => {
  const scenes = D.scenes;
  return (
    <AbsoluteFill style={{ backgroundColor: "#160d08" }}>
      {/* Single programme timeline. Intro narration lives inside the voiceover (scene 0),
          so the voiceover begins at frame 0. The end card extends ~5s past the audio. */}
      <Sequence from={0} durationInFrames={D.totalFrames} name="Programme" layout="none">
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

      {/* Always-on film grain (Section 7.1). Full-bleed 1920x1080 — no letterbox bars. */}
      <FilmGrain opacity={0.035} />
    </AbsoluteFill>
  );
};
