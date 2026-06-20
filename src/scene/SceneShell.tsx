import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Scene } from "../types";
import { PhotoScene } from "./PhotoScene";
import { Vignette } from "../overlay/Vignette";
import { Dust } from "../fx/Dust";
import { ShimmerOverlay } from "../overlay/ShimmerOverlay";
import { QuoteCard } from "../gfx/QuoteCard";
import { KineticText } from "../gfx/KineticText";
import { NumberCounter } from "../gfx/NumberCounter";
import { DataViz } from "../gfx/DataViz";
import { SplitScreen } from "../gfx/SplitScreen";
import { Stickman } from "../gfx/Stickman";
import { Diagram } from "../gfx/Diagram";
import { LowerThird } from "../gfx/LowerThird";
import { CTACard } from "../gfx/CTACard";
import { TitleCard } from "../gfx/TitleCard";

const CROSSFADE = 14;
const HERO = new Set([86]); // final question hero quote

const Built: React.FC<{ scene: Scene }> = ({ scene }) => {
  const c = scene.content || {};
  switch (scene.kind) {
    case "QUOTE": return <QuoteCard text={c.quote} accent={scene.accent} hero={HERO.has(scene.img)} />;
    case "KINETIC": return <KineticText words={c.kinetic} wordFrames={c.wordFrames || []} accent={scene.accent} />;
    case "COUNTER": return <NumberCounter to={c.counter.to} label={c.counter.label} suffix={c.counter.suffix} accent={scene.accent} />;
    case "DATAVIZ": return <DataViz kind={c.dataviz} accent={scene.accent} />;
    case "SPLIT": return <SplitScreen {...c.split} accent={scene.accent} />;
    case "STICKMAN": return <Stickman pose={c.stick} accent={scene.accent} />;
    case "DIAGRAM": return <Diagram type={c.diagram} accent={scene.accent} />;
    case "LOWER3": return <LowerThird label={c.lower} accent={scene.accent} standalone />;
    case "CTA": return <CTACard big={c.cta.big} sub={c.cta.sub} accent={scene.accent} />;
    case "TITLE": return <TitleCard title={c.title} sub={c.sub} accent={scene.accent} />;
    default: return null;
  }
};

const PhotoWithOverlays: React.FC<{ scene: Scene }> = ({ scene }) => {
  const c = scene.content || {};
  return (
    <AbsoluteFill>
      <PhotoScene scene={scene} />
      {c.lower ? <LowerThird label={c.lower} accent={scene.accent} /> : null}
    </AbsoluteFill>
  );
};

export const SceneShell: React.FC<{ scene: Scene; isFirst: boolean }> = ({ scene, isFirst }) => {
  const frame = useCurrentFrame();
  const isReplace = scene.bucket === "REPLACE";
  const fadeIn = isFirst ? 1 : interpolate(frame, [0, CROSSFADE], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {isReplace ? <Built scene={scene} /> : <PhotoWithOverlays scene={scene} />}

      <Vignette intensity={scene.vig} />
      {scene.dust ? <Dust count={40} opacity={0.1} /> : null}

      {/* border glow ONLY on motion-graphic scenes (Section 4) */}
      {isReplace ? (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 32 }}>
          <div style={{ position: "absolute", inset: 18, boxShadow: `inset 0 0 ${60 + pulse * 30}px ${scene.glow}`, opacity: 0.35 + 0.2 * pulse, borderRadius: 4 }} />
        </AbsoluteFill>
      ) : null}

      {scene.shimmer ? <ShimmerOverlay delay={isFirst ? 8 : 5} /> : null}
    </AbsoluteFill>
  );
};
