import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import type { Data, Shot } from "./types";
import { ShotScene } from "./ShotScene";
import { FilmGrain } from "./overlay/FilmGrain";
import { PAL } from "./theme";

const D = data as unknown as Data;

const Entrance: React.FC<{ shot: Shot; children: React.ReactNode }> = ({ shot, children }) => {
  const frame = useCurrentFrame();
  const fromBlack = /fade up from black/i.test(shot.trans);
  const opacity = fromBlack ? interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      {fromBlack ? (
        <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />
      ) : null}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const shots = D.shots;
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.caveBlack }}>
      {shots.map((shot, i) => (
        <Sequence key={i} from={shot.start} durationInFrames={shot.duration} name={`${shot.shot}-${shot.type}`} layout="none">
          <Entrance shot={shot}>
            <ShotScene shot={shot} />
          </Entrance>
          {/* tiktok SFX: fires on the overlay-landing frame for VOX reveals + finale resolution */}
          {shot.sfxFile ? (
            <Sequence from={shot.sfxLocal} layout="none">
              <Audio src={staticFile(shot.sfxFile)} volume={shot.sfxVol} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}
      <Audio src={staticFile("VOICEOVER_ancient-language_FULL.mp3")} />
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
