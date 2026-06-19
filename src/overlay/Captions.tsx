import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { INTER } from "../theme";
import type { CaptionGroup } from "../types";
import groups from "../captions.json";

// Word-by-word captions synced to Whisper timestamps (Section 5.1).
// Lives inside the main (VO-relative) sequence, so frame 0 == VO start.
export const Captions: React.FC<{ highlightColor: string }> = ({ highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const all = groups as CaptionGroup[];
  // active group: the one whose [start-0.15, end+0.35] window contains t
  let g: CaptionGroup | null = null;
  for (const cand of all) {
    if (t >= cand.start - 0.15 && t <= cand.end + 0.35) { g = cand; break; }
  }
  if (!g) return null;

  const appear = interpolate(t, [g.start - 0.15, g.start + 0.05], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const disappear = interpolate(t, [g.end + 0.15, g.end + 0.35], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const op = Math.min(appear, disappear);

  return (
    <div
      style={{
        position: "absolute",
        left: 0, right: 0, bottom: "8.5%",
        display: "flex", justifyContent: "center",
        zIndex: 40, pointerEvents: "none", opacity: op,
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          display: "flex", flexWrap: "wrap", gap: "0.32em",
          justifyContent: "center", alignItems: "center",
        }}
      >
        {g.words.map((w, i) => {
          const active = t >= w.s - 0.02 && t < w.e + 0.06;
          const spoken = t >= w.s - 0.02;
          const pop = active
            ? interpolate(t, [w.s, w.s + 0.12], [1, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 42,
                lineHeight: 1.18,
                letterSpacing: 0.2,
                padding: "4px 14px",
                borderRadius: 10,
                transform: `scale(${pop})`,
                color: active ? "#0a0a0a" : spoken ? "#ffffff" : "rgba(255,255,255,0.55)",
                background: active ? highlightColor : "rgba(8,10,14,0.62)",
                boxShadow: active ? `0 6px 26px ${highlightColor}88` : "0 3px 14px rgba(0,0,0,0.5)",
                textShadow: active ? "none" : "0 2px 6px rgba(0,0,0,0.8)",
                transition: "none",
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};
