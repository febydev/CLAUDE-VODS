import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import data from "./scenes.json";
import type {Data, Scene} from "./types";
import {FilmGrain} from "./overlay/FilmGrain";
import {SentenceSequence} from "./scene/SentenceSequence";
import {SFX_CUES} from "./sfx";

const D = data as Data;
const groups: Scene[][] = [];
for (let index = 0; index < D.scenes.length; index += 3) groups.push(D.scenes.slice(index, index + 3));

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: "#17130F"}}>
    {groups.map((group, index) => {
      const start = group[0].start;
      const end = index + 1 < groups.length ? groups[index + 1][0].start : D.totalFrames;
      return (
        <Sequence key={index} from={start} durationInFrames={Math.max(1, end - start)} layout="none" name={`Sentence-${index + 1}`}>
          <SentenceSequence scenes={group} duration={end - start}/>
        </Sequence>
      );
    })}
    {SFX_CUES.map((cue) => <Sequence key={`${cue.frame}-${cue.file}`} from={cue.frame} durationInFrames={cue.file === "04_menu_camera_click.wav" ? 27 : 55} layout="none" name={`SFX-${cue.frame}`}>
      <Audio src={staticFile(`sfx/${cue.file}`)} volume={cue.volume}/>
    </Sequence>)}
    <Audio src={staticFile("final_voiceover.mp3")}/>
    <FilmGrain/>
  </AbsoluteFill>
);