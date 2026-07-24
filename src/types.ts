export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX";
  start: number;
  duration: number;
  file: string;
  text: string;
  x: number | null;
  y: number | null;
  anchor: string;
  maxw: number;
  zone: string;
  anim: string;
  trans: string;
  reverse: boolean;
  sfxFile: string | null;   // tiktok SFX asset (public/sfx/..)
  sfxLocal: number;         // frame (relative to shot start) to fire the SFX
  sfxVol: number;
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  introFrames: number;
  durationSeconds: number;
  shots: Shot[];
};
