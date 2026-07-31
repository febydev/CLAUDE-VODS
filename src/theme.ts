import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// FULL_PACKAGE section 8 FONT RULE (MANDATORY - DO NOT SUBSTITUTE): a BOLD CONDENSED display face.
// Anton is the named first choice. A thin/default/generic system sans (Arial, Helvetica, Times,
// Calibri, Segoe) is an explicit FAILURE, so the family is loaded from Google Fonts and never falls
// back to a system stack.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// Section 8 palette: warm ochre steppe and savanna against cool blue-grey stone and ice, plus the
// dusty rose of the faded myth cards and the spec's fixed overlay and CTA colours.
export const PAL = {
  charcoal: "#241B16",
  ivory: "#F7E5BC",
  warmRed: "#C6402F",
  paper: "#E8DCC2",
  dustyRose: "#C9A6A0", // the faded century-old museum print
  stone: "#8A9AA6",
  ice: "#9FB6C4",
  coldBlue: "#68808F",
  slate: "#3C4750",
  jungle: "#5E6B45",
  nearBlack: "#0A0908",
  ochre: "#C08A45",
  savanna: "#D8A85A",
  firelight: "#E3A14B",
  ember: "#C6642F",
  gold: "#E8C179",
};

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// A charcoal stroke ring from layered text-shadows. Renders reliably headless, where
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
 * One grade per myth chapter. Section 8 is explicit that "this package is deliberately the brightest
 * and most confident-looking in the series, because the whole point is that these people were
 * capable" - so nothing here is allowed to go gloomy the way the bog stretch did on PUNISHMENTS or the
 * Denisovan stretch did on SPECIES. Every value obeys VIDEO_EDITOR section 6: brightness never below
 * 0.94 here (-6%, comfortably inside the -10% floor), contrast <= +12%, saturation >= 0.82.
 *
 * The only chapter deliberately drained is FARMING, because that is the one place in the video where
 * the story is that things got WORSE - shorter skeletons, worse teeth, more disease. Dropping its
 * saturation makes the argument without a word, and the warm confident CLOSE right after it lands as a
 * recovery.
 */
export const GRADE: Record<
  string,
  { filter: string; tint: string; op: number; vig: number; bloom: number; shaft: number }
> = {
  OPENING:  { filter: "brightness(1.03) contrast(1.06) saturate(0.92)", tint: PAL.stone,     op: 0.12, vig: 0.22, bloom: 0.05, shaft: 0.0 },
  CAVES:    { filter: "brightness(0.98) contrast(1.08) saturate(0.88)", tint: PAL.slate,     op: 0.20, vig: 0.34, bloom: 0.08, shaft: 0.14 },
  AGE30:    { filter: "brightness(1.04) contrast(1.05) saturate(1.02)", tint: PAL.firelight, op: 0.18, vig: 0.26, bloom: 0.18, shaft: 0.16 },
  LADDER:   { filter: "brightness(1.05) contrast(1.04) saturate(0.90)", tint: PAL.paper,     op: 0.09, vig: 0.18, bloom: 0.04, shaft: 0.0 },
  DINOS:    { filter: "brightness(1.03) contrast(1.06) saturate(0.90)", tint: PAL.coldBlue,  op: 0.14, vig: 0.22, bloom: 0.04, shaft: 0.0 },
  DIET:     { filter: "brightness(1.06) contrast(1.05) saturate(1.06)", tint: PAL.savanna,   op: 0.20, vig: 0.24, bloom: 0.16, shaft: 0.24 },
  TOOLS:    { filter: "brightness(1.02) contrast(1.09) saturate(0.94)", tint: PAL.ochre,     op: 0.16, vig: 0.30, bloom: 0.14, shaft: 0.12 },
  NEAND:    { filter: "brightness(0.99) contrast(1.07) saturate(0.96)", tint: PAL.ice,       op: 0.20, vig: 0.32, bloom: 0.20, shaft: 0.16 },
  CTAG:     { filter: "brightness(1.05) contrast(1.03) saturate(0.98)", tint: PAL.paper,     op: 0.08, vig: 0.14, bloom: 0.04, shaft: 0.0 },
  OCEAN:    { filter: "brightness(1.04) contrast(1.06) saturate(0.98)", tint: PAL.coldBlue,  op: 0.20, vig: 0.26, bloom: 0.10, shaft: 0.18 },
  ARTISTS:  { filter: "brightness(1.00) contrast(1.07) saturate(1.02)", tint: PAL.firelight, op: 0.22, vig: 0.34, bloom: 0.22, shaft: 0.10 },
  STEPPE:   { filter: "brightness(1.05) contrast(1.06) saturate(0.94)", tint: PAL.ice,       op: 0.18, vig: 0.24, bloom: 0.10, shaft: 0.26 },
  CLOTHES:  { filter: "brightness(1.04) contrast(1.05) saturate(1.04)", tint: PAL.ochre,     op: 0.18, vig: 0.26, bloom: 0.16, shaft: 0.14 },
  OTZI:     { filter: "brightness(1.01) contrast(1.08) saturate(0.90)", tint: PAL.ice,       op: 0.24, vig: 0.34, bloom: 0.08, shaft: 0.12 },
  MEDICINE: { filter: "brightness(1.04) contrast(1.05) saturate(0.92)", tint: PAL.paper,     op: 0.11, vig: 0.20, bloom: 0.06, shaft: 0.0 },
  SPEECH:   { filter: "brightness(1.03) contrast(1.05) saturate(0.96)", tint: PAL.ochre,     op: 0.14, vig: 0.24, bloom: 0.12, shaft: 0.10 },
  FARMING:  { filter: "brightness(0.96) contrast(1.08) saturate(0.84)", tint: PAL.stone,     op: 0.24, vig: 0.36, bloom: 0.05, shaft: 0.0 },
  TIME:     { filter: "brightness(1.05) contrast(1.04) saturate(1.04)", tint: PAL.firelight, op: 0.18, vig: 0.24, bloom: 0.20, shaft: 0.14 },
  EVOLVING: { filter: "brightness(1.05) contrast(1.05) saturate(0.94)", tint: PAL.paper,     op: 0.10, vig: 0.18, bloom: 0.06, shaft: 0.0 },
  CLOSE:    { filter: "brightness(1.06) contrast(1.05) saturate(1.06)", tint: PAL.firelight, op: 0.18, vig: 0.22, bloom: 0.22, shaft: 0.18 },
};

export const ACCENT: Record<string, string> = {
  OPENING: PAL.stone, CAVES: PAL.stone, AGE30: PAL.firelight, LADDER: PAL.ochre,
  DINOS: PAL.coldBlue, DIET: PAL.savanna, TOOLS: PAL.ochre, NEAND: PAL.firelight,
  CTAG: PAL.ochre, OCEAN: PAL.coldBlue, ARTISTS: PAL.firelight, STEPPE: PAL.ice,
  CLOTHES: PAL.ochre, OTZI: PAL.ice, MEDICINE: PAL.stone, SPEECH: PAL.ochre,
  FARMING: PAL.stone, TIME: PAL.firelight, EVOLVING: PAL.stone, CLOSE: PAL.firelight,
};
