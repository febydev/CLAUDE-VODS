export type SfxCue = {frame: number; file: "08_ui_sounds.wav" | "04_menu_camera_click.wav"; volume: number};

// Sparse absolute landing cues; narration remains the dominant audio layer.
export const SFX_CUES: readonly SfxCue[] = [
  {frame: 374, file: "04_menu_camera_click.wav", volume: 0.07},
  {frame: 1573, file: "08_ui_sounds.wav", volume: 0.09},
  {frame: 2814, file: "08_ui_sounds.wav", volume: 0.08},
  {frame: 4425, file: "04_menu_camera_click.wav", volume: 0.06},
  {frame: 5208, file: "08_ui_sounds.wav", volume: 0.08},
  {frame: 7113, file: "04_menu_camera_click.wav", volume: 0.07},
  {frame: 7998, file: "08_ui_sounds.wav", volume: 0.08},
  {frame: 9401, file: "04_menu_camera_click.wav", volume: 0.06},
  {frame: 10560, file: "08_ui_sounds.wav", volume: 0.09},
] as const;
