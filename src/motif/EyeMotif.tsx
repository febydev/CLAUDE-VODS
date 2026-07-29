import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE EYE — the video's recurring motif, drawn in code.
 *
 * FULL_PACKAGE section 8: "The recurring motif is the eye and the empty outline. An eye means
 * attention... The eye appears at S004, S005, S010, S117, S181, S188, S190, S191, S192, S197 and
 * must be drawn as the same graphic object each time, growing in scale across the video so S188
 * and S197 read as the return of the opening image."
 *
 * v1 shipped without this: the motif existed only inside whatever each generated still happened
 * to contain, so the growth and the callback were not actually in the video. This component is
 * the missing object. It is ONE path set, identical at every appearance, and the only thing that
 * changes is `growth` (0 at S004 -> 1 at S197). Section 8's callback pairs S004 / S190 / S197 are
 * therefore automatic.
 *
 * Style matches the hand-drawn world: charcoal ink of even weight, flat fill, no blur, drawn on
 * with stroke-dashoffset rather than faded in. It blinks on a slow cycle (an authorized adaptive
 * item in 7A: "echo-ring and eye-blink animation"), never faster than once per ~4s, so it stays
 * inside section 12's no-flash-above-3Hz rule.
 */
const EYE_W = 240; // viewBox units
const EYE_H = 160;

export const EyeMotif: React.FC<{
  growth: number; // 0..1 across the video's ten appearances
  seed?: number;
  cy?: number; // vertical centre as a fraction of frame height
}> = ({ growth, seed = 0, cy = 0.46 }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // scale: a small ink sigil at the top of the video, most of the frame by the return.
  const spanW = interpolate(growth, [0, 1], [0.20, 1.02], { extrapolateRight: "clamp" }) * width;
  const scale = spanW / EYE_W;
  // the bigger it gets the quieter it must sit, or it stops being a motif and becomes a sticker
  const baseOp = interpolate(growth, [0, 0.5, 1], [0.52, 0.42, 0.34]);

  // draw on over ~28f, hold complete (resolve-then-hold, never fades out mid-animation)
  const draw = interpolate(frame, [6, 34], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const irisDraw = interpolate(frame, [18, 44], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = interpolate(frame, [4, 20, durationInFrames - 10, durationInFrames], [0, baseOp, baseOp, baseOp * 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // blink: a lid sweeps down and back roughly every 130 frames, 8 frames long
  const period = 130 + seed * 11;
  const t = (frame + seed * 37) % period;
  const blink = t < 9 ? Math.sin((t / 9) * Math.PI) : 0;

  // the pupil tracks a slow arc, so the thing genuinely reads as watching
  const look = Math.sin(frame / 52 + seed) * 14;
  const lookY = Math.cos(frame / 71 + seed) * 5;

  const ink = PAL.charcoal;
  const lw = 5.5 / Math.max(0.55, Math.sqrt(scale)); // keep the ink weight even at every size

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op, zIndex: 30 }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id={`eyeglow-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={PAL.gold} stopOpacity={0.34} />
            <stop offset="55%" stopColor={PAL.firelight} stopOpacity={0.10} />
            <stop offset="100%" stopColor={PAL.firelight} stopOpacity={0} />
          </radialGradient>
        </defs>

        <g transform={`translate(${width / 2} ${height * cy}) scale(${scale})`}>
          {/* warm attention behind the eye */}
          <ellipse cx={0} cy={0} rx={EYE_W * 0.62} ry={EYE_H * 0.66} fill={`url(#eyeglow-${seed})`} />

          {/* the almond, drawn as two hand-struck arcs */}
          <path
            d="M -110 2 C -68 -54, 68 -58, 110 0"
            fill="none"
            stroke={ink}
            strokeWidth={lw}
            strokeLinecap="round"
            strokeDasharray={260}
            strokeDashoffset={draw * 260}
          />
          <path
            d="M -110 2 C -66 56, 66 58, 110 0"
            fill="none"
            stroke={ink}
            strokeWidth={lw}
            strokeLinecap="round"
            strokeDasharray={260}
            strokeDashoffset={draw * 260}
          />

          {/* iris + pupil: the part that looks back */}
          <g transform={`translate(${look} ${lookY})`} opacity={1 - blink * 0.9}>
            <circle
              cx={0}
              cy={0}
              r={38}
              fill="none"
              stroke={ink}
              strokeWidth={lw}
              strokeDasharray={239}
              strokeDashoffset={irisDraw * 239}
            />
            <circle cx={0} cy={0} r={16 + blink * 2} fill={ink} opacity={1 - irisDraw} />
            <circle cx={-11} cy={-11} r={5.2} fill={PAL.ivory} opacity={(1 - irisDraw) * 0.9} />
          </g>

          {/* lashes / rays of attention above the lid, staggered so they strike one by one */}
          {[-78, -52, -26, 0, 26, 52, 78].map((x, i) => {
            const a = interpolate(frame, [22 + i * 2, 36 + i * 2], [1, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const h = 26 - Math.abs(x) * 0.11;
            return (
              <line
                key={x}
                x1={x}
                y1={-40 - Math.abs(x) * 0.06}
                x2={x * 1.1}
                y2={-40 - h - Math.abs(x) * 0.06}
                stroke={ink}
                strokeWidth={lw * 0.8}
                strokeLinecap="round"
                strokeDasharray={40}
                strokeDashoffset={a * 40}
              />
            );
          })}

          {/* the lid itself, closing on the blink */}
          {blink > 0.02 ? (
            <path
              d={`M -110 2 C -68 ${-54 + blink * 54}, 68 ${-58 + blink * 58}, 110 0 C 66 58, -66 56, -110 2 Z`}
              fill={PAL.paper}
              opacity={blink * 0.85}
            />
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
