import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * ECHO RINGS — an authorized adaptive item in FULL_PACKAGE 7A ("echo-ring and eye-blink
 * animation"), and the code half of section 8's ring callback pair: S127 / S129 (the stalagmite
 * rings built 336 m inside Bruniquel) must rhyme with S202 (the same rings at the climax), and
 * the wheel shots S005 / S134 / S188 are the same shape seen from above.
 *
 * Rings expand outward from the centre of the ring in the artwork and fade as they go, so the
 * still reads as something that is still radiating. Slow, low-contrast, never a radar pulse:
 * the map rule from the SKILLS files bans pulse gimmicks, so this is used only where the
 * artwork itself is literally a ring or a wheel.
 */
export const EchoRings: React.FC<{
  count?: number;
  strength?: number;
  cy?: number;
  warm?: boolean;
}> = ({ count = 4, strength = 1, cy = 0.5, warm = true }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const colour = warm ? PAL.firelight : PAL.stone;
  const period = 108;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 26, mixBlendMode: "screen" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: count }).map((_, i) => {
          const t = ((frame + (i * period) / count) % period) / period;
          const r = interpolate(t, [0, 1], [width * 0.06, width * 0.44]);
          const op = interpolate(t, [0, 0.18, 0.75, 1], [0, 0.20, 0.06, 0]) * strength;
          return (
            <ellipse
              key={i}
              cx={width / 2}
              cy={height * cy}
              rx={r}
              ry={r * 0.62}
              fill="none"
              stroke={colour}
              strokeWidth={interpolate(t, [0, 1], [4.5, 1.4])}
              opacity={op}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
