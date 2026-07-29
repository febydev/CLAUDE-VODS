export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX";
  start: number;
  duration: number;
  file: string;
  stage: string;
  grade: string;
  deep: boolean;
  dust: boolean;
  ember: boolean;
  shimmer: boolean;
  hedge: boolean;
  depth: boolean; // 2.5D separation pass (parallax / dolly / crawl styles)

  // motifs (FULL_PACKAGE section 8)
  eye: number | null; // 0..1 growth across the ten eye appearances
  outline: boolean; // the dotted, never-filled outline
  rings: number; // echo-ring strength, 0 = off

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
  pivot: boolean; // first shot of an arc stage -> gets a real transition, not a cut
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
