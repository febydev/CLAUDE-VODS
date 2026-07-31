import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import data from "./scenes.json";
import type { Data, Shot } from "./types";
import { ShotScene } from "./ShotScene";
import { CtaModule } from "./cta/CtaModule";
import { FilmGrain } from "./overlay/FilmGrain";
import { EASE, PAL } from "./theme";

const D = data as unknown as Data;

// The spec has no transition_in column, so section 10's default applies: action cuts throughout, with
// a fade up from black on shot 1 only. Hard cuts also protect the hard invariant that every in-point
// lands on its exact spoken word - a crossfade would smear that landing. The one exception is the arc
// pivots, which clear on a short paper wipe so a chapter change is felt; that is an OVERLAY on the
// incoming shot, so no in-point moves by a single frame.
const FADE_UP = 7;
const FADE_OUT = 18;
const PIVOT = 10;

/** Piecewise-linear automation through the keyframe table in scenes.json. */
const levelAt = (f: number, keys: number[][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  const lastKey = keys[keys.length - 1];
  if (f >= lastKey[0]) return lastKey[1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [f0, v0] = keys[i - 1];
      const [f1, v1] = keys[i];
      return f1 === f0 ? v1 : v0 + ((v1 - v0) * (f - f0)) / (f1 - f0);
    }
  }
  return lastKey[1];
};

const Entrance: React.FC<{ shot: Shot; children: React.ReactNode }> = ({ shot, children }) => {
  const frame = useCurrentFrame();
  const isFirst = shot.i === 0;
  if (!isFirst && !shot.pivot) return <AbsoluteFill>{children}</AbsoluteFill>;

  if (isFirst) {
    const cover = interpolate(frame, [0, FADE_UP], [1, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill>
        {children}
        <AbsoluteFill style={{ background: "#000", pointerEvents: "none", opacity: cover }} />
      </AbsoluteFill>
    );
  }

  const p = interpolate(frame, [0, PIVOT], [0, 104], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inkFade = interpolate(frame, [0, PIVOT * 0.8], [0.5, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const clip = shot.reverse ? `inset(0 ${p}% 0 0)` : `inset(0 0 0 ${p}%)`;
  return (
    <AbsoluteFill>
      {children}
      {p < 104 ? (
        <>
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background: `linear-gradient(${shot.reverse ? 260 : 100}deg, ${PAL.paper}, ${PAL.stone})`,
              clipPath: clip,
              WebkitClipPath: clip,
            }}
          />
          <AbsoluteFill style={{ pointerEvents: "none", background: PAL.charcoal, opacity: inkFade }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** Final breath: the picture settles to black over the last 0.6s while the audio completes. */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const op = interpolate(frame, [durationInFrames - FADE_OUT, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0) return null;
  return <AbsoluteFill style={{ background: "#000", pointerEvents: "none", opacity: op, zIndex: 80 }} />;
};

export const Main: React.FC = () => {
  const music = D.music;
  const cta = D.cta;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.charcoal }}>
      {D.shots.map((shot) => (
        <Sequence
          key={shot.shot}
          from={shot.start}
          durationInFrames={shot.duration}
          name={`${shot.shot} ${shot.type} ${shot.stage} ${shot.anim}`}
          layout="none"
        >
          <Entrance shot={shot}>
            <ShotScene shot={shot} />
          </Entrance>
          {/* SOUND DESIGN, expanded at the user's request for this video: seven of the nine library
              effects are in play instead of the usual two, each bound to ONE animation family so the
              same gesture always makes the same sound. Every hit is synced to the LANDING frame of the
              animation, not its start, and every level stays at or under 0.14 so narration dominates.
              See build_data_sp.py for the full mapping and the per-file counts. */}
          {shot.sfxFile ? (
            <Sequence from={shot.sfxLocal} layout="none">
              <Audio src={staticFile(shot.sfxFile)} volume={shot.sfxVol} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}

      {/* ── CTA module (section 9): entirely code-generated, no baked image, no baked text ── */}
      <Sequence
        from={cta.startFrame}
        durationInFrames={cta.endFrame - cta.startFrame}
        name="CTA module"
        layout="none"
      >
        <CtaModule />
      </Sequence>
      {/* the module's own three cues, each on its exact visual event from the section 9 timeline */}
      <Sequence from={cta.landFrame} layout="none">
        <Audio src={staticFile(cta.clickFile)} volume={cta.landVol} />
      </Sequence>
      <Sequence from={cta.clickFrame} layout="none">
        <Audio src={staticFile(cta.clickFile)} volume={cta.clickVol} />
      </Sequence>
      <Sequence from={cta.bellFrame} layout="none">
        <Audio src={staticFile(cta.bellFile)} volume={cta.bellVol} />
      </Sequence>

      {/* ── narration: never ducked, shifted or compressed (section 7 / section 11) ── */}
      <Audio src={staticFile("voiceover.mp3")} />

      {/* ── ONE quiet track for the whole video (the user asked for the quiet bed on this one):
             Quiet_Ancient_Campfire, looped with its seams crossfaded so there is no audible restart,
             EQ-carved around the narrator's band, and mixed at 0.042 - about 27.5 dB under the voice.
             Ducked 3.5 dB across the CTA window and restored by 574.20s per section 9. The single
             largest swell of the video lands on S218 and nowhere earlier, per section 11. ── */}
      <Audio src={staticFile(music.src)} volume={(f) => levelAt(f, music.keyframes)} />

      {/* film grain on every scene, 3-4% (section 7.1) */}
      <FilmGrain opacity={0.038} />
      <Outro />
    </AbsoluteFill>
  );
};
