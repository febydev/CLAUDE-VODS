export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX" | "CTA";
  start: number;
  duration: number;
  file: string;
  stage: string;        // arc stage, also the GRADE key
  grade: string;
  deep: boolean;        // deep-cave shot: near-black, lamp-lit
  dust: boolean;        // atmospheric dust (dramatic scenes only)
  shimmer: boolean;     // max 4 per video
  hedge: boolean;       // section 7A protected hedging beat: no sting, no shimmer
  text: string;
  lines: string[];
  fontSize: number;     // auto-fitted at build time against the measured calm band
  blockH: number;       // measured vertical budget of the reserved zone
  calmStrips: number | null;
  x: number | null;
  y: number | null;
  anchor: string;
  maxw: number;
  zone: string;
  plate: boolean;
  plateAlpha: number;
  anim: string;
  reverse: boolean;
  revealFrame: number;
  sfxFile: string | null;
  sfxLocal: number;
  sfxVol: number;
};

export type Music = {
  src: string;
  base: number;
  keyframes: number[][];
};

export type Cta = {
  startFrame: number;
  endFrame: number;
  clickFile: string;
  landFrame: number;
  clickFrame: number;
  landVol: number;
  clickVol: number;
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  introFrames: number;
  durationSeconds: number;
  music: Music;
  cta: Cta;
  shots: Shot[];
};
