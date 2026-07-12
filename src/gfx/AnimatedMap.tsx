import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, INK, SCI, creamBg } from "../theme";

// Clean "weather-map" world: schematic continents in correct relative positions (real,
// recognizable geography — never abstract dots for the map itself). A glow marker drops in
// onto the location and pulses; optional population counter ticks to its number.
const LAND = "#9DB4C8";
const LOC: Record<string, [number, number]> = {
  subSaharanAfrica: [55, 40], andaman: [70.5, 30], australia: [85, 46],
};
// continent blobs on a 100 x 60 map field
const CONTINENTS: [number, number, number, number][] = [
  [17, 16, 12, 9],   // N America
  [28, 40, 8, 12],   // S America
  [50, 16, 8, 6],    // Europe
  [53, 34, 11, 13],  // Africa
  [72, 17, 16, 11],  // Asia
  [66, 30, 6, 5],    // India
  [85, 46, 8, 6],    // Australia
];

export const AnimatedMap: React.FC<{
  mode: "point" | "worldDots" | "globalScatter"; location?: string; counterTo?: number;
  counterPrefix?: string; dots?: number; label: string; glow?: string;
}> = ({ mode, location, counterTo, counterPrefix = "", dots = 7000, label, glow = SCI }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const mapW = width * 0.78, mapH = mapW * 0.6;
  const ox = (width - mapW) / 2, oy = height * 0.2;
  const px = (nx: number) => ox + (nx / 100) * mapW;
  const py = (ny: number) => oy + (ny / 60) * mapH;

  const mapIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const [lx, ly] = location ? LOC[location] : [50, 30];
  const drop = spring({ frame: frame - 12, fps, config: { damping: 12, mass: 0.6, stiffness: 150 } });
  const markerY = interpolate(drop, [0, 1], [-30, 0]);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 12);
  const count = counterTo ? Math.round(interpolate(frame, [16, 46], [0, counterTo], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 0;

  const nDots = mode === "worldDots" ? 260 : mode === "globalScatter" ? 11 : 0;

  return (
    <AbsoluteFill style={{ background: creamBg(glow) }}>
      <svg width={width} height={height} style={{ position: "absolute", opacity: mapIn }}>
        {CONTINENTS.map((c, i) => (
          <ellipse key={i} cx={px(c[0])} cy={py(c[1])} rx={(c[2] / 100) * mapW} ry={(c[3] / 60) * mapH} fill={LAND} opacity={0.9} />
        ))}
      </svg>

      {/* scattered dots mode */}
      {nDots > 0 && new Array(nDots).fill(0).map((_, i) => {
        const ci = Math.floor(random(`c${i}`) * CONTINENTS.length);
        const c = CONTINENTS[ci];
        const nx = c[0] + (random(`x${i}`) - 0.5) * c[2] * 1.6;
        const ny = c[1] + (random(`y${i}`) - 0.5) * c[3] * 1.6;
        const o = interpolate(frame, [10 + i * 0.05, 16 + i * 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: px(nx), top: py(ny), width: 7, height: 7, borderRadius: "50%", background: glow, opacity: o * 0.85, boxShadow: `0 0 6px ${glow}` }} />;
      })}

      {/* single location marker */}
      {mode === "point" && (
        <>
          <div style={{ position: "absolute", left: px(lx), top: py(ly), width: 300 * pulse * 0.9, height: 300 * pulse * 0.9, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `2px solid ${glow}`, opacity: (1 - pulse) * 0.5 }} />
          <div style={{ position: "absolute", left: px(lx), top: py(ly) + markerY, width: 26, height: 26, transform: "translate(-50%,-50%)", borderRadius: "50%", background: glow, opacity: drop, boxShadow: `0 0 20px ${glow}` }} />
          {counterTo ? (
            <div style={{ position: "absolute", left: px(lx) + 26, top: py(ly) - 46, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, opacity: drop }}>{counterPrefix}{count.toLocaleString("en-US")}</div>
          ) : null}
        </>
      )}

      <div style={{ position: "absolute", bottom: "10%", width: "100%", textAlign: "center",
        fontFamily: FONT, fontWeight: 900, fontSize: 72, color: INK,
        opacity: interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{label}</div>
    </AbsoluteFill>
  );
};
