import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

// ONE font family. Poppins incl. 900 for on-screen numbers (matches thumbnail brand).
export const { fontFamily: POPPINS } = loadFont("normal", {
  weights: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const FONT = POPPINS;

// easing curves
export const KB_EASE = Easing.bezier(0.45, 0, 0.55, 1);   // Ken Burns push
export const PUNCH = Easing.bezier(0.34, 1.56, 0.64, 1);   // scale-punch-in overshoot
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);      // arriving on screen
export const DISSOLVE = Easing.bezier(0.4, 0, 0.6, 1);

export const textShadowOutline =
  "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 4px 18px rgba(0,0,0,0.55)";

// grade filters for IMAGE scenes only
export const GRADE_FILTER = {
  WARM: "brightness(1.06) contrast(1.04) saturate(1.08) sepia(0.10) hue-rotate(-8deg)",
  COOL: "brightness(1.05) contrast(1.07) saturate(0.9)",
  COSMIC: "brightness(0.98) contrast(1.16) saturate(1.02)",
};
export const GRADE_TINT = {
  WARM: { color: "rgba(255,190,120,1)", op: 0.14 },
  COOL: { color: "rgba(150,185,220,1)", op: 0.08 },
  COSMIC: { color: "rgba(60,80,120,1)", op: 0.10 },
};

// flat-cartoon palette so code components match the illustrations
export const CREAM = "#FBF4E6";
export const INK = "#1c1c22";
export const GREY_DOT = "#D4D4D4";
export const GOLD = "#FFD700";
export const BLUE = "#A8D8FF";
export const SCI = "#3B82F6";     // scientific accent
export const GREEN = "#22B07A";
export const RED = "#FF6B6B";

// cream backdrop with subtle vignette + paper grid (keeps code scenes on-brand, not flat)
export const creamBg = (accent: string) =>
  `radial-gradient(ellipse at 50% 42%, #FFFBF2 0%, ${CREAM} 58%, #EFE3CC 100%)`;
export const COSMIC_BG = "radial-gradient(ellipse at 50% 48%, #0a0f1e 0%, #05070f 60%, #010206 100%)";
