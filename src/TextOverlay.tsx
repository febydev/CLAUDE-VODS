import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, PAL, overlayText } from "./theme";
import type { Shot } from "./types";

/**
 * VIRAL REELS CAPTION ENGINE
 *
 * The LANGUAGE render's single fault was overlay text that was too small and did not fit.
 * Root cause in code: line count was picked from word count alone, so a wide three-word label
 * stayed on ONE line and the font had to shrink to ~55px to fit a narrow 0.36 corner zone.
 *
 * What changed:
 *  - PLACEMENT is still ONLY the spec's fixed reserved-zone coordinates. Never chosen by
 *    analysis, never relocated. (No relocation was needed on this video - see the report.)
 *  - SIZE is auto-fitted at build time (build_data_god.py): every legal wrap of 1-3 lines at
 *    <= 3 words per line is costed by the font size it permits, and the largest wins. Result on
 *    this video is 101-140px, average 126px, versus 52-66px before.
 *  - The vertical budget per shot is MEASURED (analyze_zones.py): sobel strips walk outward from
 *    the anchored edge, judged against each image's own edge baseline, so a huge caption can
 *    never overflow the empty band the generator reserved and sit on the artwork.
 *  - CONTRAST is measured too. 112 of 115 zones are bright, busy or high-range line art, where
 *    ivory alone would fail, so every caption carries a rounded charcoal plate whose alpha comes
 *    from the measurement (0.55 calm/dark -> 0.82 worst case).
 *
 * Kept from the spec: uppercase, ivory #F7E5BC fill, ~8px charcoal #241B16 stroke, entrance on
 * the spoken noun, hold >= 2.0s (verified for all 115 captions at build time).
 */
const ANCHOR_T: Record<string, string> = {
  "top-left": "translate(0%, 0%)",
  "top-right": "translate(-100%, 0%)",
  "bottom-left": "translate(0%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  "top-center": "translate(-50%, 0%)",
  "bottom-center": "translate(-50%, -100%)",
};
const ALIGN: Record<string, "left" | "right" | "center"> = {
  "top-left": "left",
  "bottom-left": "left",
  "top-right": "right",
  "bottom-right": "right",
  "top-center": "center",
  "bottom-center": "center",
};

export const TextOverlay: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  if (!shot.lines.length || shot.x === null || shot.y === null) return null;

  // The cut already lands on the trigger word (spec section 10), so the label writes on a beat
  // later - on the spoken noun itself - and then holds.
  const local = frame - shot.revealFrame;
  if (local < 0) return null;

  // punch in with a little overshoot: 88 -> 106 -> 100% over ~260ms
  const scale = interpolate(local, [0, 4, 8], [0.88, 1.06, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = interpolate(local, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(local, [0, 8], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const align = ALIGN[shot.anchor] || "left";
  const size = shot.fontSize;
  const padX = Math.round(size * 0.26);
  const padY = Math.round(size * 0.1);
  const accent = ACCENT[shot.stage] || PAL.ochre;

  // the accent rule draws itself outward after the words land
  const ruleGrow = spring({ frame: local - 7, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        left: shot.x * width,
        top: shot.y * height,
        transform: `${ANCHOR_T[shot.anchor] || "translate(0%,0%)"} translateY(${rise}px) scale(${scale})`,
        transformOrigin: shot.anchor.includes("right")
          ? "right center"
          : shot.anchor.includes("center")
            ? "center"
            : "left center",
        maxWidth: shot.maxw * width,
        opacity: op,
        zIndex: 42,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: Math.round(size * 0.07),
        pointerEvents: "none",
      }}
    >
      {shot.lines.map((line, i) => (
        <div
          key={i}
          style={{
            ...overlayText,
            fontSize: size,
            textAlign: align,
            whiteSpace: "nowrap",
            padding: `${padY}px ${padX}px`,
            background: `rgba(30, 23, 19, ${shot.plateAlpha})`,
            borderRadius: Math.round(size * 0.14),
            boxShadow: "0 10px 30px rgba(0,0,0,0.42)",
          }}
        >
          {line}
        </div>
      ))}
      <div
        style={{
          height: Math.max(5, Math.round(size * 0.075)),
          width: `${Math.round(ruleGrow * 100)}%`,
          minWidth: 8,
          background: accent,
          borderRadius: 999,
          marginTop: Math.round(size * 0.04),
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
};
