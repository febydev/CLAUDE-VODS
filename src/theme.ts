import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// §8 FONT (MANDATORY): bold condensed display face. Anton — heavy, condensed, slightly
// irregular display. NEVER a generic system sans (Arial/Helvetica/etc = a failure).
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// §8 palette
export const PAL = {
  charcoal: "#241B16",
  caveBlack: "#17130F",
  ivory: "#F7E5BC",
  ochre: "#D99A4E",
  rust: "#A95735",
  leaf: "#71804A",
  stone: "#64766B",
  water: "#6F9A9A",
};

// §9A "ease everything"
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// overlay text style: uppercase, tight tracking, ivory fill, 8px charcoal stroke (layered shadow)
export const overlayText = {
  color: PAL.ivory,
  textShadow:
    "-3px -3px 0 #241B16, 3px -3px 0 #241B16, -3px 3px 0 #241B16, 3px 3px 0 #241B16, 0 0 3px #241B16, 0 5px 12px rgba(23,19,15,0.6)",
  fontWeight: 400 as const, // Anton is a single heavy weight
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: -0.5,      // tight tracking per §8
  lineHeight: 1.02,
};
