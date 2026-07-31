import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * ICE MIST — the air for the cold stages (NEAND, CONTACT, DENIS, ALONE, LAST).
 *
 * Section 8's world is "cool blue-grey stone and ice against warm ochre savanna and steppe", and this
 * video spends a third of its length in the last ice age, on a continent that "lurched, warm to cold
 * and back again, sometimes inside a single lifetime". That has to be felt in the air and not only in
 * the grade, or forty shots of ice-age Europe look like forty shots of anything else.
 *
 * Thin drifting cold mist that sits low and slides sideways, plus a pale sheen across the top of the
 * frame. It deliberately does NOT fall like dust or rise like embers - it moves horizontally, which is
 * what reads as wind over open ground rather than weather in a room.
 */
export const IceMist: React.FC<{ strength?: number; seed?: number }> = ({ strength = 1, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (strength <= 0.01) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", zIndex: 23 }}>
      {[0, 1, 2].map((i) => {
        const k = seed * 7 + i * 13;
        // a long slow lateral crawl, each band at its own rate
        const drift = ((frame * (0.22 + i * 0.16) + k * 40) % (width * 1.5)) - width * 0.25;
        const bob = Math.sin((frame + k * 19) / (150 + i * 55)) * 14;
        const breathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((frame + k * 27) / (130 + i * 45)));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              width: "150%",
              bottom: `${[-4, 6, 18][i]}%`,
              height: `${[30, 22, 16][i]}%`,
              transform: `translate(${drift - width * 0.25}px, ${bob}px)`,
              background: `linear-gradient(90deg, transparent, ${PAL.ice}22 30%, ${PAL.ice}2c 55%, transparent)`,
              opacity: strength * breathe * 0.8,
              filter: "blur(30px)",
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${PAL.ice}1e, transparent 38%)`,
          mixBlendMode: "screen",
          opacity: strength * 0.7,
        }}
      />
    </AbsoluteFill>
  );
};
