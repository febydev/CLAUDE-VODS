import { Easing } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const ANTON = loadAnton().fontFamily; // hero / kinetic
export const BEBAS = loadBebas().fontFamily; // quote cards / lower thirds / labels
export const INTER = loadInter().fontFamily; // captions / body

// Predators color identity (custom 4-temperature system + science neutral)
export const PALETTE = {
  nightBg: "#05080d",
  cyan: "#5fd6ff",
  amber: "#ffc24a",
  red: "#e2402a",
  fire: "#ff9636",
  teal: "#56d0e0",
  ink: "#04070b",
  cream: "#f3f0ea",
};

export const EASE = Easing.bezier(0.33, 0, 0.2, 1);
export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_INOUT = Easing.inOut(Easing.cubic);

export const FONT = { ANTON, BEBAS, INTER };
