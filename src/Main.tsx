import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import type { Data, Scene } from "./types";
import { SceneShell } from "./scene/SceneShell";
import { TraitBadge } from "./gfx/TraitBadge";
import { CTACard } from "./gfx/CTACard";
import { FilmGrain } from "./overlay/FilmGrain";
import { DISSOLVE } from "./theme";

const D = data as unknown as Data;
const DISSOLVE_FRAMES = 8;

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, DISSOLVE_FRAMES], [0, 1], { easing: DISSOLVE, extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <CTACard big={"THERE HAS NEVER BEEN,\nAND NEVER WILL BE,\nANYONE LIKE YOU."} sub={"New video every week — Subscribe."} />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const scenes = D.scenes;
  return (
    <AbsoluteFill style={{ backgroundColor: "#06060a" }}>
      <Sequence from={0} durationInFrames={D.totalFrames} name="Programme" layout="none">
        {scenes.map((scene: Scene, i) => {
          const next = scenes[i + 1];
          const tail = next && next.trans === "dissolve" ? DISSOLVE_FRAMES : 0;
          const dur = scene.duration + tail;
          const isEnd = scene.section === "END";
          return (
            <Sequence key={i} from={scene.start} durationInFrames={dur} name={`S${scene.seq}-IMG${scene.img}-${scene.kind}`} layout="none">
              {isEnd ? <EndCard /> : <SceneShell scene={scene} />}
            </Sequence>
          );
        })}

        {/* Part 8 trait badges — persistent overlay accumulating across IMG079-089 */}
        <Sequence from={D.badgeStart} durationInFrames={D.badgeEnd - D.badgeStart} name="TraitBadges" layout="none">
          <TraitBadge badges={D.badges} />
        </Sequence>

        <Audio src={staticFile("final_voiceover.mp3")} />
      </Sequence>

      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
