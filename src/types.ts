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
  haze: number; // bog haze strength, 0 = off
  tender: boolean; // the calm-face beats: nothing may clutter them
  shimmer: boolean;
  hedge: boolean;
  depth: boolean; // 2.5D separation pass

  // motifs (FULL_PACKAGE section 8)
  ring: number | null; // ring-and-outside: gap growth 0..1 across its six appearances
  dashed: boolean; // the unproven border, never upgraded to solid
  strike: 0 | 1 | 2; // the struck-out cruelty ranking (S070 pass 1, S203 pass 2)

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
  bakedText: boolean; // image already carries readable lettering -> caption suppressed
  bakedWords: string[];

  anim: string;
  reverse: boolean;
  pivot: boolean; // first shot of an arc stage -> a real transition, not a cut
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
    landFrame: number;
    clickFrame: number;
    landVol: number;
    clickVol: number;
  };
  shots: Shot[];
};
