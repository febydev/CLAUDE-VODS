import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS, INTER } from "../theme";
import { NumberCounter } from "./NumberCounter";

type Region = "africa" | "india" | "amazon" | "us_east" | "tsavo" | "champawat";
const POS: Record<Region, { x: number; y: number }> = {
  africa: { x: 0.545, y: 0.60 }, india: { x: 0.70, y: 0.45 }, amazon: { x: 0.31, y: 0.66 },
  us_east: { x: 0.225, y: 0.40 }, tsavo: { x: 0.575, y: 0.61 }, champawat: { x: 0.70, y: 0.43 },
};
// the 3-continent global-avoidance sequence accumulates pins
const SEQ: Region[] = ["africa", "india", "amazon"];

// faint blurred continent blobs to suggest a world map (stylized, not literal)
const BLOBS = [
  { x: 0.22, y: 0.38, w: 0.16, h: 0.20 }, // N America
  { x: 0.30, y: 0.64, w: 0.10, h: 0.22 }, // S America
  { x: 0.50, y: 0.34, w: 0.10, h: 0.10 }, // Europe
  { x: 0.55, y: 0.58, w: 0.14, h: 0.26 }, // Africa
  { x: 0.70, y: 0.40, w: 0.20, h: 0.20 }, // Asia
  { x: 0.82, y: 0.74, w: 0.09, h: 0.08 }, // Australia
];

export const NetflixMap: React.FC<{
  region: Region; label: string; sub?: string; seqStep?: number; color: string;
  counter?: any;
}> = ({ region, label, sub, seqStep = 1, color, counter }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const camIn = interpolate(frame, [0, 30], [1.18, 1.0], { extrapolateRight: "clamp" });
  const isSeq = SEQ.includes(region);
  const activePins: Region[] = isSeq ? SEQ.slice(0, seqStep) : [region];
  const newest = activePins[activePins.length - 1];

  const Pin: React.FC<{ r: Region; isNew: boolean }> = ({ r, isNew }) => {
    const px = POS[r].x * width, py = POS[r].y * height;
    const appear = isNew ? spring({ frame: frame - 18, fps, config: { damping: 10 } }) : 1;
    const ring = isNew ? (frame - 18) : 9999;
    return (
      <>
        {[0, 1].map((k) => {
          const local = (ring - k * 18);
          if (local < 0) return null;
          const rr = interpolate(local % 50, [0, 50], [10, 120]);
          const op = interpolate(local % 50, [0, 50], [0.6, 0]);
          return <div key={k} style={{
            position: "absolute", left: px - rr, top: py - rr, width: rr * 2, height: rr * 2,
            borderRadius: "50%", border: `2px solid ${color}`, opacity: op,
          }} />;
        })}
        <div style={{
          position: "absolute", left: px - 11, top: py - 11, width: 22, height: 22, borderRadius: "50%",
          background: color, transform: `scale(${appear})`, boxShadow: `0 0 26px ${color}, 0 0 60px ${color}aa`,
        }} />
      </>
    );
  };

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #0a1622 0%, #04070c 75%)" }}>
      <AbsoluteFill style={{ transform: `scale(${camIn})` }}>
        {/* graticule grid */}
        <svg width={width} height={height} style={{ position: "absolute", opacity: 0.18 }}>
          {new Array(13).fill(0).map((_, i) => (
            <line key={`v${i}`} x1={(i / 12) * width} y1={0} x2={(i / 12) * width} y2={height} stroke={color} strokeWidth={1} />
          ))}
          {new Array(8).fill(0).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={(i / 7) * height} x2={width} y2={(i / 7) * height} stroke={color} strokeWidth={1} />
          ))}
        </svg>
        {/* stylized continents */}
        {BLOBS.map((b, i) => (
          <div key={i} style={{
            position: "absolute", left: (b.x - b.w / 2) * width, top: (b.y - b.h / 2) * height,
            width: b.w * width, height: b.h * height, borderRadius: "46%",
            background: "rgba(70,120,150,0.20)", border: "1px solid rgba(120,180,210,0.18)", filter: "blur(2px)",
          }} />
        ))}
        {/* connecting arcs for the sequence */}
        {isSeq && seqStep > 1 && (
          <svg width={width} height={height} style={{ position: "absolute" }}>
            {SEQ.slice(0, seqStep).map((r, i) => {
              if (i === 0) return null;
              const a = POS[SEQ[i - 1]], b = POS[r];
              const x1 = a.x * width, y1 = a.y * height, x2 = b.x * width, y2 = b.y * height;
              const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 80;
              const dash = interpolate(frame, [12, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <path key={i} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none"
                stroke={color} strokeWidth={3} strokeDasharray={1200} strokeDashoffset={dash * 1200}
                opacity={0.8} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />;
            })}
          </svg>
        )}
        {activePins.map((r) => <Pin key={r} r={r} isNew={r === newest} />)}
      </AbsoluteFill>

      {/* label card */}
      <div style={{
        position: "absolute", left: "8%", top: "16%",
        opacity: interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [20, 34], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
      }}>
        <div style={{ fontFamily: BEBAS, fontSize: 78, color: "#fff", letterSpacing: 3, textShadow: `0 0 26px ${color}` }}>{label}</div>
        {sub ? <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color }}>{sub}</div> : null}
      </div>

      {counter ? (
        <div style={{ position: "absolute", right: "9%", bottom: "20%" }}>
          <NumberCounter stat={counter} color={color} big={false} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
