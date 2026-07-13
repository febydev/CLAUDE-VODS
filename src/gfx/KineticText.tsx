import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG } from "../theme";

// Kinetic word list (Section 9 Type 2). Each word appears at its OWN Whisper frame
// (wordFrames, local). SLAM 150%->100%. Past words stay, dim to 60%. No added delays.
export const KineticText: React.FC<{ words: string[]; wordFrames: number[]; accent: string }> = ({ words, wordFrames, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let active = -1;
  for (let i = 0; i < wordFrames.length; i++) if (frame >= wordFrames[i]) active = i;

  return (
    <AbsoluteFill style={{ background: MG_BG, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${accent}20, transparent 60%)` }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {words.map((w, i) => {
          const wf = wordFrames[i] ?? 0;
          const local = frame - wf;
          if (local < 0) return <div key={i} style={{ height: 0, opacity: 0 }} />;
          const s = spring({ frame: local, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
          const scale = interpolate(s, [0, 1], [1.5, 1]);
          const isCurrent = i === active;
          return (
            <div key={i} style={{
              fontFamily: FONT, fontWeight: 900, fontSize: words.length > 3 ? 108 : 128, lineHeight: 1.0,
              color: isCurrent ? "#FFF6EA" : "rgba(255,246,234,0.6)", transform: `scale(${scale})`,
              textShadow: isCurrent ? `0 0 46px ${accent}, 0 0 92px ${accent}66` : `0 0 24px ${accent}44`,
              letterSpacing: 1,
            }}>{w}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
