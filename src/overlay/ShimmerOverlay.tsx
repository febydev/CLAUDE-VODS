import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL } from "../theme";

// VIDEO_EDITOR section 7.4: a light sweep, MAXIMUM 4 uses in the entire video.
// Placed here on the eye motif's four beats: S004 (the eye arrives), S188 (wheels of fire -
// the opening image returns), S202 (the stone rings climax), S210 (the final line).
// Gradient left to right over ~1.5s, white at ~20% opacity with transparent edges.
export const ShimmerOverlay: React.FC<{ delay?: number }> = ({ delay = 12 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dur = 45; // 1.5s at 30fps
  const local = frame - delay;
  if (local < 0 || local > dur || delay + dur > durationInFrames + 30) return null;
  const p = interpolate(local, [0, dur], [-40, 140], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(local, [0, 6, dur - 10, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "-12%",
          bottom: "-12%",
          left: `${p}%`,
          width: "30%",
          transform: "skewX(-16deg)",
          opacity: fade,
          background: `linear-gradient(90deg, transparent, ${PAL.ivory}33, ${PAL.ivory}0f, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
