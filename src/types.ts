export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX";
  start: number;
  duration: number;
  file: string;
  text: string;
  lines: string[];
  x: number | null;
  y: number | null;
  anchor: string;
  maxw: number;
  zone: string;
  plate: boolean;
  zoneY: number | null;
  zoneEdge: number | null;
  anim: string;
  trans: string;
  reverse: boolean;
  comedy: boolean;       // §7A protected PUNCH-SETTLE beat
  modern: boolean;       // modern-contrast shot (hard cut, near silence)
  montage: boolean;      // work montage stretch
  emberAccent: boolean;  // ember-orange caption accent
  dust: boolean;         // ancient shots get drifting dust motes
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
