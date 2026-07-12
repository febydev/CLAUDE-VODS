import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, ARRIVE, textShadowOutline } from "../theme";
import type { Badge } from "../types";

// Part 8 badge-stacking (IMG079-084). Each trait badge slides up + fades in on the frame its
// trait is named (reveal, local to this sequence), on a frosted-glass card (exact spec CSS),
// and STAYS — so by the last badge all traits are visible together (the "combo" build).
// Entrance accelerates slightly per badge (10-15% faster) for compounding momentum.
export const BadgeStack: React.FC<{ badges: Badge[] }> = ({ badges }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 20, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: Math.min(880, width - 240) }}>
        {badges.map((b, i) => {
          const reveal = (b as any).revealAbs as number; // local frame within the badge sequence
          const local = frame - reveal;
          if (local < 0) return <div key={i} style={{ height: 96 }} />; // reserve space so stack doesn't jump
          const dur = Math.max(7, 15 - i * 1.5); // accelerate per badge
          const p = interpolate(local, [0, dur], [0, 1], { easing: ARRIVE, extrapolateRight: "clamp" });
          const y = interpolate(p, [0, 1], [40, 0]);
          const landPulse = interpolate(local, [dur, dur + 5, dur + 12], [1, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 24, height: 96, padding: "0 34px",
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 16,
              boxShadow: `0 8px 32px rgba(0,0,0,0.15), inset 0 0 30px ${b.color}18`,
              opacity: p, transform: `translateY(${y}px) scale(${landPulse})`,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: b.color, boxShadow: `0 0 18px ${b.color}`, flex: "0 0 auto" }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#fff", letterSpacing: 1, textShadow: textShadowOutline }}>{b.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
