import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// FULL_PACKAGE section 8 FONT RULE (MANDATORY - DO NOT SUBSTITUTE): a BOLD CONDENSED display
// face. Anton is the named first choice. A thin/default/generic system sans (Arial, Helvetica,
// Times, Calibri, Segoe) is an explicit FAILURE, so the family is loaded from Google Fonts and
// never falls back to a system stack.
export const { fontFamily: ANTON } = loadFont();
export const FONT = ANTON;

// Section 8 palette. Cool blue-grey stone cave interiors against warm ochre exteriors,
// with the spec's fixed overlay colours.
export const PAL = {
  charcoal: "#241B16",   // spec: overlay stroke / plates
  ivory: "#F7E5BC",      // spec: overlay fill
  warmRed: "#C6402F",    // spec: CTA post-click fill
  paper: "#E8DCC2",
  stone: "#8A9AA6",
  coldBlue: "#6E8494",
  deepStone: "#39454F",
  nearBlack: "#0B0908",
  ochre: "#C08A45",
  firelight: "#E3A14B",
  ember: "#C6642F",
};

// Section 10: ease everything, settle by ~40% of the shot. No linear camera moves anywhere.
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// Overlay type: uppercase, ivory fill, ~8px charcoal stroke. A layered text-shadow ring renders
// reliably headless (paint-order/-webkit-text-stroke is unreliable in Chromium screenshots),
// plus a soft drop shadow underneath for the reels look.
export const overlayText = {
  color: PAL.ivory,
  textShadow: [
    "-4px -4px 0 #241B16", "4px -4px 0 #241B16", "-4px 4px 0 #241B16", "4px 4px 0 #241B16",
    "-6px 0 0 #241B16", "6px 0 0 #241B16", "0 -6px 0 #241B16", "0 6px 0 #241B16",
    "-8px 0 0 #241B16", "8px 0 0 #241B16", "0 -8px 0 #241B16", "0 8px 0 #241B16",
    "0 10px 24px rgba(0,0,0,0.62)",
  ].join(", "),
  fontWeight: 400 as const,
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: -1.5,
  lineHeight: 1.06,
} as const;

// One grade per arc stage. Every value obeys VIDEO_EDITOR section 6 on the FOOTAGE itself:
// brightness never below 0.92 (-8%, inside the -10% floor), contrast <= +12%, saturation >= 0.80.
// Depth and dread are produced by TINT and VIGNETTE, never by crushing the image - which is how
// the deep-cave stretch reads as pitch black while the artwork stays visible.
export const GRADE: Record<string, { filter: string; tint: string; op: number; vig: number }> = {
  OPEN:     { filter: "brightness(0.94) contrast(1.08) saturate(0.86)", tint: PAL.coldBlue,  op: 0.22, vig: 0.40 },
  METHOD:   { filter: "brightness(1.02) contrast(1.05) saturate(0.92)", tint: PAL.stone,     op: 0.12, vig: 0.22 },
  DEAD:     { filter: "brightness(0.96) contrast(1.08) saturate(0.84)", tint: PAL.stone,     op: 0.20, vig: 0.32 },
  GRIEF:    { filter: "brightness(0.93) contrast(1.10) saturate(0.80)", tint: PAL.coldBlue,  op: 0.26, vig: 0.42 },
  CAVE:     { filter: "brightness(1.04) contrast(1.06) saturate(1.06)", tint: PAL.firelight, op: 0.20, vig: 0.34 },
  CTAG:     { filter: "brightness(1.05) contrast(1.03) saturate(0.98)", tint: PAL.paper,     op: 0.08, vig: 0.16 },
  DEEP:     { filter: "brightness(0.92) contrast(1.12) saturate(0.86)", tint: PAL.deepStone, op: 0.30, vig: 0.54 },
  MONUMENT: { filter: "brightness(1.06) contrast(1.06) saturate(1.04)", tint: PAL.ochre,     op: 0.18, vig: 0.28 },
  STONE:    { filter: "brightness(1.02) contrast(1.05) saturate(0.94)", tint: PAL.paper,     op: 0.12, vig: 0.24 },
  MIND:     { filter: "brightness(1.03) contrast(1.04) saturate(0.90)", tint: PAL.stone,     op: 0.12, vig: 0.20 },
  EYES:     { filter: "brightness(1.05) contrast(1.08) saturate(1.08)", tint: PAL.ochre,     op: 0.22, vig: 0.30 },
  CLOSE:    { filter: "brightness(0.98) contrast(1.08) saturate(0.90)", tint: PAL.stone,     op: 0.18, vig: 0.34 },
  FINAL:    { filter: "brightness(0.95) contrast(1.10) saturate(0.88)", tint: PAL.coldBlue,  op: 0.24, vig: 0.44 },
};

// Caption accent bar colour follows the arc so the captions belong to the section they sit in.
export const ACCENT: Record<string, string> = {
  OPEN: PAL.coldBlue, METHOD: PAL.stone, DEAD: PAL.stone, GRIEF: PAL.coldBlue,
  CAVE: PAL.firelight, CTAG: PAL.ochre, DEEP: PAL.ember, MONUMENT: PAL.ochre,
  STONE: PAL.ochre, MIND: PAL.stone, EYES: PAL.firelight, CLOSE: PAL.stone,
  FINAL: PAL.coldBlue,
};
