import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// FULL_PACKAGE section 8 FONT RULE (MANDATORY - DO NOT SUBSTITUTE): a BOLD CONDENSED display face.
// Anton is the named first choice. A thin/default/generic system sans (Arial, Helvetica, Times,
// Calibri, Segoe) is an explicit FAILURE, so the family is loaded from Google Fonts and never falls
// back to a system stack.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// Section 8 palette: cool blue-grey cave stone against warm ochre firelight and dry exteriors, plus
// the spec's fixed overlay and CTA colours.
export const PAL = {
  charcoal: "#241B16", // spec: overlay stroke / plates
  ivory: "#F7E5BC", // spec: overlay fill
  warmRed: "#C6402F", // spec: CTA post-click fill
  paper: "#E8DCC2",
  // The negation flush colour. On the previous package this was a dusty rose museum print; here the
  // register is clinical rather than antique, so a struck claim desaturates toward cold stone instead.
  strike: "#9AA6AC",
  stone: "#8A9AA6",
  ice: "#9FB6C4",
  coldBlue: "#68808F",
  slate: "#3C4750",
  deep: "#28313A",
  nearBlack: "#0A0908",
  ochre: "#C08A45",
  savanna: "#D8A85A",
  firelight: "#E3A14B",
  ember: "#C6642F",
  gold: "#E8C179",
};

// Section 10: ease everything, settle by ~40% of the shot. No linear camera moves anywhere.
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// A charcoal stroke ring built from layered text-shadows. This renders reliably headless, where
// -webkit-text-stroke and paint-order do not.
export const strokeRing = (px: number) =>
  [
    `${-px}px ${-px}px 0 ${PAL.charcoal}`,
    `${px}px ${-px}px 0 ${PAL.charcoal}`,
    `${-px}px ${px}px 0 ${PAL.charcoal}`,
    `${px}px ${px}px 0 ${PAL.charcoal}`,
    `${-px * 1.5}px 0 0 ${PAL.charcoal}`,
    `${px * 1.5}px 0 0 ${PAL.charcoal}`,
    `0 ${-px * 1.5}px 0 ${PAL.charcoal}`,
    `0 ${px * 1.5}px 0 ${PAL.charcoal}`,
    `${-px * 2}px 0 0 ${PAL.charcoal}`,
    `${px * 2}px 0 0 ${PAL.charcoal}`,
    `0 ${-px * 2}px 0 ${PAL.charcoal}`,
    `0 ${px * 2}px 0 ${PAL.charcoal}`,
  ].join(", ");

export const overlayText = {
  fontWeight: 400 as const,
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: -1.5,
  lineHeight: 1.02,
} as const;

/**
 * One grade per arc stage, placed on the actual narration (narration_cn.txt).
 * Every value obeys VIDEO_EDITOR section 6 on the FOOTAGE itself: brightness never below 0.92
 * (-8%, inside the -10% floor), contrast <= +12%, saturation >= 0.80.
 *
 * The register for this package is set by the spec itself: the narrator is "deliberately clinical and
 * restrained throughout" and the thumbnail note asks for "quiet and clinical rather than lurid". So the
 * evidence and ethics stages (METHOD, FLOOR, WRONG, CALORIES, WORD) are cool, desaturated and even -
 * they read as a lab bench, not a horror film. Warmth is spent only where the narration earns it: the
 * firelit cave beats, the mortuary sections where the act is compassion rather than contempt (KURU),
 * and the close, where "a way of keeping the dead inside the living" needs to land warm.
 *
 * Deliberately, nothing here is pushed to a dramatic extreme. Making this subject look lurid would
 * break the guardrail in 7A, which outranks every aesthetic consideration in this package.
 */
export const GRADE: Record<
  string,
  { filter: string; tint: string; op: number; vig: number; bloom: number; shaft: number }
