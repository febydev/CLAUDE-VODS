export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX";
  start: number;
  duration: number;
  file: string;
  stage: string;      // §8A rain stage
  rainMode: string;   // full | entrance | none | sparse | drips
  rainI: number;      // 0-1 intensity
  grade: string;      // key into GRADE
  deep: boolean;      // S054-S066 deep cave
  text: string;
  lines: string[];
  x: number | null;
  y: number | null;
  anchor: string;
  maxw: number;
  zone: string;
  plate: boolean;
  anim: string;
  trans: string;
  reverse: boolean;
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
  shots: Shot[];
};
