import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE RING AND THE OUTSIDE — the video's primary motif, drawn in code.
 *
 * FULL_PACKAGE section 8: "A closed ring of figure marks with one mark outside it. It appears at
 * S012, S072, S077, S203, S204 and S210 and is the visual spine of the whole argument. Inside is
 * warm, outside is cold, every time."
 *
 * That instruction is the thesis of the whole video in one graphic, so it is built as ONE object
 * used identically at all six appearances: a closed ring of small figure marks around a warm centre,
 * and a single mark outside it in cold blue-grey with a cold gap between them. The only thing that
 * changes per appearance is `growth`, which widens the gap - by S210 ("cruelty arrives with crowds")
 * the outside mark is further away than it was at S012.
 *
 * Ink language matches the hand-drawn world: charcoal strokes of even weight, flat fills, no blur.
 * The ring marks draw on one at a time, then hold; the outside mark arrives last and never joins.
 */
const MARKS = 12;

export const RingAndOutside: React.FC<{ growth: number; seed?: number; cy?: number }> = ({
  growth,
  seed = 0,
  cy = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const R = Math.min(width, height) * interpolate(growth, [0, 1], [0.15, 0.20]);
  const cx = width * 0.5;
  const y = height * cy;
  // the gap the outside mark sits in widens across the video
  const outDist = R * interpolate(growth, [0, 1], [1.55, 2.25]);

  const op = interpolate(frame, [4, 22, durationInFrames - 8, durationInFrames], [0, 0.62, 0.62, 0.52], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // a slow breath so the ring is never fully static
  const breathe = 1 + Math.sin(frame / 48 + seed) * 0.010;

  const figure = (fx: number, fy: number, r: number, cold: boolean, a: number) => (
    <g opacity={a}>
      <circle cx={fx} cy={fy - r * 1.5} r={r * 0.62} fill={cold ? PAL.coldBlue : PAL.ivory}
        stroke={PAL.charcoal} strokeWidth={r * 0.24} />
      <line x1={fx} y1={fy - r * 0.9} x2={fx} y2={fy + r * 0.9} stroke={PAL.charcoal}
        strokeWidth={r * 0.26} strokeLinecap="round" />
      <line x1={fx - r * 0.7} y1={fy + r * 1.9} x2={fx} y2={fy + r * 0.9} stroke={PAL.charcoal}
        strokeWidth={r * 0.24} strokeLinecap="round" />
      <line x1={fx + r * 0.7} y1={fy + r * 1.9} x2={fx} y2={fy + r * 0.9} stroke={PAL.charcoal}
        strokeWidth={r * 0.24} strokeLinecap="round" />
    </g>
  );

  const mr = R * 0.17;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op, zIndex: 30 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`ringwarm-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={PAL.firelight} stopOpacity={0.34} />
            <stop offset="60%" stopColor={PAL.ochre} stopOpacity={0.12} />
            <stop offset="100%" stopColor={PAL.ochre} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`ringcold-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={PAL.coldBlue} stopOpacity={0.26} />
            <stop offset="100%" stopColor={PAL.coldBlue} stopOpacity={0} />
          </radialGradient>
        </defs>

        <g transform={`translate(${cx} ${y}) scale(${breathe})`}>
          {/* INSIDE IS WARM: the shared fire the ring is gathered around */}
          <circle cx={0} cy={0} r={R * 0.95} fill={`url(#ringwarm-${seed})`} />

          {/* the closed ring itself, drawn as a hand-struck circle */}
          <circle
            cx={0}
            cy={0}
            r={R}
            fill="none"
            stroke={PAL.charcoal}
            strokeWidth={4}
            opacity={0.55}
            strokeDasharray={2 * Math.PI * R}
            strokeDashoffset={interpolate(frame, [4, 30], [2 * Math.PI * R, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />

          {/* twelve figure marks, striking on one at a time, all facing inward */}
          {Array.from({ length: MARKS }).map((_, i) => {
            const a = (i / MARKS) * Math.PI * 2 - Math.PI / 2;
            const fade = interpolate(frame, [10 + i * 1.6, 20 + i * 1.6], [0, 1], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <g key={i}>{figure(Math.cos(a) * R, Math.sin(a) * R, mr, false, fade)}</g>
            );
          })}

          {/* OUTSIDE IS COLD: one mark, past the ring, in the cold, and it never joins */}
          <circle cx={outDist} cy={0} r={R * 0.5} fill={`url(#ringcold-${seed})`} />
          {figure(
            outDist,
            0,
            mr,
            true,
            interpolate(frame, [30, 44], [0, 1], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
