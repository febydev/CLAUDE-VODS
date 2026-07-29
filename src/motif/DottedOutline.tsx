import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE EMPTY OUTLINE — the video's second motif, drawn in code.
 *
 * FULL_PACKAGE section 8: "a dotted empty outline means the thing we cannot verify. The dotted
 * empty outline appears at S011, S021, S109, S161, S206 and must never be filled in."
 *
 * Those five shots are all hedges: belief leaves no bones (S011), a mind reaching for something
 * (S021), a presence with no body (S109), hypotheses not findings (S161), still not proof (S206).
 * So the outline is the shape of a claim with nothing inside it. It draws itself, the dashes march
 * slowly forever, and the interior is left literally empty - no fill is ever applied, at any
 * frame, which is the hard part of the invariant.
 *
 * Same ink language as the eye: charcoal, even weight, no blur.
 */
export const DottedOutline: React.FC<{ seed?: number; span?: number; cy?: number }> = ({
  seed = 0,
  span = 0.34,
  cy = 0.47,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const w = span * width;
  const h = w * 1.24;
  const cx = width / 2;
  const y = height * cy;

  // draw on, then hold; the dashes keep marching so it is never fully static
  const draw = interpolate(frame, [8, 40], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const march = -(frame * 0.55) % 44;
  const op = interpolate(frame, [6, 24, durationInFrames - 8, durationInFrames], [0, 0.5, 0.5, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // a slow breath so the absence feels alive rather than pasted on
  const breathe = 1 + Math.sin(frame / 46 + seed) * 0.012;

  const per = 2 * Math.PI * Math.sqrt((w * w / 4 + h * h / 4) / 2); // ellipse perimeter approx

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op, zIndex: 29 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cx} ${y}) scale(${breathe})`}>
          {/* the claim: an empty human-sized silhouette. NEVER filled. */}
          <ellipse
            cx={0}
            cy={0}
            rx={w / 2}
            ry={h / 2}
            fill="none"
            stroke={PAL.charcoal}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="22 22"
            strokeDashoffset={draw * per + march}
          />
          {/* a second, looser pass - the way a hand redraws an uncertain line */}
          <ellipse
            cx={0}
            cy={-2}
            rx={w / 2 + 9}
            ry={h / 2 + 7}
            fill="none"
            stroke={PAL.charcoal}
            strokeWidth={2.4}
            opacity={0.5}
            strokeDasharray="9 26"
            strokeDashoffset={draw * per - march * 0.6}
          />
          {/* corner ticks: a measurement bracket around something that was never measured */}
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy], i) => {
            const a = interpolate(frame, [26 + i * 3, 40 + i * 3], [1, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const px = (sx * (w / 2 + 34)) | 0;
            const py = (sy * (h / 2 + 26)) | 0;
            const L = 30;
            return (
              <g key={i} stroke={PAL.charcoal} strokeWidth={4.5} strokeLinecap="round" opacity={0.85}>
                <line x1={px} y1={py} x2={px - sx * L} y2={py} strokeDasharray={L} strokeDashoffset={a * L} />
                <line x1={px} y1={py} x2={px} y2={py - sy * L} strokeDasharray={L} strokeDashoffset={a * L} />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
