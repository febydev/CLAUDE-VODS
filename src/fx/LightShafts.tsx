import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * VOLUMETRIC LIGHT — the atmosphere v1 was missing.
 *
 * v1 had dust and a vignette, so 210 shots all sat in the same flat air and the picture read as a
 * slideshow with a camera move on it. Light is what gives a still depth: a shaft implies a source
 * outside the frame, an interior, a time of day. VIDEO_EDITOR 7.2 pairs dust with light beams for
 * exactly this reason.
 *
 * Driven by the stage's `shaft` value in theme.ts, so it is part of the emotional dial: strongest
 * at MONUMENT (Gobekli Tepe raised in daylight), soft and cold through GRIEF, absent in the DEEP
 * cave stretch where the only light anyone had was carried in by hand.
 */
export const LightShafts: React.FC<{ strength: number; seed?: number; warm?: boolean }> = ({
  strength,
  seed = 0,
  warm = true,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (strength <= 0.001) return null;
  const colour = warm ? PAL.firelight : PAL.paper;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen", zIndex: 24 }}>
      {[0, 1, 2].map((i) => {
        const s = seed * 7 + i * 3;
        const drift = Math.sin((frame + s * 21) / (170 + i * 40)) * width * 0.018;
        const breathe = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin((frame + s * 33) / (96 + i * 27)));
        const left = [-6, 26, 62][i] + i * 2;
        const w = [30, 20, 26][i];
        const tilt = [-16, -12, -19][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-28%",
              bottom: "-28%",
              left: `${left}%`,
              width: `${w}%`,
              transform: `translateX(${drift}px) skewX(${tilt}deg)`,
              background: `linear-gradient(90deg, transparent, ${colour}2b, ${colour}12, transparent)`,
              opacity: strength * breathe,
              filter: "blur(18px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
