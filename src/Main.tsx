import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import type { Data, Scene } from "./types";
import { Intro } from "./Intro";
import { SceneShell } from "./scene/SceneShell";
import { FilmGrain } from "./overlay/FilmGrain";
import { Captions } from "./overlay/Captions";
import { PALETTE } from "./theme";

const D = data as unknown as Data;
const CROSSFADE = 14;

// Picks the active scene's caption highlight color for the current frame.
const CaptionsLayer: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  const frame = useCurrentFrame();
  let color = PALETTE.cyan;
  for (const s of scenes) {
    if (frame >= s.start && frame < s.start + s.duration) { color = s.cap; break; }
  }
  return <Captions highlightColor={color} />;
};

export const Main: React.FC = () => {
  const scenes = D.scenes;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Cinematic intro (no voiceover) */}
      <Sequence from={0} durationInFrames={D.introFrames} name="Intro" layout="none">
        <Intro />
      </Sequence>

      {/* Main programme — VO-relative timeline begins here */}
      <Sequence from={D.introFrames} durationInFrames={D.totalFrames} name="Programme" layout="none">
        {scenes.map((scene, i) => {
          const isLast = i === scenes.length - 1;
          const dur = scene.duration + (isLast ? 0 : CROSSFADE);
          return (
            <Sequence key={scene.seq} from={scene.start} durationInFrames={dur} name={`S${scene.seq}-IMG${scene.img}-${scene.kind}`} layout="none">
              <SceneShell scene={scene} isFirst={i === 0} />
            </Sequence>
          );
        })}

        <CaptionsLayer scenes={scenes} />

        <Audio src={staticFile("final_audio_mixed.mp3")} />
      </Sequence>

      {/* Always-on overlays across the whole composition (Section 5.1) */}
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
