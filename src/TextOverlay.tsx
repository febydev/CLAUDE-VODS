import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PAL, overlayText } from "./theme";
import type { Shot } from "./types";

// VIRAL REELS CAPTION ENGINE
// - placed at the spec's FIXED reserved-zone coords (position is never chosen by analysis)
// - AUTO-FIT: pre-wrapped to 2-3 short lines, font scaled UP to fill ~88% of the zone width
//   (72-150px @1080p) instead of being clamped small
// - CONTRAST: the zone was measured offline (ffmpeg luma + sobel). Busy/bright zones get a
//   semi-transparent charcoal plate so ivory text always reads. Analysis drives SIZE/PLATE only.
// - entrance: scale 88 -> 106 -> 100% over ~260ms, holds >= 2s
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
  const { width, height } = useVideoConfig();
  const reveal = 15; // ~0.5s after the shot in-point, on the spoken noun
  const local = frame - reveal;
  if (local < 0 || !shot.lines.length || shot.x === null || shot.y === null) return null;

  const scale = interpolate(local, [0, 4, 8], [0.88, 1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- auto-fit: scale up to fill the reserved zone width ----
  const zoneW = shot.maxw * width;
  const longest = Math.max(...shot.lines.map((l) => l.length));
  // Anton is condensed: avg glyph advance ~0.44em
  const byWidth = (zoneW * 0.94) / (longest * 0.44);
  const byHeight = (height * 0.30) / (shot.lines.length * 1.06); // keep inside the caption band
  const size = Math.round(Math.max(72, Math.min(150, byWidth, byHeight)));

  const align = ALIGN[shot.anchor] || "left";
  const padX = Math.round(size * 0.30);
  const padY = Math.round(size * 0.16);

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
          background: shot.plate ? "rgba(20,24,28,0.62)" : "transparent",
          borderRadius: shot.plate ? Math.round(size * 0.16) : 0,
          boxShadow: shot.plate ? "0 8px 26px rgba(0,0,0,0.45)" : "none",
          // firelight-gold accent bar under the last line for a broadcast finish
          borderBottom: i === shot.lines.length - 1 ? `${Math.max(4, Math.round(size * 0.06))}px solid ${PAL.firelight}` : "none",
        }}>{line}</div>
      ))}
    </div>
  );
};
