import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL, overlayText } from "./theme";
import type { Shot } from "./types";

// VIRAL REELS CAPTION ENGINE
// - position: ONLY the spec's fixed reserved-zone coords (never chosen by analysis)
// - AUTO-FIT: pre-wrapped to 2-3 short lines, font scaled UP to fill the zone (72-150px @1080p)
// - CONTRAST: zone luma + sobel measured offline -> busy/bright zones get a charcoal plate
// - accent bar colour follows the rain arc so the captions belong to the storm's mood
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
const ACCENT: Record<string, string> = {
  BUILDING: PAL.rainBlue, PEAK: PAL.wetStone, SUSTAINED: PAL.rainBlue,
  INTERIOR: PAL.firelight, DEEP: PAL.ochreRed, EASING: PAL.wetGreen,
  AFTER: PAL.wetStone, RESOLVED: PAL.firelight,
};

export const TextOverlay: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const reveal = 15; // ~0.5s after the in-point, on the spoken noun
  const local = frame - reveal;
  if (local < 0 || !shot.lines.length || shot.x === null || shot.y === null) return null;

  // 88 -> 106 -> 100% over ~260ms, then holds (>= 2s)
  const scale = interpolate(local, [0, 4, 8], [0.88, 1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const zoneW = shot.maxw * width;
  const longest = Math.max(...shot.lines.map((l) => l.length));
  const byWidth = (zoneW * 0.94) / (longest * 0.44);   // Anton advance ~0.44em
  const byHeight = (height * 0.30) / (shot.lines.length * 1.06);
  const size = Math.round(Math.max(72, Math.min(150, byWidth, byHeight)));

  const align = ALIGN[shot.anchor] || "left";
  const padX = Math.round(size * 0.30);
  const padY = Math.round(size * 0.16);
  const accent = ACCENT[shot.stage] || PAL.firelight;
  // deep-cave captions sit on a heavier plate so they read against near-black
  const plateAlpha = shot.deep ? 0.72 : 0.62;

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
          background: shot.plate ? `rgba(24,20,17,${plateAlpha})` : "transparent",
          borderRadius: shot.plate ? Math.round(size * 0.16) : 0,
          boxShadow: shot.plate ? "0 8px 26px rgba(0,0,0,0.5)" : "none",
          borderBottom: i === shot.lines.length - 1 ? `${Math.max(4, Math.round(size * 0.06))}px solid ${accent}` : "none",
        }}>{line}</div>
      ))}
    </div>
  );
};
