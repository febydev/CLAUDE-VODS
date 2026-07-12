import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Scene } from "../types";
import { PhotoScene } from "./PhotoScene";
import { Vignette } from "../overlay/Vignette";
import { GlowBleed } from "../overlay/GlowBleed";
import { DISSOLVE, COSMIC_BG } from "../theme";
import { RarityGrid } from "../gfx/RarityGrid";
import { PieChart } from "../gfx/PieChart";
import { ScaleCrowd } from "../gfx/ScaleCrowd";
import { AnimatedMap } from "../gfx/AnimatedMap";
import { Equation } from "../gfx/Equation";
import { CosmicScale } from "../gfx/CosmicScale";
import { ColorMosaic } from "../gfx/ColorMosaic";
import { FunnelChart } from "../gfx/FunnelChart";
import { TimelineFill } from "../gfx/TimelineFill";
import { ScaleStack } from "../gfx/ScaleStack";
import { TraitBadge } from "../gfx/TraitBadge";

const DISSOLVE_FRAMES = 8;

const Component: React.FC<{ scene: Scene }> = ({ scene }) => {
  const c = scene.content || {};
  switch (scene.kind) {
    case "RARITY_GRID": return <RarityGrid cols={c.cols} rows={c.rows} lit={c.lit} label={c.label} glow={c.glow} />;
    case "PIE": return <PieChart percent={c.percent} label={c.label} highlightColor={c.color} />;
    case "SCALE_CROWD": return <ScaleCrowd label={c.label} color={c.color} count={c.count} />;
    case "MAP": return <AnimatedMap mode={c.mode} location={c.location} counterTo={c.counterTo} counterPrefix={c.counterPrefix} label={c.label} glow={c.glow} />;
    case "EQUATION": return <Equation a={c.a} b={c.b} result={c.result} />;
    case "COSMIC": return <CosmicScale label={c.label} climax={c.climax} figure={c.figure} />;
    case "MOSAIC": return <ColorMosaic label={c.label} dense={c.dense} />;
    case "FUNNEL": return <FunnelChart topLabel={c.topLabel} bottomLabel={c.bottomLabel} />;
    case "TIMELINE": return <TimelineFill label={c.label} />;
    case "BADGE": return (
      <AbsoluteFill style={{ background: COSMIC_BG }}>
        {c.final ? <TraitBadge badges={c.badges} /> : null}
      </AbsoluteFill>
    ); // 79-84: dark bg, badges drawn by persistent overlay. 89: final board + ghosts.
    default: return null;
  }
};

export const SceneShell: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const fade = scene.trans === "dissolve"
    ? interpolate(frame, [0, DISSOLVE_FRAMES], [0, 1], { easing: DISSOLVE, extrapolateRight: "clamp" })
    : 1;

  const isImage = scene.kind === "IMAGE";
  const vig = scene.grade === "COSMIC" ? 0.45 : scene.kb === "emotional" ? 0.24 : 0.12;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {isImage ? <PhotoScene scene={scene} /> : <Component scene={scene} />}
      {isImage ? <Vignette intensity={vig} /> : null}
      {isImage && scene.glow ? <GlowBleed color={scene.glow} /> : null}
    </AbsoluteFill>
  );
};
