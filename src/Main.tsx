import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import data from "./scenes.json";
import { PhotoScene } from "./components/PhotoScene";
import { Vignette } from "./components/Vignette";
import { GlowBorder } from "./components/GlowBorder";
import { ShimmerOverlay } from "./components/ShimmerOverlay";
import { Particles } from "./components/Particles";
import { TextReveal } from "./components/TextReveal";
import { NumberCounter } from "./components/NumberCounter";
import { TitleSequence } from "./components/TitleSequence";
import { CTACard } from "./components/CTACard";

type Scene = {
  img: number;
  file: string;
  start: number;
  duration: number;
  mood: string;
  grade: string;
  kenBurns: any;
  vignette: number;
  glow: string | null;
  title: boolean;
  text: [string, "center" | "lower"] | null;
  stat: { to: number; label: string; prefix?: string; suffix?: string } | null;
  particles: boolean;
  shimmer: boolean;
  cta: boolean;
};

const CROSSFADE = 15; // 0.5s default crossfade

// Incoming scene fades in over the crossfade window for a smooth dissolve.
const SceneBody: React.FC<{ scene: Scene; isFirst: boolean }> = ({ scene, isFirst }) => {
  const frame = useCurrentFrame();
  const opacity = isFirst
    ? 1
    : interpolate(frame, [0, CROSSFADE], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <PhotoScene
        file={scene.file}
        kenBurns={scene.kenBurns}
        grade={scene.grade}
        vignette={scene.vignette}
      />
      {scene.glow ? <GlowBorder color={scene.glow} /> : null}
      {scene.shimmer ? <ShimmerOverlay delay={10} /> : null}
      {scene.particles ? (
        <Particles count={46} gold={scene.mood !== "cool"} />
      ) : null}
      {scene.stat ? (
        <NumberCounter
          stat={scene.stat}
          color={scene.mood === "cool" ? "#7fd6ff" : "#ffd27a"}
        />
      ) : null}
      {scene.text ? <TextReveal text={scene.text[0]} position={scene.text[1]} /> : null}
      {scene.cta ? <CTACard /> : null}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const scenes = data.scenes as unknown as Scene[];

  const titleScenes = scenes.filter((s) => s.title);
  const titleStart = titleScenes.length ? titleScenes[0].start : 0;
  const titleEnd = titleScenes.length
    ? titleScenes[titleScenes.length - 1].start + titleScenes[titleScenes.length - 1].duration
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => {
        const isLast = i === scenes.length - 1;
        const dur = scene.duration + (isLast ? 0 : CROSSFADE);
        return (
          <Sequence
            key={scene.img}
            from={scene.start}
            durationInFrames={dur}
            name={`IMG${scene.img}`}
            layout="none"
          >
            <SceneBody scene={scene} isFirst={i === 0} />
          </Sequence>
        );
      })}

      {/* Cinematic opening title spanning the first beats */}
      {titleScenes.length ? (
        <Sequence from={titleStart} durationInFrames={titleEnd - titleStart} name="TitleSequence" layout="none">
          <TitleSequence />
        </Sequence>
      ) : null}

      <Audio src={staticFile("final_voiceover.mp3")} />
    </AbsoluteFill>
  );
};
