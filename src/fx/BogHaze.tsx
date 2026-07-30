import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

/**
 * BOG HAZE — the atmosphere for the peat sequence (S099-S156).
 *
 * The bog stretch is a third of the video and it has to feel different in the AIR, not just in the
 * grade, or thirty-odd shots of wetland read the same as thirty shots of anything else. Section 11
 * asks for a mix that is "deliberately wet, muffled and low" here; this is the picture half of that.
 *
 * Cold ground mist that sits low and drifts sideways, plus a faint wet sheen across the top of the
 * frame. No falling particles: dust reads dry and this place is the opposite of dry. On the tender
 * shots (the calm face, returned to four times) the haze thins so the face stays clear - grief with
 * fog over it is just fog.
 */
export const BogHaze: React.FC<{ strength?: number; seed?: number; tender?: boolean }> = ({
  strength = 1,
  seed = 0,
  tender = false,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const s = strength * (tender ? 0.45 : 1);
  if (s <= 0.01) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", zIndex: 23 }}>
      {/* low ground mist: three slabs drifting at different rates */}
      {[0, 1, 2].map((i) => {
        const k = seed * 5 + i * 11;
        const drift = Math.sin((frame + k * 31) / (210 + i * 70)) * width * 0.05;
        const rise = Math.cos((frame + k * 17) / (170 + i * 50)) * 12;
        const breathe = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin((frame + k * 23) / (120 + i * 40)));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "-12%",
              right: "-12%",
              bottom: `${[-6, 2, 12][i]}%`,
              height: `${[34, 26, 20][i]}%`,
              transform: `translate(${drift}px, ${rise}px)`,
              background: `linear-gradient(0deg, ${PAL.stone}2e, ${PAL.stone}14 55%, transparent)`,
              opacity: s * breathe * 0.7,
              filter: "blur(26px)",
            }}
          />
        );
      })}
      {/* wet sheen across the upper frame: peat water catching a flat northern sky */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${PAL.coldBlue}22, transparent 42%)`,
          mixBlendMode: "screen",
          opacity: s * 0.7,
        }}
      />
    </AbsoluteFill>
  );
};
