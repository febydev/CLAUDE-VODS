import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// FULL_PACKAGE section 8 FONT RULE (MANDATORY - DO NOT SUBSTITUTE): a BOLD CONDENSED display face.
// Anton is the named first choice. A thin/default/generic system sans (Arial, Helvetica, Times,
// Calibri, Segoe) is an explicit FAILURE, so the family is loaded from Google Fonts and never falls
// back to a system stack.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// Section 8 palette: cool blue-grey stone and ice against warm ochre savanna and steppe, plus the
// spec's fixed overlay and CTA colours.
export const PAL = {
  charcoal: "#241B16", // spec: overlay stroke / plates
  ivory: "#F7E5BC", // spec: overlay fill
  warmRed: "#C6402F", // spec: CTA post-click fill
  paper: "#E8DCC2",
  stone: "#8A9AA6",
  ice: "#9FB6C4",
  coldBlue: "#68808F",
  slate: "#3C4750",
  deep: "#28313A",
  jungle: "#5E6B45",
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
 * One grade per arc stage, placed on what the narration is actually doing (narration_sp.txt).
 * Every value obeys VIDEO_EDITOR section 6 on the FOOTAGE itself: brightness never below 0.92
 * (-8%, inside the -10% floor), contrast <= +12%, saturation >= 0.80. Depth comes from TINT,
 * VIGNETTE and LIGHT, never from crushing the image.
 *
 * The argument this video makes is about variety collapsing to one, so the light has to track that:
 * ERECTUS is warm open savanna, NEAND is cold ice cut with firelight, ISLAND is humid green,
 * STOCKTAKE (the world of five kinds of human, all present at once) is the widest and brightest thing
 * in the video, and ALONE / LAST - the same shot of one figure in a wide landscape at the top and the
 * bottom - are the coldest and emptiest, so the callback lands as loss rather than as triumph.
 */
export const GRADE: Record<
  string,
  { filter: string; tint: string; op: number; vig: number; bloom: number; shaft: number }
> = {
  ALONE:      { filter: "brightness(0.94) contrast(1.08) saturate(0.82)", tint: PAL.coldBlue, op: 0.26, vig: 0.46, bloom: 0.06, shaft: 0.0 },
  CAVEATS:    { filter: "brightness(1.03) contrast(1.04) saturate(0.90)", tint: PAL.stone,    op: 0.11, vig: 0.20, bloom: 0.03, shaft: 0.0 },
  ERECTUS:    { filter: "brightness(1.05) contrast(1.05) saturate(1.06)", tint: PAL.ochre,    op: 0.20, vig: 0.26, bloom: 0.18, shaft: 0.24 },
  MESSY:      { filter: "brightness(1.01) contrast(1.07) saturate(0.88)", tint: PAL.stone,    op: 0.16, vig: 0.28, bloom: 0.05, shaft: 0.0 },
  BUSH:       { filter: "brightness(1.04) contrast(1.05) saturate(0.92)", tint: PAL.paper,    op: 0.09, vig: 0.18, bloom: 0.04, shaft: 0.0 },
  NEAND:      { filter: "brightness(0.96) contrast(1.08) saturate(0.94)", tint: PAL.ice,      op: 0.22, vig: 0.36, bloom: 0.20, shaft: 0.16 },
  CONTACT:    { filter: "brightness(0.94) contrast(1.10) saturate(0.84)", tint: PAL.ice,      op: 0.27, vig: 0.44, bloom: 0.10, shaft: 0.12 },
  CTAG:       { filter: "brightness(1.05) contrast(1.03) saturate(0.98)", tint: PAL.paper,    op: 0.08, vig: 0.14, bloom: 0.04, shaft: 0.0 },
  DENIS:      { filter: "brightness(0.93) contrast(1.11) saturate(0.84)", tint: PAL.deep,     op: 0.30, vig: 0.52, bloom: 0.08, shaft: 0.0 },
  ISLAND:     { filter: "brightness(1.04) contrast(1.06) saturate(1.08)", tint: PAL.jungle,   op: 0.22, vig: 0.30, bloom: 0.14, shaft: 0.22 },
  GROWING:    { filter: "brightness(1.02) contrast(1.06) saturate(0.90)", tint: PAL.stone,    op: 0.14, vig: 0.26, bloom: 0.05, shaft: 0.10 },
  STOCKTAKE:  { filter: "brightness(1.07) contrast(1.05) saturate(1.06)", tint: PAL.ochre,    op: 0.16, vig: 0.20, bloom: 0.16, shaft: 0.26 },
  WHYUS:      { filter: "brightness(1.02) contrast(1.07) saturate(0.88)", tint: PAL.coldBlue, op: 0.16, vig: 0.28, bloom: 0.06, shaft: 0.0 },
  COMPOSITE:  { filter: "brightness(1.04) contrast(1.05) saturate(1.02)", tint: PAL.firelight, op: 0.18, vig: 0.28, bloom: 0.18, shaft: 0.14 },
  LAST:       { filter: "brightness(0.96) contrast(1.08) saturate(0.86)", tint: PAL.coldBlue, op: 0.24, vig: 0.44, bloom: 0.12, shaft: 0.0 },
};

// Caption accent colour follows the arc so a caption belongs to the section it sits in.
export const ACCENT: Record<string, string> = {
  ALONE: PAL.coldBlue,
  CAVEATS: PAL.stone,
  ERECTUS: PAL.ochre,
  MESSY: PAL.stone,
  BUSH: PAL.ochre,
  NEAND: PAL.firelight,
  CONTACT: PAL.ice,
  CTAG: PAL.ochre,
  DENIS: PAL.stone,
  ISLAND: PAL.jungle,
  GROWING: PAL.stone,
  STOCKTAKE: PAL.ochre,
  WHYUS: PAL.coldBlue,
  COMPOSITE: PAL.firelight,
  LAST: PAL.coldBlue,
};
