import {Easing} from "remotion";
import {loadFont} from "@remotion/google-fonts/AtkinsonHyperlegible";

export const {fontFamily: FONT} = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const COLORS = {
  charcoal: "#241B16",
  cave: "#17130F",
  ivory: "#F7E5BC",
  ochre: "#D99A4E",
  rust: "#A95735",
  leaf: "#71804A",
  stone: "#64766B",
  water: "#6F9A9A",
};
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const fitFont = (text: string, base: number, max = 1640) =>
  Math.max(42, Math.min(base, Math.floor(max / Math.max(1, text.length * 0.58))));