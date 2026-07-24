import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { overlayText } from "./theme";

// Deterministic overlay: placed ONLY at the given normalized coords (the clean zone reserved
// at generation). No image analysis. Uppercase ivory + charcoal stroke, scale 88->106->100%
// over ~260ms, write-on after the spoken noun (~0.5s pre-roll), hold >= 2s.
const anchorTransform: Record<string, string> = {
  "top-left": "translate(0%, 0%)",
  "top-right": "translate(-100%, 0%)",
  "bottom-left": "translate(0%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  "top-center": "translate(-50%, 0%)",
  "bottom-center": "translate(-50%, -100%)",
};
const textAlignFor: Record<string, "left" | "right" | "center"> = {
  "top-left": "left", "bottom-left": "left",
  "top-right": "right", "bottom-right": "right",
  "top-center": "center", "bottom-center": "center",
};

export const TextOverlay: React.FC<{ text: string; x: number; y: number; anchor: string; maxw: number }> = ({ text, x, y, anchor, maxw }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const reveal = 15; // ~0.5s after the shot's trigger in-point (spoken-noun sync, within pre-roll)
  const local = frame - reveal;
  if (local < 0) return null;

  // 88 -> 106 -> 100 over 260ms (~8 frames)
  const scale = interpolate(local, [0, 4, 8], [0.88, 1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const maxWpx = maxw * width;
  // fit font: >=52px @1080p per spec, shrink for long strings to respect max_width
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), text.length / 2);
  const size = Math.max(52, Math.min(66, Math.floor(maxWpx / (longest * 0.62))));

  return (
    <div style={{
      position: "absolute",
      left: x * width, top: y * height,
      transform: `${anchorTransform[anchor] || "translate(0%,0%)"} scale(${scale})`,
      transformOrigin: anchor.includes("right") ? "right" : anchor.includes("center") ? "center" : "left",
      maxWidth: maxWpx, textAlign: textAlignFor[anchor] || "left",
      opacity: op, fontSize: size, ...overlayText, zIndex: 40,
    }}>{text}</div>
  );
};
