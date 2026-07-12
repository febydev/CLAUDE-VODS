import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

// ONE font family (spec: Montserrat/Poppins/Inter Black family). Poppins, incl. 900 for on-screen numbers.
export const { fontFamily: POPPINS } = loadFont("normal", {
  weights: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const FONT = POPPINS;

// ---- EXACT easing curves from the EDITING DIRECTION (binding spec) ----
export const KB_EASE = Easing.bezier(0.45, 0, 0.55, 1);      // Ken Burns push (symmetric)
export const PUNCH = Easing.bezier(0.34, 1.56, 0.64, 1);      // scale-punch-in overshoot (probability reveals)
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);         // things arriving on screen (badges)
export const DISSOLVE = Easing.bezier(0.4, 0, 0.6, 1);        // the 2-3 reserved cross-dissolves

// on-screen text stroke to match the thumbnail brand
export const TEXT_STROKE = "3px";
export const textShadowOutline =
  "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 4px 18px rgba(0,0,0,0.6)";

// grade filters per section (spec: warm bookends, cool clinical facts, near-black cosmic)
export const GRADE_FILTER = {
  WARM: "brightness(1.06) contrast(1.04) saturate(1.08) sepia(0.10) hue-rotate(-8deg)",
  COOL: "brightness(1.05) contrast(1.07) saturate(0.88)",
  COSMIC: "brightness(0.98) contrast(1.16) saturate(1.02)",
};
export const GRADE_TINT = {
  WARM: { color: "rgba(255,190,120,1)", op: 0.14 },
  COOL: { color: "rgba(150,185,220,1)", op: 0.10 },
  COSMIC: { color: "rgba(60,80,120,1)", op: 0.10 },
};

export const GOLD = "#FFD700";
export const BLUE = "#A8D8FF";
