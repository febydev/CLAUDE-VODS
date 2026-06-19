import { AbsoluteFill } from "remotion";

// Cinematic black bars — 4% top and bottom (Section 5.1, always on).
export const LetterboxBars: React.FC<{ heightPct?: number }> = ({ heightPct = 4 }) => {
  const h = `${heightPct}%`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000" }} />
    </AbsoluteFill>
  );
};
