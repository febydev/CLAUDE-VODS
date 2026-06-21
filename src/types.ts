export type Kind =
  | "PHOTO" | "QUOTE" | "KINETIC" | "DIAGRAM" | "DATAVIZ"
  | "COUNTER" | "SPLIT" | "LOWER3" | "CTA" | "INTRO";

export type Scene = {
  seq: number;
  img: number;
  file: string | null;
  start: number;
  duration: number;
  trigger: string;
  text: string;
  kind: Kind;
  bucket: "KEEP" | "ENHANCE" | "REPLACE";
  gradeName: string;
  filter: string;
  tint: string;
  tintOp: number;
  glow: string;
  accent: string;
  vig: number;
  kenBurns: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "none";
  dust: boolean;
  shimmer: boolean;
  content: any;
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  introFrames: number;
  durationSeconds: number;
  img1Frame: number;
  scenes: Scene[];
};
