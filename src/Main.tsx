import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import type { Data, Shot } from "./types";
import { ShotScene } from "./ShotScene";
import { FilmGrain } from "./overlay/FilmGrain";
import { EASE, PAL } from "./theme";

const D = data as unknown as Data;
const WIPE = 11; // ~360ms wet-paper wipe at the six section pivots

const Entrance: React.FC<{ shot: Shot; children: React.ReactNode }> = ({ shot, children }) => {
  const frame = useCurrentFrame();
  const fromBlack = /fade up from black/i.test(shot.trans);
  const wet = /wet wipe/i.test(shot.trans);
  const opacity = fromBlack ? interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const wipe = wet ? interpolate(frame, [0, WIPE], [0, 100], { easing: EASE, extrapolateRight: "clamp" }) : null;
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      {fromBlack ? (
        <AbsoluteFill style={{ background: "#000", pointerEvents: "none",
          opacity: interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" }) }} />
      ) : null}
      {/* wet-paper wipe: a rain-slate mask slides off the frame at section pivots */}
      {wipe !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.storm,
          clipPath: `inset(0 0 0 ${wipe}%)`, WebkitClipPath: `inset(0 0 0 ${wipe}%)` }} />
      ) : null}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const shots = D.shots;
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.charcoal }}>
      {shots.map((shot, i) => (
        <Sequence key={i} from={shot.start} durationInFrames={shot.duration}
          name={`${shot.shot}-${shot.type}-${shot.stage}`} layout="none">
          <Entrance shot={shot}>
            <ShotScene shot={shot} />
          </Entrance>
          {/* tiktok SFX — contextual: caption landings, six section pivots, stat reveals,
              lamp reveals in the cave, finale accent. The deep-cave stretch S054-S066 is kept
              near-silent on purpose (§10 + brief): only 4 faint lamp ticks across 13 shots. */}
          {shot.sfxFile ? (
            <Sequence from={shot.sfxLocal} layout="none">
              <Audio src={staticFile(shot.sfxFile)} volume={shot.sfxVol} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}
      <Audio src={staticFile("VOICEOVER_ancient-rain_FULL.mp3")} />
      <FilmGrain opacity={0.045} />
    </AbsoluteFill>
  );
};
