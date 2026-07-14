import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {Scene} from "../types";
import {COLORS, EASE, FONT, fitFont} from "../theme";
import {CONCEPT_FORMS} from "./ConceptCompositions";
import {SAFE, TITLE_MIN_PX} from "./ConceptPrimitives";

export const ConceptScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const form = scene.content.form;
  if (form === undefined || form < 0 || form >= CONCEPT_FORMS.length) throw new Error(`Unsupported FOOD concept form: ${form}`);
  const buildEnd = Math.max(10, Math.min(scene.duration - 24, Math.round(scene.duration * .58), 150));
  const p = interpolate(frame, [0, buildEnd], [0, 1], {easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const titleIn = spring({frame, fps, durationInFrames: Math.min(18, buildEnd), config: {damping: 20, stiffness: 130}});
  const at = (index: number, total = 4) => {
    const start = Math.min(buildEnd - 2, 2 + index * Math.max(1, (buildEnd - 7) / Math.max(1, total - 1)));
    const end = Math.max(start + 1, Math.min(buildEnd, start + Math.max(3, Math.round(buildEnd * .24))));
    return interpolate(frame, [start, end], [0, 1], {easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  };
  const Composition = CONCEPT_FORMS[form];
  return <AbsoluteFill style={{overflow: "hidden", background: `radial-gradient(ellipse at 50% 45%, ${scene.accent}35 0%, ${COLORS.charcoal} 52%, ${COLORS.cave} 100%)`, fontFamily: FONT}}>
    <AbsoluteFill style={{opacity: .13, backgroundImage: "linear-gradient(rgba(247,229,188,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(247,229,188,.09) 1px,transparent 1px)", backgroundSize: "60px 60px"}}/>
    <div style={{position: "absolute", left: SAFE.left+70, right: 1920-SAFE.right+70, top: SAFE.top+8, textAlign: "center", fontSize: Math.max(TITLE_MIN_PX, fitFont(scene.content.title ?? "", 62)), lineHeight: 1.05, fontWeight: 700, color: COLORS.ivory, letterSpacing: 1.2, opacity: titleIn, textShadow: "0 5px 18px rgba(0,0,0,.5)", zIndex: 2}}>{scene.content.title}</div>
    <Composition labels={scene.content.labels ?? []} accent={scene.accent} p={p} at={at}/>
  </AbsoluteFill>;
};
