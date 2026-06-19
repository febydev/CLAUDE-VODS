import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, BEBAS, PALETTE } from "./theme";
import { Dust } from "./fx/Dust";

// ~9s cinematic intro, no voiceover (Section 12). Topic energy: night-forest dread.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height / 2;

  // eyes blink open 30-90
  const eyeOpen = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eyeBlink = frame > 70 ? (Math.sin(frame / 20) > -0.6 ? 1 : 0.2) : eyeOpen;
  // title 90-180
  const titleWords = ["WHY", "DON'T", "THEY", "ATTACK?"];
  // subtitle 180-240
  const subWords = "You sleep helpless every night.".split(" ");
  // final flare 240-270
  const flare = interpolate(frame, [240, 268], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const eyePairs = [[0.32, 0.42], [0.62, 0.38], [0.48, 0.5]];

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Audio src={staticFile("intro_audio.mp3")} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #0a1420 0%, #02040a 70%)" }} />
      <Dust count={50} opacity={0.1} />

      {/* predator eyes in the dark */}
      {frame > 28 && frame < 150 && eyePairs.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p[0] * width, top: p[1] * height, display: "flex", gap: 30, opacity: eyeBlink * interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {[0, 1].map((e) => <div key={e} style={{ width: 30, height: 16, borderRadius: "50%", background: "#ffd24a", boxShadow: "0 0 26px #ffd24a, 0 0 60px #ff8a2a" }} />)}
        </div>
      ))}

      {/* title */}
      {frame >= 90 && (
        <div style={{ position: "absolute", top: "38%", width: "100%", display: "flex", justifyContent: "center", gap: "0.3em", flexWrap: "wrap" }}>
          {titleWords.map((w, i) => {
            const d = 90 + i * 9;
            const s = spring({ frame: frame - d, fps, config: { damping: 13, mass: 0.8 } });
            return <span key={i} style={{
              fontFamily: ANTON, fontSize: 130, color: "#fff", letterSpacing: 2,
              opacity: interpolate(frame - d, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`,
              textShadow: `0 0 44px ${PALETTE.cyan}cc`,
            }}>{w}</span>;
          })}
        </div>
      )}

      {/* subtitle */}
      {frame >= 180 && (
        <div style={{ position: "absolute", top: "60%", width: "100%", display: "flex", justifyContent: "center", gap: "0.3em", flexWrap: "wrap" }}>
          {subWords.map((w, i) => (
            <span key={i} style={{
              fontFamily: BEBAS, fontSize: 50, color: PALETTE.cyan, letterSpacing: 2,
              opacity: interpolate(frame, [180 + i * 6, 188 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>{w}</span>
          ))}
        </div>
      )}

      {/* warm flare push into first scene */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 72%, rgba(255,150,60,${flare * 0.8}), transparent 60%)` }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [256, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * 0.5 }} />
    </AbsoluteFill>
  );
};
