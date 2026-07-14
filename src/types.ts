export type Scene = {
  seq: number;
  img: number;
  file: string | null;
  start: number;
  duration: number;
  trigger: string;
  text: string;
  kind: "PHOTO" | "CODE";
  group: number;
  filter: string;
  tint: string;
  tintOp: number;
  accent: string;
  vig: number;
  kenBurns: "zoomIn" | "zoomOut" | "panLeft" | "panRight";
  content: {title?: string; labels?: string[]; form?: number};
};

export type Data = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  introFrames: number;
  durationSeconds: number;
  scenes: Scene[];
};