> = {
  LAYER:    { filter: "brightness(0.96) contrast(1.07) saturate(0.84)", tint: PAL.slate,     op: 0.24, vig: 0.40, bloom: 0.08, shaft: 0.10 },
  METHOD:   { filter: "brightness(1.04) contrast(1.05) saturate(0.86)", tint: PAL.stone,     op: 0.12, vig: 0.20, bloom: 0.04, shaft: 0.0 },
  FLOOR:    { filter: "brightness(1.03) contrast(1.04) saturate(0.84)", tint: PAL.paper,     op: 0.10, vig: 0.18, bloom: 0.03, shaft: 0.0 },
  DOLINA:   { filter: "brightness(0.97) contrast(1.08) saturate(0.88)", tint: PAL.coldBlue,  op: 0.22, vig: 0.36, bloom: 0.10, shaft: 0.14 },
  NEAND:    { filter: "brightness(0.95) contrast(1.08) saturate(0.86)", tint: PAL.ice,       op: 0.24, vig: 0.38, bloom: 0.16, shaft: 0.12 },
  WRONG:    { filter: "brightness(1.03) contrast(1.05) saturate(0.82)", tint: PAL.stone,     op: 0.14, vig: 0.22, bloom: 0.04, shaft: 0.0 },
  CALORIES: { filter: "brightness(1.05) contrast(1.06) saturate(0.88)", tint: PAL.paper,     op: 0.10, vig: 0.20, bloom: 0.05, shaft: 0.0 },
  GOUGH:    { filter: "brightness(0.96) contrast(1.08) saturate(0.90)", tint: PAL.firelight, op: 0.20, vig: 0.40, bloom: 0.20, shaft: 0.10 },
  CTAG:     { filter: "brightness(1.05) contrast(1.03) saturate(0.98)", tint: PAL.paper,     op: 0.08, vig: 0.14, bloom: 0.04, shaft: 0.0 },
  HERXHEIM: { filter: "brightness(0.98) contrast(1.07) saturate(0.84)", tint: PAL.slate,     op: 0.22, vig: 0.34, bloom: 0.08, shaft: 0.16 },
  SKULL:    { filter: "brightness(1.00) contrast(1.07) saturate(0.86)", tint: PAL.stone,     op: 0.16, vig: 0.28, bloom: 0.10, shaft: 0.0 },
  COWBOY:   { filter: "brightness(1.02) contrast(1.07) saturate(0.92)", tint: PAL.savanna,   op: 0.18, vig: 0.30, bloom: 0.12, shaft: 0.22 },
  THREE:    { filter: "brightness(1.02) contrast(1.05) saturate(0.86)", tint: PAL.stone,     op: 0.14, vig: 0.24, bloom: 0.06, shaft: 0.0 },
  KURU:     { filter: "brightness(1.02) contrast(1.05) saturate(0.96)", tint: PAL.firelight, op: 0.18, vig: 0.28, bloom: 0.18, shaft: 0.12 },
  WORD:     { filter: "brightness(1.01) contrast(1.06) saturate(0.82)", tint: PAL.coldBlue,  op: 0.18, vig: 0.30, bloom: 0.05, shaft: 0.0 },
  CLOSE:    { filter: "brightness(1.03) contrast(1.05) saturate(0.98)", tint: PAL.firelight, op: 0.18, vig: 0.30, bloom: 0.20, shaft: 0.14 },
};

// Caption accent colour follows the arc so a caption belongs to the section it sits in.
export const ACCENT: Record<string, string> = {
  LAYER: PAL.coldBlue, METHOD: PAL.stone, FLOOR: PAL.stone, DOLINA: PAL.coldBlue,
  NEAND: PAL.ice, WRONG: PAL.stone, CALORIES: PAL.ochre, GOUGH: PAL.firelight,
  CTAG: PAL.ochre, HERXHEIM: PAL.slate, SKULL: PAL.stone, COWBOY: PAL.savanna,
  THREE: PAL.stone, KURU: PAL.firelight, WORD: PAL.coldBlue, CLOSE: PAL.firelight,
};
