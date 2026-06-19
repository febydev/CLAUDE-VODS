import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, BEBAS } from "../theme";
import { NumberCounter } from "./NumberCounter";

// Shared node list for the "2 million years of hunting" timeline.
const NODES = [
  { label: "WE HUNTED THEM", img: 23 },
  { label: "MAMMOTHS", img: 24 },
  { label: "SABER-TOOTHED CATS", img: 25 },
  { label: "MEGAFAUNA, WHOLE CONTINENTS", img: 93 },
  { label: "WOLVES \u2014 NEAR EXTINCTION", img: 26 },
];
export const TIMELINE_INDEX: Record<number, number> = { 23: 0, 24: 1, 25: 2, 93: 3, 26: 4 };

export const Timeline: React.FC<{ active: number; color: string; title?: string; counter?: any }> = ({
  active, color, title, counter,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const n = NODES.length;
  const x0 = width * 0.1, x1 = width * 0.9, y = height * 0.56;
  const nodeX = (i: number) => x0 + (x1 - x0) * (i / (n - 1));
  const lineTo = interpolate(frame, [6, 26], [nodeX(Math.max(0, active - 1)), nodeX(active)], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1a1206 0%, #060402 78%)" }}>
      {title ? (
        <div style={{
          position: "absolute", top: "14%", width: "100%", textAlign: "center",
          fontFamily: ANTON, fontSize: 70, color: "#fff", letterSpacing: 2, textShadow: `0 0 30px ${color}`,
          opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
        }}>{title}</div>
      ) : null}

      {counter ? (
        <div style={{ position: "absolute", top: "26%", width: "100%", display: "flex", justifyContent: "center" }}>
          <NumberCounter stat={counter} color={color} big={false} />
        </div>
      ) : null}

      <svg width={width} height={height} style={{ position: "absolute" }}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
        <line x1={x0} y1={y} x2={lineTo} y2={y} stroke={color} strokeWidth={5} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>

      {NODES.map((node, i) => {
        const revealed = i <= active;
        if (!revealed) return null;
        const isActive = i === active;
        const pop = isActive ? spring({ frame: frame - 14, fps, config: { damping: 11 } }) : 1;
        const x = nodeX(i);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
            <div style={{
              width: isActive ? 26 : 16, height: isActive ? 26 : 16, borderRadius: "50%",
              background: color, transform: `scale(${pop})`, boxShadow: `0 0 22px ${color}`,
              marginLeft: isActive ? -5 : 0, marginTop: isActive ? -5 : 0,
            }} />
            {isActive && (
              <div style={{ position: "absolute", left: "50%", top: -150, transform: "translateX(-50%)", textAlign: "center", opacity: pop }}>
                <Img src={staticFile(`images/P${node.img}.png`)} style={{
                  width: 200, height: 116, objectFit: "cover", borderRadius: 8,
                  border: `2px solid ${color}`, boxShadow: `0 8px 30px rgba(0,0,0,0.6)`,
                  filter: "saturate(0.9) brightness(0.95)",
                }} />
              </div>
            )}
            <div style={{
              position: "absolute", left: "50%", top: 26, transform: "translateX(-50%)",
              fontFamily: BEBAS, fontSize: isActive ? 38 : 26, letterSpacing: 2,
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)", whiteSpace: "nowrap",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}>{node.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
