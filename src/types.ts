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
  plate: boolean;       // analysis-driven: busy/bright zone -> plate behind caption
  zoneY: number | null; // measured luma of the reserved zone
  zoneEdge: number | null;
  anim: string;
  trans: string;
  reverse: boolean;
  snow: boolean;        // exterior -> drifting snow particles
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
