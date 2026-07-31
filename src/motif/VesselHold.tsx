import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE VESSEL HOLD — the coded half of section 8's third motif.
 *
 * Section 8: "The plain pale vessel. S097-S099, S103, S115, S122-S124, S206, S207. Always the same
 * smooth featureless object." Section 8 also names the callback "S103 with S207 (holding the vessel,
 * twice)", and section 11 asks for a "held unresolved vessel tone" at S103 returning at S207.
 *
 * The vessels themselves are inside the generated images, and the guardrail in 7A is extremely specific
 * about what they may look like - plain, pale, rounded, no facial features, no bone identity. So this
 * draws NOTHING representational. Redrawing a vessel would risk the guardrail and would duplicate the
 * artwork, which is the same defect as printing a caption over baked-in text.
 *
 * What it adds is the one thing ten separately generated pictures cannot have: an IDENTICAL held
 * moment. A soft warm pool of light gathers on the object's centre over the same curve every time,
 * breathes once, and then simply stays - the visual equivalent of the unresolved tone the spec asks
 * for. Same easing, same position, same strength, ten times. That is what makes the returns rhyme, and
 * it is pure atmosphere, so it cannot violate the guardrail.
 *
 * `weight` is 0 for the ordinary appearances and 1 for the two callback shots (S103, S207), where the
 * hold is allowed to be a little longer and a little warmer because the narration is dwelling there.
 */
export const VesselHold: React.FC<{ weight?: number; seed?: number }> = ({ weight = 0, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // gather over ~30 frames, breathe once, then hold for the rest of the shot
  const gather = interpolate(frame, [8, 38], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + Math.sin((frame - 38) / 26) * 0.05 * gather;
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0.86], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strength = (0.26 + weight * 0.10) * gather * breathe * out;
  if (strength <= 0.002) return null;

  const r = 34 + weight * 5;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 27 }}>
      {/* the pool of warm attention on the held object */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 54%, ${PAL.firelight} 0%, ${PAL.ochre}00 ${r}%)`,
          mixBlendMode: "screen",
          opacity: strength,
        }}
      />
      {/* a matching gentle close-down at the edges, so the eye is held rather than pushed */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 78% 78% at 50% 54%, rgba(0,0,0,0) 52%, rgba(10,9,8,0.34) 100%)`,
          opacity: gather * out,
        }}
      />
    </AbsoluteFill>
  );
};
