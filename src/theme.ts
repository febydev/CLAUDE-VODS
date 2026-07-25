import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// §8 FONT (MANDATORY): bold condensed display face. Anton.
// NEVER a generic system sans (Arial/Helvetica/Times/Calibri/Segoe) — that is a stated FAILURE.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// §8 winter palette
export const PAL = {
  charcoal: "#241B16",
  night: "#14181C",
  ivory: "#F7E5BC",
  snow: "#D8E2E8",
  coldBlue: "#7E94A3",
  slate: "#4C5A63",
  ember: "#C9662F",
  firelight: "#E3A14B",
};

// §9A: ease everything
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// caption text style: uppercase, tight tracking, ivory fill, heavy charcoal stroke
export const overlayText = {
  color: PAL.ivory,
  textShadow:
    "-3px -3px 0 #241B16, 3px -3px 0 #241B16, -3px 3px 0 #241B16, 3px 3px 0 #241B16, -4px 0 0 #241B16, 4px 0 0 #241B16, 0 -4px 0 #241B16, 0 4px 0 #241B16, 0 6px 16px rgba(0,0,0,0.65)",
  fontWeight: 400 as const,   // Anton is a single heavy weight
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: -1,          // tight tracking per §8
  lineHeight: 1.0,
};

// §9 grade: exteriors cold + desaturated, interiors warm amber by firelight
export const GRADE = {
  EXT: { filter: "brightness(1.02) contrast(1.06) saturate(0.82)", tint: PAL.coldBlue, op: 0.16 },
  INT: { filter: "brightness(1.05) contrast(1.04) saturate(1.08)", tint: PAL.firelight, op: 0.13 },
};
