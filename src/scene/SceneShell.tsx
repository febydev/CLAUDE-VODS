import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "../types";
import { PhotoScene } from "./PhotoScene";
import { Vignette } from "../overlay/Vignette";
import { Dust } from "../fx/Dust";
import { Ripple } from "../fx/Particles";
import { GlowBorder } from "../gfx/GlowBorder";
import { QuoteCard } from "../gfx/QuoteCard";
import { KineticText } from "../gfx/KineticText";
import { NumberCounter } from "../gfx/NumberCounter";
import { NetflixMap } from "../gfx/NetflixMap";
import { Timeline, TIMELINE_INDEX } from "../gfx/Timeline";
import { Diagram } from "../gfx/Diagram";
import { SplitScreen } from "../gfx/SplitScreen";
import { Stickman } from "../gfx/Stickman";
import { CTACard } from "../gfx/CTACard";
import { LowerThird } from "../gfx/LowerThird";
import { Overlay } from "../gfx/Overlays";

const CROSSFADE = 14;
const HERO = new Set([10, 84]);

const Built: React.FC<{ scene: Scene }> = ({ scene }) => {
  const c = scene.content || {};
  switch (scene.kind) {
    case "QUOTE":
      return <QuoteCard text={c.quote} color={scene.cap} hero={HERO.has(scene.img)}
        bgImage={scene.bucket === "ENHANCE" ? scene.file : null} />;
    case "KINETIC":
      return <KineticText words={c.kinetic} color={scene.cap} hardBlack={scene.img === 88} />;
    case "MAP":
      return <NetflixMap region={c.map.region} label={c.map.label} sub={c.map.sub}
        seqStep={c.map.seqStep} counter={c.map.counter} color={scene.cap} />;
    case "TIMELINE":
      return <Timeline active={TIMELINE_INDEX[scene.img]} color={scene.cap}
        title={c.timeline?.title} counter={c.timeline?.counter} />;
    case "DIAGRAM":
      return <Diagram type={c.diagram} color={scene.cap} />;
    case "SPLIT":
      return <SplitScreen {...c.split} color={scene.cap} />;
    case "STICKMAN":
      return <Stickman pose={c.stick} color={scene.cap}
        bg={`radial-gradient(ellipse at 50% 45%, ${scene.cap}14, #05080c 75%)`} />;
    case "CTA":
      return <CTACard big={c.cta.big} sub={c.cta.sub} color={scene.cap} />;
    default:
      return null;
  }
};

const PhotoWithOverlays: React.FC<{ scene: Scene }> = ({ scene }) => {
  const c = scene.content || {};
  return (
    <AbsoluteFill>
      <PhotoScene scene={scene} />
      {c.overlay ? <Overlay type={c.overlay} color={scene.cap} /> : null}
      {c.particle === "ripple" ? <Ripple color={scene.cap} /> : null}
      {c.counter ? (
        <div style={{ position: "absolute", top: "20%", width: "100%", display: "flex", justifyContent: "center", zIndex: 22 }}>
          <NumberCounter stat={c.counter} color={scene.cap} big={false} />
        </div>
      ) : null}
      {c.lower ? <LowerThird label={c.lower} color={scene.cap} /> : null}
    </AbsoluteFill>
  );
};

export const SceneShell: React.FC<{ scene: Scene; isFirst: boolean }> = ({ scene, isFirst }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const isReplace = scene.bucket === "REPLACE";

  const fadeIn = isFirst ? 1 : interpolate(frame, [0, CROSSFADE], [0, 1], { extrapolateRight: "clamp" });

  // zoom-punch pattern interrupt (IMG015)
  let punch = 1;
  if (scene.interrupt === "zoompunch") {
    const at = Math.floor(scene.duration * 0.45);
    punch = interpolate(frame, [at, at + 6, at + 16, at + 24], [1, 1.35, 1.35, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  }

  const aspect43 = scene.interrupt === "aspect43" || scene.interrupt === "aspect43_ramp";

  // color-inversion flash pattern interrupt (IMG009) — 2-frame subliminal pop mid-scene
  let flash = 0;
  if (scene.interrupt === "colorflash") {
    const at = Math.floor(scene.duration * 0.5);
    if (frame >= at && frame < at + 2) flash = 1;
  }

  // heartbeat zoom (Section 5.2) — applied at the SHELL level so it works on
  // every scene type, including quote cards and diagrams (IMG7/10/62/84).
  let beat = 0;
  if (scene.heartbeat) beat = Math.sin(frame / 9) * 0.009 + Math.sin(frame / 4.5) * 0.005;

  return (
    <AbsoluteFill style={{ opacity: fadeIn, transform: `scale(${punch + beat})` }}>
      {isReplace ? <Built scene={scene} /> : <PhotoWithOverlays scene={scene} />}

      <Vignette intensity={scene.vignette} />
      {scene.dust ? <Dust count={62} opacity={0.12} /> : null}
      {/* border glow on every scene: full intensity for graphics, subtle 30% on photos */}
      <GlowBorder color={scene.glow} intensity={isReplace ? 1 : 0.3} />

      {/* aspect-ratio shift pattern interrupt: 4:3 pillarbox + archival tone */}
      {aspect43 ? (
        <>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "12.5%", background: "#000", zIndex: 45 }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "12.5%", background: "#000", zIndex: 45 }} />
          <AbsoluteFill style={{ background: "rgba(60,40,20,0.18)", mixBlendMode: "overlay", zIndex: 44 }} />
        </>
      ) : null}

      {/* color-inversion flash (subliminal pattern interrupt) */}
      {flash ? <AbsoluteFill style={{ background: "#fff", mixBlendMode: "difference", zIndex: 46 }} /> : null}
    </AbsoluteFill>
  );
};
