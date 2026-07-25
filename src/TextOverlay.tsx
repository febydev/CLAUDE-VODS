import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL, overlayText } from "./theme";
import type { Shot } from "./types";

// VIRAL REELS CAPTION ENGINE (carried from WINTER, plus a joke rhythm for comedy beats)
// - position: ONLY the spec's fixed reserved-zone coords (never chosen by analysis)
// - AUTO-FIT: pre-wrapped to 2-3 short lines, font scaled UP to fill the zone (72-150px @1080p)
// - CONTRAST: zone luma + sobel measured offline -> busy/bright zones get a charcoal plate
// - comedy beats snap on hard with an overshoot (§9 entertainment pass) and use an ember accent
const ANCHOR_T: Record<string, string> = {
  "top-left": "translate(0%, 0%)",
  "top-right": "translate(-100%, 0%)",
  "bottom-left": "translate(0%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  "top-center": "translate(-50%, 0%)",
  "bottom-center": "translate(-50%, -100%)",
};
const ALIGN: Record<string, "left" | "right" | "center"> = {
  "top-left": "left", "bottom-left": "left",
  "top-right": "right", "bottom-right": "right",
  "top-center": "center", "bottom-center": "center",
};

export const TextOverlay: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const reveal = shot.comedy ? 10 : 15; // comedy lands tighter for the joke rhythm
  const local = frame - reveal;
  if (local < 0 || !shot.lines.length || shot.x === null || shot.y === null) return null;

  // comedy: hard spring snap. standard: 88 -> 106 -> 100% over ~260ms
  const snap = spring({ frame: local, fps, config: { damping: 10, mass: 0.5, stiffness: 210 } });
  const scale = shot.comedy
    ? interpolate(snap, [0, 1], [1.22, 1.0])
    : interpolate(local, [0, 4, 8], [0.88, 1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(local, [0, shot.comedy ? 3 : 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const zoneW = shot.maxw * width;
  const longest = Math.max(...shot.lines.map((l) => l.length));
  const byWidth = (zoneW * 0.94) / (longest * 0.44);   // Anton advance ~0.44em
  const byHeight = (height * 0.30) / (shot.lines.length * 1.06);
  const size = Math.round(Math.max(72, Math.min(150, byWidth, byHeight)));

  const align = ALIGN[shot.anchor] || "left";
  const padX = Math.round(size * 0.30);
  const padY = Math.round(size * 0.16);
  const accent = shot.emberAccent ? PAL.ember : PAL.ochre;

  return (
    <div style={{
      position: "absolute",
      left: shot.x * width, top: shot.y * height,
      transform: `${ANCHOR_T[shot.anchor] || "translate(0%,0%)"} scale(${scale})`,
      transformOrigin: shot.anchor.includes("right") ? "right" : shot.anchor.includes("center") ? "center" : "left",
      maxWidth: zoneW, opacity: op, zIndex: 42,
      display: "flex", flexDirection: "column",
      alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      gap: Math.round(size * 0.06),
    }}>
      {shot.lines.map((line, i) => (
        <div key={i} style={{
          ...overlayText,
          fontSize: size, textAlign: align, whiteSpace: "nowrap",
          padding: shot.plate ? `${padY}px ${padX}px` : 0,
          background: shot.plate ? "rgba(28,21,16,0.64)" : "transparent",
          borderRadius: shot.plate ? Math.round(size * 0.16) : 0,
          boxShadow: shot.plate ? "0 8px 26px rgba(0,0,0,0.45)" : "none",
          borderBottom: i === shot.lines.length - 1 ? `${Math.max(4, Math.round(size * 0.06))}px solid ${accent}` : "none",
        }}>{line}</div>
      ))}
    </div>
  );
};
