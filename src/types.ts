export type Section = "P1_DREAM" | "FACT" | "BADGE" | "COSMIC" | "P9_CLOSE" | "END";
export type KB = "default" | "emotional" | "diagram";
export type Trans = "cut" | "dissolve" | "zoomthrough";

export type Kind =
  | "IMAGE" | "RARITY_GRID" | "PIE" | "SCALE_CROWD" | "MAP" | "EQUATION"
  | "COSMIC" | "MOSAIC" | "FUNNEL" | "TIMELINE" | "BADGE" | "SCALE_STACK" | "CTA";

export type Scene = {
  seq: number;
  img: number;
  file: string | null;
  start: number;
  duration: number;
  trigger: string;
  text: string;
  kind: Kind;
  section: Section;
  kb: KB;
  trans: Trans;
  exitZoom: boolean;
  parallax: boolean;
  glow: "gold" | "blue" | null;
  grade: "WARM" | "COOL" | "COSMIC";
  starfield: boolean;
  content: any; // component data payload
};

export type Badge = { label: string; color: string; revealAbs: number; ghost?: boolean };

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  introFrames: number;
  durationSeconds: number;
  img1Frame: number;
  badgeStart: number;
  badgeEnd: number;
  badges: Badge[];
  scenes: Scene[];
};
