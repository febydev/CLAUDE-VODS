import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// §8 FONT (MANDATORY): bold condensed display face — Anton.
// NEVER a generic system sans (Arial/Helvetica/Times/Calibri/Segoe) — that is a stated FAILURE.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// §8 palette
export const PAL = {
  charcoal: "#241B16",
  ivory: "#F7E5BC",
  ochre: "#D99A4E",
  rust: "#A95735",
  leaf: "#71804A",
  stone: "#64766B",
  ember: "#C9662F",
};

// §9A: ease everything
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
// comedic snap for PUNCH-SETTLE (overshoot then settle)
export const PUNCH = Easing.bezier(0.34, 1.56, 0.64, 1);

export const overlayText = {
  color: PAL.ivory,
  textShadow:
    "-3px -3px 0 #241B16, 3px -3px 0 #241B16, -3px 3px 0 #241B16, 3px 3px 0 #241B16, -4px 0 0 #241B16, 4px 0 0 #241B16, 0 -4px 0 #241B16, 0 4px 0 #241B16, 0 6px 16px rgba(0,0,0,0.65)",
  fontWeight: 400 as const,
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: -1,
  lineHeight: 1.0,
};

// grade: ancient = warm earth; modern-contrast = cooler, flatter, deliberately duller so the
// ancient world feels richer and the comparison lands as a joke (§8 modern-contrast note)
export const GRADE = {
  ANCIENT: { filter: "brightness(1.04) contrast(1.05) saturate(1.10)", tint: PAL.ochre, op: 0.12 },
  MODERN:  { filter: "brightness(1.05) contrast(1.02) saturate(0.80)", tint: PAL.stone, op: 0.14 },
};
