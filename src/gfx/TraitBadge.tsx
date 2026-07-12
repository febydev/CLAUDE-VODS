import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, ARRIVE, textShadowOutline } from "../theme";
import type { Badge } from "../types";

// Part 8 combo: frosted-glass trait cards (exact glassmorphism spec) slide up + accumulate,
// each arriving faster than the last. Ghost badges (blood types / mutations / more) appear
// dashed + dim to say "more exist, uncounted". Spans IMG079-089 as one persistent overlay.
export const TraitBadge: React.FC<{ badges: Badge[] }> = ({ badges }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const solid = badges.filter((b) => !b.ghost);
  const ghosts = badges.filter((b) => b.ghost);
  const W = Math.min(820, width - 320);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 20, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: W }}>
        {solid.map((b, i) => {
          const local = frame - b.revealAbs;
          if (local < 0) return <div key={i} style={{ height: 88 }} />;
          const dur = Math.max(6, 14 - i * 1.3);
          const p = interpolate(local, [0, dur], [0, 1], { easing: ARRIVE, extrapolateRight: "clamp" });
          const y = interpolate(p, [0, 1], [40, 0]);
          const land = interpolate(local, [dur, dur + 5, dur + 11], [1, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 88, padding: "0 30px",
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 16, boxShadow: `0 8px 32px rgba(0,0,0,0.15), inset 0 0 30px ${b.color}18`,
              opacity: p, transform: `translateY(${y}px) scale(${land})` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: b.color, boxShadow: `0 0 16px ${b.color}`, flex: "0 0 auto" }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#fff", letterSpacing: 1, textShadow: textShadowOutline }}>{b.label}</div>
            </div>
          );
        })}
        {/* ghost badges row */}
        {ghosts.length > 0 && ghosts[0].revealAbs <= frame ? (
          <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center", opacity: interpolate(frame - ghosts[0].revealAbs, [0, 12], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {ghosts.map((g, i) => (
              <div key={i} style={{ padding: "14px 24px", borderRadius: 14, border: "2px dashed rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)",
                fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.85)" }}>{g.label}</div>
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
