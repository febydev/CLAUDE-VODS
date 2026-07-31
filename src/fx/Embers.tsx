import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * EMBERS — warm rising sparks for the firelight shots.
 *
 * Section 8's world is "cool blue-grey stone cave interiors against warm ochre exteriors", and the
 * whole deep-cave stretch only exists because somebody carried fire 336 metres underground. Dust
 * drifts down and reads cold; embers rise and read warm, which is what separates the CAVE and DEEP
 * stages from the GRIEF stage in the air itself rather than only in the grade.
 *
 * Deterministic placement (seeded sine hash) so a shot renders identically on whichever of the 8
 * parallel chunk runners happens to own it.
 */
const rnd = (n: number) => {
  const x = Math.sin(n * 91.3 + 47.1) * 24634.6345;
  return x - Math.floor(x);
};

export const Embers: React.FC<{ count?: number; intensity?: number; seed?: number }> = ({
  count = 30,
  intensity = 1,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 25 }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = seed * 61 + i;
        const size = 2.2 + rnd(s) * 4.6;
        const speed = 0.5 + rnd(s + 1) * 1.15;
        const x0 = rnd(s + 2) * width;
        const swayAmp = 12 + rnd(s + 3) * 34;
        const life = height + 240;
        const y = height + 90 - ((frame * speed + rnd(s + 4) * life) % life);
        const x = x0 + Math.sin((frame + i * 13) / 44) * swayAmp;
        // brighter as it rises, then burns out near the top
        const climb = 1 - y / height;
        const flick = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin((frame + i * 23) / 9));
        const op = Math.max(0, Math.min(1, climb * 1.5)) * (1 - Math.max(0, climb - 0.75) * 3.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: rnd(s + 5) > 0.6 ? PAL.gold : PAL.ember,
              opacity: 0.42 * intensity * op * flick,
              boxShadow: `0 0 ${size * 3.4}px ${PAL.ember}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
