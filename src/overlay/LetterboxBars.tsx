import { AbsoluteFill } from "remotion";

// Thin cinematic black bars (Section 7.6). 3.5% height, always on.
export const LetterboxBars: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3.5%", background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3.5%", background: "#000" }} />
  </AbsoluteFill>
);
