import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE ONE TWIG STILL GROWING — the coded half of section 8's primary motif.
 *
 * Section 8: "The branching bush. Many limbs growing at once, nearly all ending in blunt stubs, one
 * thin twig continuing off frame. S009, S046, S062-S064, S142, S166, S172, S205, S215, S217. This is
 * the spine of the whole video and must look identical each time it returns."
 *
 * The bushes themselves are inside the generated VOX images, and a vision pass confirmed that (the
 * shots the spec names as bush shots really do read as branching-tree diagrams). So this does NOT
 * redraw a bush - drawing a second bush on top of a bush would be the same mistake as printing a
 * caption twice.
 *
 * What it draws is the ONE part of the motif that has to be identical at all eleven appearances and
 * cannot be guaranteed by eleven separately generated pictures: the single thin twig that does not
 * stop, leaving the frame at the same place, at the same angle, every time. It is anchored to the
 * frame edge rather than to the artwork, so it reads as "the one that keeps going" regardless of how
 * each underlying bush happens to be composed.
 *
 * `growth` runs 0..1 across the eleven appearances: at S009 the twig barely clears the edge, and by
 * S217 - "how nearly it went the other way" - it is drawn its full length and is the last thing still
 * moving on screen.
 */
export const SurvivingTwig: React.FC<{ growth: number; seed?: number }> = ({ growth, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // always the same anchor: right edge, just above centre, angling up and out of frame
  const x0 = width * 0.66;
  const y0 = height * 0.52;
  const len = width * interpolate(growth, [0, 1], [0.20, 0.40]);
  const x1 = x0 + len;
  const y1 = y0 - len * 0.42;

  // draws itself, then holds; the tip keeps a slow live sway so it is never fully static
  const draw = interpolate(frame, [8, 40], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = interpolate(frame, [6, 24, durationInFrames - 8, durationInFrames], [0, 0.62, 0.62, 0.54], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sway = Math.sin(frame / 38 + seed) * (2.2 + growth * 2.0);

  const total = Math.hypot(x1 - x0, y1 - y0);
  const stub = (bx: number, by: number, dx: number, dy: number, delay: number) => {
    const a = interpolate(frame, [delay, delay + 12], [1, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const L = Math.hypot(dx, dy);
    return (
      <line
        x1={bx}
        y1={by}
        x2={bx + dx}
        y2={by + dy}
        stroke={PAL.charcoal}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={L}
        strokeDashoffset={a * L}
      />
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op, zIndex: 29 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0 ${sway})`}>
          {/* two blunt stubs that stop - the branches that did not make it */}
          {stub(x0 + len * 0.18, y0 - len * 0.075, len * 0.13, -len * 0.20, 14)}
          {stub(x0 + len * 0.42, y0 - len * 0.175, len * 0.11, len * 0.17, 20)}

          {/* the twig that keeps going, straight off the frame edge */}
          <line
            x1={x0}
            y1={y0}
            x2={x1}
            y2={y1}
            stroke={PAL.charcoal}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={total}
            strokeDashoffset={draw * total}
          />
          {/* a warm highlight along it, so the surviving line is the one carrying light */}
          <line
            x1={x0}
            y1={y0 - 3}
            x2={x1}
            y2={y1 - 3}
            stroke={PAL.gold}
            strokeWidth={2.6}
            strokeLinecap="round"
            opacity={0.75}
            strokeDasharray={total}
            strokeDashoffset={draw * total}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
