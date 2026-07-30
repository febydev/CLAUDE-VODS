import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE STRUCK-OUT RANKING — the callback pair in FULL_PACKAGE section 8.
 *
 * "S010 with S070 and S203 (the ranked cruelty column, drawn then struck out twice more)."
 *
 * S010 is where the narration goes looking for "the worst thing ancient humans ever did", S070 is
 * "ranking execution methods misses the point entirely", and S203 is "the pattern is not a ranking of
 * cruelty". So the same idea gets crossed out twice, and the crossing-out has to be the same gesture
 * both times or the rhyme does not land. One heavy charcoal marker stroke, drawn once, held, never
 * animated away. The second strike (S203) comes in at a mirrored angle so it reads as a second pass
 * over the same list rather than a repeat of the first.
 */
export const StrikeOut: React.FC<{ pass?: 1 | 2 }> = ({ pass = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // drawn between frames 18-40, then it simply stays
  const draw = interpolate(frame, [18, 40], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = interpolate(frame, [16, 26], [0, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const y1 = height * (pass === 1 ? 0.34 : 0.66);
  const y2 = height * (pass === 1 ? 0.68 : 0.32);
  const x1 = width * 0.10;
  const x2 = width * 0.90;
  const len = Math.hypot(x2 - x1, y2 - y1);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op, zIndex: 31 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        {/* the marker stroke, with a slight double-hit at the start like a real pen */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={PAL.charcoal}
          strokeWidth={16}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={draw * len}
        />
        <line
          x1={x1 + 14}
          y1={y1 + 10}
          x2={x2 - 20}
          y2={y2 + 6}
          stroke={PAL.charcoal}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.5}
          strokeDasharray={len}
          strokeDashoffset={draw * len}
        />
      </svg>
    </AbsoluteFill>
  );
};
