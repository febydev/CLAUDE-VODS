import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, INK, GOLD, creamBg } from "../theme";

// Hyperthymesia "recall every single day": a dense GitHub-contribution-style day grid
// illuminates in a rapid left-to-right sweep, then a shimmer washes across = total recall.
export const TimelineFill: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cols = 52, rows = 14;
  const total = cols * rows;
  const cw = (width * 0.8) / cols, ch = cw;
  const ox = width * 0.1, oy = height * 0.24;

  const sweepEnd = 30;
  const shimmer = interpolate(frame, [sweepEnd + 4, sweepEnd + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: creamBg(GOLD) }}>
      {new Array(total).fill(0).map((_, i) => {
        const c = i % cols;
        const lit = interpolate(frame, [(c / cols) * sweepEnd, (c / cols) * sweepEnd + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sh = Math.abs((c / cols) - shimmer) < 0.08 ? 0.5 : 0;
        return <div key={i} style={{ position: "absolute", left: ox + c * cw, top: oy + Math.floor(i / cols) * ch, width: cw - 4, height: ch - 4, borderRadius: 4,
          background: lit > 0.5 ? GOLD : "#E4D8BE", opacity: 0.35 + 0.65 * lit, boxShadow: lit > 0.5 ? `0 0 ${6 + sh * 14}px ${GOLD}` : "none" }} />;
      })}
      <div style={{ position: "absolute", bottom: "12%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: INK,
        opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{label}</div>
    </AbsoluteFill>
  );
};
