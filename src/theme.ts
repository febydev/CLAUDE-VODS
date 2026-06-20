import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

// ONE font family per video (Section 14). Poppins: weights for titles + body.
export const { fontFamily: POPPINS } = loadFont();

export const FONT = POPPINS;

// "Romantic Science" palette
export const PALETTE = {
  rose: "#ff7a9c",
  hotRose: "#ff4d6d",
  cream: "#fff4ef",
  plum: "#7a4a63",
  cyan: "#56cfe0",
  ink: "#241019",
};

export const EASE = Easing.bezier(0.33, 0, 0.2, 1);     // camera / ken burns
export const EASE_OUT = Easing.out(Easing.cubic);        // entrances
export const EASE_INOUT = Easing.inOut(Easing.cubic);
