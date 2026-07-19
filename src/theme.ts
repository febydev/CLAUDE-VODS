import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/AtkinsonHyperlegible";

// §8 overlay font: Atkinson Hyperlegible Bold (fallback Arial Bold).
export const { fontFamily: ATKINSON } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const FONT = `${ATKINSON}, Arial, sans-serif`;

// §8 palette
export const PAL = {
  charcoal: "#241B16",
  caveBlack: "#17130F",
  ivory: "#F7E5BC",
  ochre: "#D99A4E",
  rust: "#A95735",
  leaf: "#71804A",
  stone: "#64766B",
  water: "#6F9A9A",
};

// §9A "ease everything" — the specified settle curve
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// overlay entrance punch (§9: code overlays scale 88->106->100% over 260ms then hold)
export const overlayText = {
  color: PAL.ivory,
  // 8px charcoal stroke @1080p, via layered text-shadow for reliable headless render
  textShadow:
    "-3px -3px 0 #241B16, 3px -3px 0 #241B16, -3px 3px 0 #241B16, 3px 3px 0 #241B16, 0 0 3px #241B16, 0 4px 10px rgba(169,87,45,0.5)",
  fontWeight: 700 as const,
  fontFamily: FONT,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  lineHeight: 1.08,
};
