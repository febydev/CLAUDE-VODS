export type Section = "P1_DREAM" | "FACT" | "BADGE" | "COSMIC" | "P9_CLOSE" | "END";
export type KB = "default" | "emotional" | "diagram";
export type Trans = "cut" | "dissolve" | "zoomthrough";

export type Overlay = {
  text: string;         // e.g. "1 IN 6.83 SEPTILLION"
  revealLocal: number;  // frame (relative to scene start) when the number is spoken — punch-in lands here
  climax?: boolean;     // the septillion payoff — larger, holds alone
};

export type Scene = {
  seq: number;
  img: number;
  file: string | null;
  start: number;
  duration: number;
  trigger: string;
  text: string;
  section: Section;
  kb: KB;
  trans: Trans;         // entrance transition for THIS scene
  exitZoom: boolean;    // zoom-through OUT on this scene's tail (pivot into next topic)
  parallax: boolean;
  glow: "gold" | "blue" | null;
  grade: "WARM" | "COOL" | "COSMIC";
  starfield: boolean;
  overlay: Overlay | null;
};

export type Badge = { label: string; color: string; revealAbs: number };

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
