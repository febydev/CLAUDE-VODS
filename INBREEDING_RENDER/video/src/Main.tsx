import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import type { Data, Shot } from "./types";
import { ShotScene } from "./ShotScene";
import { FilmGrain } from "./overlay/FilmGrain";
import { EASE, PAL } from "./theme";

const D = data as unknown as Data;
const WIPE = 11;                 // ~360ms paper wipe at the five section pivots
const MUSIC_BASE = 0.115;        // low bed so narration stays the focus
const MUSIC_DUCK = 0.090;        // ~-2 dB under each caption reveal (§10)
const DUCK_SET = new Set(D.musicDuck);

const Entrance: React.FC<{ shot: Shot; children: React.ReactNode }> = ({ shot, children }) => {
  const frame = useCurrentFrame();
  const fromBlack = /fade up from black/i.test(shot.trans);
  const wipeOn = /paper wipe/i.test(shot.trans);
  const opacity = fromBlack ? interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const wipe = wipeOn ? interpolate(frame, [0, WIPE], [0, 100], { easing: EASE, extrapolateRight: "clamp" }) : null;
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      {fromBlack ? (
        <AbsoluteFill style={{ background: "#000", pointerEvents: "none",
          opacity: interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" }) }} />
      ) : null}
      {wipe !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.slate,
          clipPath: `inset(0 0 0 ${wipe}%)`, WebkitClipPath: `inset(0 0 0 ${wipe}%)` }} />
      ) : null}
    </AbsoluteFill>
  );
};

// Music bed: pre-built by build_music_bed.py — the four supplied tracks looped to fill their
// sections, crossfaded between sections, with a smooth fade-in at the top and fade-out at the end.
// Here it only gets its final low level plus a ~2 dB dip under every caption reveal.
const musicVolume = (f: number) => {
  let v = MUSIC_BASE;
  for (const d of DUCK_SET) {
    if (f >= d - 8 && f <= d + 50) {
      const t = interpolate(f, [d - 8, d + 4, d + 38, d + 50], [MUSIC_BASE, MUSIC_DUCK, MUSIC_DUCK, MUSIC_BASE],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      v = Math.min(v, t);
    }
  }
  return v;
};

export const Main: React.FC = () => {
  const shots = D.shots;
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.charcoal }}>
      {shots.map((shot, i) => (
        <Sequence key={i} from={shot.start} durationInFrames={shot.duration}
          name={`${shot.shot}-${shot.type}-${shot.section}`} layout="none">
          <Entrance shot={shot}>
            <ShotScene shot={shot} />
          </Entrance>
          {shot.sfxFile ? (
            <Sequence from={shot.sfxLocal} layout="none">
              <Audio src={staticFile(shot.sfxFile)} volume={shot.sfxVol} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}

      <Audio src={staticFile("VOICEOVER_ancient-inbreeding_FULL.mp3")} />
      <Audio src={staticFile("music_bed.m4a")} volume={musicVolume} />

      <FilmGrain opacity={0.045} />
    </AbsoluteFill>
  );
};
