import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// FULL_PACKAGE section 8 FONT RULE (MANDATORY - DO NOT SUBSTITUTE): a BOLD CONDENSED display face.
// Anton is the named first choice. A thin/default/generic system sans (Arial, Helvetica, Times,
// Calibri, Segoe) is an explicit FAILURE, so the family is loaded from Google Fonts and never falls
// back to a system stack.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// Section 8 palette: cool blue-grey stone and peat-brown wetland tones against warm ochre
// exteriors, plus the spec's fixed overlay and CTA colours.
export const PAL = {
  charcoal: "#241B16", // spec: overlay stroke / plates
  ivory: "#F7E5BC", // spec: overlay fill
  warmRed: "#C6402F", // spec: CTA post-click fill
  paper: "#E8DCC2",
  stone: "#8A9AA6",
  coldBlue: "#68808F",
  slate: "#3C4750",
  peat: "#5B4530",
  peatDark: "#2E2317",
  bogGreen: "#4E5340",
  nearBlack: "#0A0908",
  ochre: "#C08A45",
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
 * One grade per arc stage, mapped onto what the narration is actually doing (see narration_pn.txt).
 * Every value obeys VIDEO_EDITOR section 6 on the FOOTAGE itself: brightness never below 0.92
 * (-8%, inside the -10% floor), contrast <= +12%, saturation >= 0.80. Depth comes from TINT,
 * VIGNETTE and LIGHT, never from crushing the image.
 *
 * Light is the emotional dial, and this video has a specific argument to carry: inside the group is
 * WARM, outside it is COLD, every single time. So REMOVAL (the camp, the shared fire, the levelling
 * talk) is the warmest and most open stage in the first half, and the exclusion stages either side
 * of it are the coldest and tightest - which is what makes exile read as a sentence rather than a
 * mood. The bog stretch is peat: desaturated, cool, heavy, and the tender shots inside it lift
 * slightly so a face reads as a face. CROWD is the harshest stage in the video, because that is the
 * thesis: cruelty arrives with crowds. FACE, the last eight shots, is the warmest thing here.
 */
export const GRADE: Record<
  string,
  { filter: string; tint: string; op: number; vig: number; bloom: number; shaft: number }
> = {
  PROBLEM:    { filter: "brightness(0.94) contrast(1.08) saturate(0.84)", tint: PAL.coldBlue, op: 0.24, vig: 0.44, bloom: 0.08, shaft: 0.0 },
  LIMITS:     { filter: "brightness(1.03) contrast(1.04) saturate(0.90)", tint: PAL.stone,    op: 0.11, vig: 0.20, bloom: 0.03, shaft: 0.0 },
  BONES:      { filter: "brightness(0.95) contrast(1.10) saturate(0.82)", tint: PAL.slate,    op: 0.25, vig: 0.40, bloom: 0.05, shaft: 0.10 },
  REMOVAL:    { filter: "brightness(1.05) contrast(1.05) saturate(1.08)", tint: PAL.firelight, op: 0.22, vig: 0.24, bloom: 0.24, shaft: 0.20 },
  OUTLAW:     { filter: "brightness(0.93) contrast(1.09) saturate(0.80)", tint: PAL.coldBlue, op: 0.28, vig: 0.48, bloom: 0.04, shaft: 0.0 },
  BOUNDARY:   { filter: "brightness(0.96) contrast(1.08) saturate(0.84)", tint: PAL.slate,    op: 0.24, vig: 0.42, bloom: 0.05, shaft: 0.12 },
  CTAG:       { filter: "brightness(1.05) contrast(1.03) saturate(0.98)", tint: PAL.paper,    op: 0.08, vig: 0.14, bloom: 0.04, shaft: 0.0 },
  BOG:        { filter: "brightness(0.93) contrast(1.10) saturate(0.82)", tint: PAL.peat,     op: 0.30, vig: 0.50, bloom: 0.08, shaft: 0.0 },
  CORRECTION: { filter: "brightness(1.02) contrast(1.06) saturate(0.88)", tint: PAL.stone,    op: 0.13, vig: 0.24, bloom: 0.04, shaft: 0.0 },
  OFFERING:   { filter: "brightness(1.00) contrast(1.06) saturate(0.94)", tint: PAL.bogGreen, op: 0.20, vig: 0.34, bloom: 0.12, shaft: 0.14 },
  STATE:      { filter: "brightness(1.06) contrast(1.06) saturate(1.04)", tint: PAL.ochre,    op: 0.18, vig: 0.24, bloom: 0.14, shaft: 0.26 },
  CROWD:      { filter: "brightness(0.94) contrast(1.12) saturate(0.86)", tint: PAL.ember,    op: 0.22, vig: 0.50, bloom: 0.16, shaft: 0.18 },
  PATTERN:    { filter: "brightness(1.01) contrast(1.07) saturate(0.90)", tint: PAL.stone,    op: 0.16, vig: 0.32, bloom: 0.08, shaft: 0.10 },
  FACE:       { filter: "brightness(1.04) contrast(1.04) saturate(1.02)", tint: PAL.firelight, op: 0.18, vig: 0.30, bloom: 0.20, shaft: 0.12 },
};

// Caption accent colour follows the arc so a caption belongs to the section it sits in.
export const ACCENT: Record<string, string> = {
  PROBLEM: PAL.coldBlue,
  LIMITS: PAL.stone,
  BONES: PAL.stone,
  REMOVAL: PAL.firelight,
  OUTLAW: PAL.coldBlue,
  BOUNDARY: PAL.stone,
  CTAG: PAL.ochre,
  BOG: PAL.bogGreen,
  CORRECTION: PAL.stone,
  OFFERING: PAL.ochre,
  STATE: PAL.ochre,
  CROWD: PAL.ember,
  PATTERN: PAL.stone,
  FACE: PAL.firelight,
};
