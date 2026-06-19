export type Kind =
  | "PHOTO" | "QUOTE" | "KINETIC" | "COUNTER" | "MAP" | "TIMELINE"
  | "DIAGRAM" | "SPLIT" | "STICKMAN" | "PARTICLE" | "CTA";

export type Scene = {
  seq: number;
  img: number;
  file: string;
  start: number;
  duration: number;
  trigger: string;
  text: string;
  kind: Kind;
  bucket: "KEEP" | "ENHANCE" | "REPLACE";
  mood: string;
  filter: string;
  tint: string;
  blend: string;
  tintOp: number;
  vignette: number;
  glow: string;
  cap: string;
  kenBurns: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift";
  dust: boolean;
  parallax: boolean;
  heartbeat: boolean;
  interrupt: string | null;
  content: any;
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  durationSeconds: number;
  introFrames: number;
  scenes: Scene[];
};

export type CaptionWord = { t: string; s: number; e: number };
export type CaptionGroup = { start: number; end: number; words: CaptionWord[] };
