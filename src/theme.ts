import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// §8 FONT (MANDATORY): bold condensed display face — Anton.
// NEVER a generic system sans (Arial/Helvetica/Times/Calibri/Segoe) — a generic font is a FAILURE.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// §8 palette
export const PAL = {
  charcoal: "#241B16",
  storm: "#3E4A52",
  wetGreen: "#6E7F72",
  rainBlue: "#7E94A3",
  wetStone: "#C7D0D4",
  ivory: "#F7E5BC",
  ember: "#C9662F",
  firelight: "#E3A14B",
  ochreRed: "#A6432B",
};

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const overlayText = {
  color: PAL.ivory,
  textShadow:
    "-3px -3px 0 #241B16, 3px -3px 0 #241B16, -3px 3px 0 #241B16, 3px 3px 0 #241B16, -4px 0 0 #241B16, 4px 0 0 #241B16, 0 -4px 0 #241B16, 0 4px 0 #241B16, 0 6px 16px rgba(0,0,0,0.7)",
  fontWeight: 400 as const,
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: -1,
  lineHeight: 1.0,
};

// §9 "light is the emotional dial" — one grade per rain stage.
// Exteriors cold/desaturated/flat -> interiors warm amber -> DEEP is the darkest in the video,
// so the return of daylight at S083 (BRIGHT) lands as genuine relief.
export const GRADE: Record<string, { filter: string; tint: string; op: number; vig: number }> = {
  COLD:   { filter: "brightness(0.98) contrast(1.04) saturate(0.74)", tint: PAL.rainBlue,  op: 0.20, vig: 0.30 },
  STORM:  { filter: "brightness(0.90) contrast(1.10) saturate(0.66)", tint: PAL.storm,     op: 0.28, vig: 0.42 },
  WARM:   { filter: "brightness(1.05) contrast(1.05) saturate(1.10)", tint: PAL.firelight, op: 0.16, vig: 0.26 },
  DEEP:   { filter: "brightness(0.80) contrast(1.16) saturate(0.90)", tint: "#1a1410",     op: 0.30, vig: 0.55 },
  EASE:   { filter: "brightness(1.02) contrast(1.03) saturate(0.86)", tint: PAL.wetGreen,  op: 0.14, vig: 0.22 },
  BRIGHT: { filter: "brightness(1.10) contrast(1.05) saturate(1.10)", tint: PAL.wetStone,  op: 0.10, vig: 0.12 },
  CALM:   { filter: "brightness(1.07) contrast(1.03) saturate(1.06)", tint: PAL.firelight, op: 0.12, vig: 0.16 },
};
