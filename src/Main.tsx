import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import type { Data, Shot } from "./types";
import { ShotScene } from "./ShotScene";
import { FilmGrain } from "./overlay/FilmGrain";
import { EASE, PAL } from "./theme";

const D = data as unknown as Data;
const OVERLAP = 16; // outgoing overlap so dissolve/wipe/push cross-fades from the previous image

const needsOverlap = (t: string) => /dissolve|push-through|wipe/i.test(t);

const Entrance: React.FC<{ shot: Shot; children: React.ReactNode }> = ({ shot, children }) => {
  const frame = useCurrentFrame();
  const t = shot.trans || "";
  let opacity = 1, scale = 1;
  if (/fade up from black/i.test(t)) opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  else if (/soft dissolve/i.test(t)) opacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  else if (/push-through/i.test(t)) { opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }); scale = interpolate(frame, [0, 13], [0.88, 1], { easing: EASE, extrapolateRight: "clamp" }); }

  const paperWipe = /earth-tone wipe/i.test(t)
    ? interpolate(frame, [0, 11], [0, 100], { easing: EASE, extrapolateRight: "clamp" })
    : null;

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {children}
      {/* fade-up-from-black cover for the opening shot */}
      {/fade up from black/i.test(t) ? (
        <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />
      ) : null}
      {/* earth-tone paper wipe reveals the shot from the left */}
      {paperWipe !== null ? (
        <AbsoluteFill style={{ pointerEvents: "none", background: PAL.rust,
          clipPath: `inset(0 0 0 ${paperWipe}%)`, WebkitClipPath: `inset(0 0 0 ${paperWipe}%)` }} />
      ) : null}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const shots = D.shots;
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.caveBlack }}>
      {shots.map((shot, i) => {
        const next = shots[i + 1];
        const tail = next && needsOverlap(next.trans) ? OVERLAP : 0;
        return (
          <Sequence key={i} from={shot.start} durationInFrames={shot.duration + tail} name={`${shot.shot}-${shot.type}`} layout="none">
            <Entrance shot={shot}>
              <ShotScene shot={shot} />
            </Entrance>
          </Sequence>
        );
      })}
      <Audio src={staticFile("VOICEOVER_ancient-disease_FULL.mp3")} />
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
