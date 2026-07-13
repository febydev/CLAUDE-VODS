import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";

// ONE font family per video.
export const { fontFamily: ARCHIVO } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const FONT = ARCHIVO;

// "Neolithic earth" identity — warm clay / ochre / terracotta with rotating earthy accents.
export const PALETTE = {
  ochre: "#E0A458",
  gold: "#E8B84B",
  terracotta: "#C56A3A",
  clay: "#A6704A",
  sage: "#8FA46A",
  rust: "#9C3F2C",
  cream: "#F3E7D0",
  deep: "#241811",
  ink: "#2B2018",
};

// rotating accent pool (earthy), color rotates by chapter, treatment stays uniform
export const ACCENTS = {
  ochre: "#E0A458",
  gold: "#E8B84B",
  terracotta: "#C56A3A",
  sage: "#8FA46A",
  rust: "#C15A3F",
  bone: "#EADFC6",
};

// warm dark-earth gradient depth background for motion-graphic scenes (firelit clay feel)
export const MG_BG = "radial-gradient(ellipse at 50% 40%, #3a2a1c 0%, #241811 60%, #130c07 100%)";

// helpers used by the real-map + label components
export const INK = "#2B2018";
export const CREAM = "#F3E7D0";
export const GOLD = "#E8B84B";
export const SCI = "#E0A458";
export const GREY_DOT = "#C9B79A";
export const creamBg = (_accent: string) =>
  "radial-gradient(ellipse at 50% 42%, #F7EEDC 0%, #F0E3C8 58%, #E4D2AE 100%)";
export const fitFont = (text: string, base: number, maxW = 1660) =>
  Math.min(base, Math.floor(maxW / Math.max(1, text.length * 0.6)));

export const EASE = Easing.bezier(0.33, 0, 0.2, 1);
export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_INOUT = Easing.inOut(Easing.cubic);
export const PUNCH = Easing.bezier(0.34, 1.56, 0.64, 1);
export const KB_EASE = Easing.bezier(0.45, 0, 0.55, 1);
