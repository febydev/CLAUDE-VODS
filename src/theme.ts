import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";

// ONE font family per video (Section 14). Archivo: Black/Expanded for titles, regular for body.
export const { fontFamily: ARCHIVO } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const FONT = ARCHIVO;

// "Warm amber" identity (lighter base) + rotating neon accents drawn from the style refs.
export const PALETTE = {
  amber: "#FFE0B2",
  gold: "#F4B860",
  brown: "#6B4A33",
  deepBrown: "#2A1A16",
  cream: "#FFF2DF",
  cyan: "#80DFFF",
  mint: "#34D399",
  blue: "#4D94FF",
  violet: "#BC6BFF",
  ink: "#241019",
};

// Rotating accent pool — color rotates by section, treatment stays uniform.
export const ACCENTS = {
  amber: "#FFE0B2",
  gold: "#F4B860",
  cyan: "#80DFFF",
  mint: "#34D399",
  blue: "#4D94FF",
  violet: "#BC6BFF",
};

// Shared warm gradient-depth background for motion-graphic scenes (NOT a flat color — Section 9 depth).
export const MG_BG = "radial-gradient(ellipse at 50% 40%, #3a2418 0%, #241610 60%, #160d08 100%)";

export const EASE = Easing.bezier(0.33, 0, 0.2, 1);     // camera / ken burns
export const EASE_OUT = Easing.out(Easing.cubic);        // entrances
export const EASE_INOUT = Easing.inOut(Easing.cubic);
