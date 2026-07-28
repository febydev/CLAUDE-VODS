export type Shot = {
  i: number;
  shot: string;
  type: "ANCIENT" | "VOX";
  start: number;
  duration: number;
  file: string;
  section: string;   // TRAP | BIOLOGY | REVEAL | MACHINE | NEAND | PAYOFF
  grade: string;
  accent: string;    // ring(rust) vs web(ochre/ember) motif colour
  web: boolean;      // network/web beat -> camera opens outward
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
  musicDuck: number[];   // frames where a caption lands (music dips 2dB)
  shots: Shot[];
};
