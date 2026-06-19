import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS, INTER } from "../theme";

// Motion-graphic overlays rendered on top of a kept photo (ENHANCE scenes).
export const Overlay: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2, cy = height / 2;

  if (type === "eyes_scent") {
    const blink = Math.sin(frame / 14) > -0.3 ? 1 : 0.15;
    const pairs = [[0.18, 0.34], [0.8, 0.3], [0.7, 0.62]];
    return <AbsoluteFill style={{ zIndex: 22, pointerEvents: "none" }}>
      {pairs.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p[0] * width, top: p[1] * height, display: "flex", gap: 26, opacity: blink }}>
          {[0, 1].map((e) => <div key={e} style={{ width: 24, height: 14, borderRadius: "50%", background: "#ffd24a", boxShadow: "0 0 22px #ffd24a, 0 0 50px #ff9a3a" }} />)}
        </div>
      ))}
    </AbsoluteFill>;
  }
  if (type === "neural") {
    const flash = Math.max(0, Math.sin(frame / 5));
    return <AbsoluteFill style={{ zIndex: 22, pointerEvents: "none", background: `radial-gradient(circle at 50% 45%, ${color}${Math.floor(flash * 40).toString(16).padStart(2, "0")}, transparent 55%)` }} />;
  }
  if (type === "firelight") {
    return <AbsoluteFill style={{ zIndex: 22, pointerEvents: "none" }}>
      {[0, 1, 2].map((k) => {
        const local = (frame - k * 16) % 60;
        const rr = interpolate(local, [0, 60], [60, 520]);
        const op = interpolate(local, [0, 12, 60], [0, 0.3, 0]);
        return <div key={k} style={{ position: "absolute", left: cx - rr, top: height * 0.72 - rr, width: rr * 2, height: rr * 2, borderRadius: "50%", border: "2px solid rgba(255,150,60,1)", opacity: op }} />;
      })}
    </AbsoluteFill>;
  }
  if (type === "icons") {
    const items = ["🧴", "🍫", "🧼", "🦟"];
    return <div style={{ position: "absolute", right: "6%", top: "24%", display: "flex", flexDirection: "column", gap: 18, zIndex: 22 }}>
      {items.map((it, i) => <div key={i} style={{ fontSize: 70, opacity: interpolate(frame, [i * 8 + 4, i * 8 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateX(${interpolate(frame, [i * 8 + 4, i * 8 + 16], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" }}>{it}</div>)}
    </div>;
  }
  if (type === "risk_eq") {
    return <div style={{ position: "absolute", left: "50%", top: "22%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 24, zIndex: 22, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <span style={{ fontFamily: BEBAS, fontSize: 48, color }}>CALORIES</span>
      <span style={{ fontSize: 54 }}>⚖️</span>
      <span style={{ fontFamily: BEBAS, fontSize: 48, color: "#ff8a6a" }}>INJURY?</span>
    </div>;
  }
  if (type === "popgraph") {
    const bars = [0.35, 0.5, 0.7, 0.95];
    return <svg width={width} height={height} style={{ position: "absolute", zIndex: 22 }}>
      {bars.map((b, i) => {
        const h = interpolate(frame, [i * 6 + 4, i * 6 + 18], [0, b * 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <rect key={i} x={width * 0.7 + i * 70} y={height * 0.72 - h} width={48} height={h} fill={color} opacity={0.85} />;
      })}
      <text x={width * 0.7} y={height * 0.78} fontFamily={BEBAS} fontSize={30} fill="#fff">PREY ↑</text>
    </svg>;
  }
  if (type === "caltag") {
    return <div style={{ position: "absolute", right: "8%", top: "30%", zIndex: 22, fontFamily: BEBAS, fontSize: 40, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "8px 18px", border: `2px solid ${color}`, opacity: interpolate(frame, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>PAID IN CALORIES</div>;
  }
  if (type === "sleepbars") {
    return <svg width={width} height={height} style={{ position: "absolute", zIndex: 22 }}>
      {[["HUMAN", 0.45, color], ["LION", 0.85, "#ff8a6a"]].map((row, i) => {
        const w = interpolate(frame, [i * 8 + 4, i * 8 + 20], [0, (row[1] as number) * 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <g key={i}>
          <rect x={width * 0.12} y={height * 0.34 + i * 70} width={w} height={42} fill={row[2] as string} opacity={0.85} />
          <text x={width * 0.12} y={height * 0.34 + i * 70 - 8} fontFamily={BEBAS} fontSize={28} fill="#fff">{row[0] as string} SLEEP DEPTH</text>
        </g>;
      })}
    </svg>;
  }
  return null;
};
