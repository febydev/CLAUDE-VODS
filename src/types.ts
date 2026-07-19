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
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  durationSeconds: number;
  shots: Shot[];
};
