import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * THE DASHED UNPROVEN BORDER — the video's second motif, drawn in code.
 *
 * FULL_PACKAGE section 8: "Any claim the script refuses to confirm is drawn inside a dashed rather
 * than solid frame. S036, S124, S152, S198, S213. These are never upgraded to solid."
 *
 * Those five are the load-bearing hedges: the Nataruk binding is not clear (S036), the kingship
 * reading is elegant and may be wrong (S124), possibly willing though we cannot know (S152), the
 * peaceful-death-at-Ur reading that later imaging contradicted (S198), and we cannot prove anyone at
 * Nataruk was bound (S213). The frame around the whole picture says "this is not confirmed" without
 * a word, which is also section 12's accessibility rule: never carry meaning by colour alone.
 *
 * It is dashed at every frame, it is NEVER filled and never closes into a solid rule, and the dashes
 * march slowly so it reads as provisional rather than pasted on.
 */
export const DashedBorder: React.FC<{ seed?: number; inset?: number }> = ({ seed = 0, inset = 0.045 }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const x = width * inset;
  const y = height * inset;
  const w = width * (1 - inset * 2);
  const h = height * (1 - inset * 2);
  const per = 2 * (w + h);

  const draw = interpolate(frame, [6, 38], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const march = -(frame * 0.5) % 52;
  const op = interpolate(frame, [4, 20, durationInFrames - 8, durationInFrames], [0, 0.6, 0.6, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op, zIndex: 28 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        {/* the provisional frame. Dashed, never solid, never filled. */}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={10}
          fill="none"
          stroke={PAL.charcoal}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray="30 26"
          strokeDashoffset={draw * per + march}
        />
        {/* a lighter second pass, the way a hand redraws a line it is unsure of */}
        <rect
          x={x - 9}
          y={y - 7}
          width={w + 18}
          height={h + 14}
          rx={14}
          fill="none"
          stroke={PAL.ivory}
          strokeWidth={2.4}
          opacity={0.34}
          strokeDasharray="12 30"
          strokeDashoffset={draw * per - march * 0.7}
        />
        {/* corner brackets: a measurement frame around something that was never measured */}
        {[
          [x, y, 1, 1],
          [x + w, y, -1, 1],
          [x, y + h, 1, -1],
          [x + w, y + h, -1, -1],
        ].map(([px, py, sx, sy], i) => {
          const a = interpolate(frame, [24 + i * 3, 38 + i * 3], [1, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const L = 46;
          return (
            <g key={i} stroke={PAL.charcoal} strokeWidth={6} strokeLinecap="round" opacity={0.9}>
              <line x1={px} y1={py} x2={px + sx * L} y2={py} strokeDasharray={L} strokeDashoffset={a * L} />
              <line x1={px} y1={py} x2={px} y2={py + sy * L} strokeDasharray={L} strokeDashoffset={a * L} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
