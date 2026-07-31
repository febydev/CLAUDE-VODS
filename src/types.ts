export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX" | "CTA";
  start: number;
  duration: number;
  file: string;
  stage: string;
  grade: string;
  dust: boolean;
  ember: boolean;
  mist: number; // cold-air mist strength, 0 = off
  shimmer: boolean;
  hedge: boolean;
  depth: boolean; // 2.5D separation pass

  // motifs (FULL_PACKAGE section 8 / 10 / 11)
  mythCard: boolean; // a CROSS-OUT shot: gets the identical clinical negation event
  vessel: number | null; // section 8's plain pale vessel: 0 ordinary, 1 on the S103/S207 callback
  dashed: boolean; // section 12's dashed border on a contested claim
  dashedInArt: boolean; // the artwork already has one, so the overlay is skipped

  // captions
  text: string;
  lines: string[];
  fontSize: number;
  x: number | null;
  y: number | null;
  anchor: string;
  maxw: number;
  zone: string;
  plate: boolean;
  plateAlpha: number;
  revealFrame: number;
  bakedText: boolean;
  bakedWords: string[];

  anim: string;
  reverse: boolean;
  pivot: boolean;
  sfxFile: string | null;
  sfxLocal: number;
  sfxVol: number;
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  introFrames: number;
  durationSeconds: number;
  music: { src: string; base: number; keyframes: number[][] };
  cta: {
    startFrame: number;
    endFrame: number;
    clickFile: string;
    bellFile: string;
    landFrame: number;
    clickFrame: number;
    bellFrame: number;
    landVol: number;
    clickVol: number;
    bellVol: number;
  };
  shots: Shot[];
};
