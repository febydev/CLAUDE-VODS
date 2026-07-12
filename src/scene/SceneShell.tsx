import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Scene } from "../types";
import { PhotoScene } from "./PhotoScene";
import { Vignette } from "../overlay/Vignette";
import { GlowBleed } from "../overlay/GlowBleed";
import { ProbabilityText } from "../overlay/ProbabilityText";
import { StarField } from "../fx/StarField";
import { DISSOLVE } from "../theme";

const DISSOLVE_FRAMES = 8; // ~0.27s opacity-only cross-dissolve (reserved beats only)

export const SceneShell: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  // Entrance: hard cut = instant (opacity 1). Dissolve = opacity ramp over ~8 frames.
  const fade =
    scene.trans === "dissolve"
      ? interpolate(frame, [0, DISSOLVE_FRAMES], [0, 1], { easing: DISSOLVE, extrapolateRight: "clamp" })
      : 1;

  const vig = scene.grade === "COSMIC" ? 0.5 : scene.kb === "emotional" ? 0.24 : 0.14;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {scene.starfield ? <StarField /> : null}
      <PhotoScene scene={scene} />
      {scene.starfield ? (
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.55, zIndex: 6 }}>
          <StarField count={180} />
        </AbsoluteFill>
      ) : null}

      {/* darken behind the accumulating glass badge stack so it reads (Part 8) */}
      {scene.section === "BADGE" ? <AbsoluteFill style={{ background: "rgba(6,8,16,0.5)", zIndex: 8 }} /> : null}

      <Vignette intensity={vig} />
      {scene.glow ? <GlowBleed color={scene.glow} /> : null}
      {scene.overlay ? <ProbabilityText overlay={scene.overlay} /> : null}
    </AbsoluteFill>
  );
};
