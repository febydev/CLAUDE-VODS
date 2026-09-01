import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// §8 FONT (MANDATORY): bold condensed display — Anton. Never a generic system sans.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// §8 palette
export const PAL = {
  charcoal: "#241B16",
  slate: "#4A5560",
  blueGrey: "#7E8E99",
  paleStone: "#C7D0D4",
  ivory: "#F7E5BC",
  ochre: "#D99A4E",
  rust: "#A95735",
  hide: "#8A5A32",
  ember: "#C9662F",
};

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const overlayText = {
  fontWeight: 400 as const,
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  lineHeight: 1.0,
};

// §9 "grade tells the story": trap/biology cool + tight, network beats warm + open,
// the Neanderthal stretch is the coldest and emptiest, so the warm return lands as relief.
export const GRADE: Record<string, { filter: string; tint: string; op: number; vig: number }> = {
  TRAP:    { filter: "brightness(0.96) contrast(1.06) saturate(0.76)", tint: PAL.blueGrey,  op: 0.22, vig: 0.40 },
  BIOLOGY: { filter: "brightness(0.93) contrast(1.09) saturate(0.70)", tint: PAL.slate,     op: 0.26, vig: 0.46 },
  REVEAL:  { filter: "brightness(1.02) contrast(1.06) saturate(0.94)", tint: PAL.paleStone, op: 0.14, vig: 0.28 },
  MACHINE: { filter: "brightness(1.05) contrast(1.04) saturate(1.10)", tint: PAL.ochre,     op: 0.16, vig: 0.22 },
  NEAND:   { filter: "brightness(0.88) contrast(1.10) saturate(0.60)", tint: PAL.slate,     op: 0.30, vig: 0.52 },
  PAYOFF:  { filter: "brightness(1.08) contrast(1.04) saturate(1.12)", tint: PAL.ochre,     op: 0.13, vig: 0.14 },
};

// §8 recurring motif: the closed RING (danger, constrained) vs the open WEB (survival, expansive)
export const ACCENT_FOR: Record<string, string> = {
  TRAP: PAL.rust, BIOLOGY: PAL.rust, REVEAL: PAL.paleStone,
  MACHINE: PAL.ochre, NEAND: PAL.blueGrey, PAYOFF: PAL.ember,
};
