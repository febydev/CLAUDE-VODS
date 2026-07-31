import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE MYTH-CARD CANCELLATION — the signature beat of this package, in code.
 *
 * Section 8: "The faded myth card. Every discredited belief is drawn as a faded, dusty-rose,
 * century-old museum print with a heavy hand-drawn charcoal marker cross struck through it. Same card
 * style, same cross, every single time. It appears at least twelve times and it is the spine of the
 * video." Section 10 adds that CROSS-OUT is reserved for exactly these shots and that "that repetition
 * is deliberate and it is the rhythm of the whole video". Section 11 asks for the same short dry
 * marker sound at the same level every time, recognisable by the fourth one.
 *
 * The card and the cross are inside the generated VOX images, and a vision pass confirms it - so this
 * does NOT draw another cross on top. Drawing a second cross would be the same defect as printing a
 * caption over baked-in text.
 *
 * What it adds is the thing 23 separately generated pictures cannot have: an IDENTICAL cancellation
 * event. At the same local frame every time, the frame takes a short dusty-rose paper flush and a dip
 * in colour, as if the page had just been struck and the ink had bled - then it settles and holds. Same
 * curve, same duration, same strength, 23 times, landing with the same sound. That is what turns a
 * repeated composition into a rhythm the viewer can feel coming.
 */
export const CANCEL_FRAME = 26; // the strike lands here on every myth card, without exception

export const MythCancel: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const local = frame - CANCEL_FRAME;
  // a fast hit and a slower settle: up in 3 frames, gone by 22, then nothing for the rest of the shot
  const hit = interpolate(local, [-2, 3, 12, 22], [0, 1, 0.45, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (hit <= 0.001) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 33 }}>
      {/* the page flushes dusty rose - the faded-museum-print colour of every myth card */}
      <AbsoluteFill
        style={{
          background: PAL.dustyRose,
          mixBlendMode: "multiply",
          opacity: 0.30 * hit,
        }}
      />
      {/* ink bleeding in from the edges as the stroke lands */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 92% 92% at 50% 50%, rgba(0,0,0,0) 46%, ${PAL.charcoal} 100%)`,
          opacity: 0.42 * hit,
        }}
      />
      {/* a single hard flash of paper white on the strike frame itself, 2 frames only - well under the
          3 Hz flash limit in section 12 because it happens once per shot */}
      <AbsoluteFill
        style={{
          background: PAL.paper,
          opacity: interpolate(local, [0, 1, 3], [0, 0.13, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
