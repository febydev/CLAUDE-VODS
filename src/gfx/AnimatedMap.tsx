import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PUNCH, INK, SCI, creamBg, fitFont } from "../theme";
import world from "../world_map.json";

// REAL world map (country polygons, equirectangular). Minimal treatment per direction:
// highlight the relevant country/region with a light LIFT (brighter fill + soft glow) and a
// small marker — no radar pulses, no heavy effects.
const BW = (world as any).w as number;   // 1000
const BH = (world as any).h as number;   // 500
const px = (lon: number) => ((lon + 180) / 360) * BW;
const py = (lat: number) => ((90 - lat) / 180) * BH;

const LAND = "#C4CFDA";
const LAND_HI = "#3B82F6";
const OCEAN = "rgba(190,210,228,0.35)";

// location -> highlight box [minLon,minLat,maxLon,maxLat] + marker [lat,lon]
const LOC: Record<string, { box: number[]; marker: number[] }> = {
  subSaharanAfrica: { box: [-18, -35, 52, 16], marker: [1, 20] },
  andaman:          { box: [70, 4, 100, 30],   marker: [11.7, 92.7] },
  australia:        { box: [112, -40, 155, -10], marker: [-25, 134] },
};
const SCATTER: number[][] = [ [40,-100],[50,10],[35,108],[-10,-55],[9,8],[-25,134],[22,79],[60,100] ];

function viewBoxFor(box: number[], pad = 0.35) {
  let x0 = px(box[0]), x1 = px(box[2]);
  let y0 = py(box[3]), y1 = py(box[1]);
  let w = x1 - x0, h = y1 - y0;
  x0 -= w * pad; y0 -= h * pad; w *= 1 + 2 * pad; h *= 1 + 2 * pad;
  const target = 16 / 9;
  if (w / h < target) { const nw = h * target; x0 -= (nw - w) / 2; w = nw; }
  else { const nh = w / target; y0 -= (nh - h) / 2; h = nh; }
  return [x0, y0, w, h];
}
function inBox(c: number[], box: number[]) {
  const lon = (c[0] / BW) * 360 - 180;
  const lat = 90 - (c[1] / BH) * 180;
  return lon >= box[0] && lon <= box[2] && lat >= box[1] && lat <= box[3];
}

export const AnimatedMap: React.FC<{
  mode: "point" | "worldDots" | "globalScatter"; location?: string; counterTo?: number;
  counterPrefix?: string; label: string; glow?: string;
}> = ({ mode, location, counterTo, counterPrefix = "", label, glow = LAND_HI }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const loc = location ? LOC[location] : null;
  const worldVB = [0, 40, BW, BW * (9 / 16)]; // full world, 16:9 crop centered vertically
  const vbArr = mode === "point" && loc ? viewBoxFor(loc.box) : worldVB;
  const zoom = interpolate(frame, [0, 40], [1.035, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = vbArr[0] + vbArr[2] / 2, cy = vbArr[1] + vbArr[3] / 2;
  const vw = vbArr[2] * zoom, vh = vbArr[3] * zoom;
  const vb = `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`;

  const mapIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const hiIn = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const count = counterTo ? Math.round(interpolate(frame, [18, 46], [0, counterTo], { easing: PUNCH, extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 0;
  const markerR = (vw / width) * 9;
  const labelSize = fitFont(label, 74);

  return (
    <AbsoluteFill style={{ background: creamBg(glow) }}>
      <svg width="100%" height="100%" viewBox={vb} preserveAspectRatio="xMidYMid slice" style={{ opacity: mapIn }}>
        <rect x={-200} y={-200} width={BW + 400} height={BH + 400} fill={OCEAN} />
        {(world as any).countries.map((co: any, i: number) => {
          const hi = mode === "point" && loc ? inBox(co.c, loc.box) : false;
          return co.p.map((ring: number[][], j: number) => {
            const d = "M " + ring.map((p) => `${p[0]} ${p[1]}`).join(" L ") + " Z";
            return (
              <path key={`${i}-${j}`} d={d}
                fill={hi ? glow : LAND}
                fillOpacity={hi ? 0.4 + 0.5 * hiIn : 1}
                stroke={hi ? glow : "#AEB9C6"}
                strokeWidth={hi ? 1.2 : 0.5}
                style={hi ? { filter: `drop-shadow(0 0 ${2.5 * hiIn}px ${glow})` } : undefined} />
            );
          });
        })}

        {/* worldDots: subtle dots on real country centroids (7,000 groups) */}
        {mode === "worldDots" && (world as any).countries.map((co: any, i: number) => {
          const o = interpolate(frame, [10 + (i % 40) * 0.4, 18 + (i % 40) * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <circle key={`d${i}`} cx={co.c[0]} cy={co.c[1]} r={markerR * 0.42} fill={glow} opacity={o * 0.8} />;
        })}

        {/* globalScatter: a few real-coord markers (<100 cases) */}
        {mode === "globalScatter" && SCATTER.map((m, i) => {
          const o = interpolate(frame, [12 + i * 3, 20 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <circle key={`s${i}`} cx={px(m[1])} cy={py(m[0])} r={markerR * 0.7} fill={glow} opacity={o} style={{ filter: `drop-shadow(0 0 ${markerR * 0.6}px ${glow})` }} />;
        })}

        {/* single location marker — soft static halo + dot (minimal) */}
        {mode === "point" && loc && (
          <g>
            <circle cx={px(loc.marker[1])} cy={py(loc.marker[0])} r={markerR * 2.4} fill={glow} opacity={0.16 * hiIn} />
            <circle cx={px(loc.marker[1])} cy={py(loc.marker[0])} r={markerR * hiIn} fill={glow} style={{ filter: `drop-shadow(0 0 ${markerR * 0.8}px ${glow})` }} />
          </g>
        )}
      </svg>

      {/* counter */}
      {counterTo ? (
        <div style={{ position: "absolute", top: "16%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
          fontSize: 88, color: INK, opacity: interpolate(frame, [18, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: "0 3px 14px rgba(255,255,255,0.9)" }}>{counterPrefix}{count.toLocaleString("en-US")}</div>
      ) : null}

      <div style={{ position: "absolute", bottom: "8%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
        fontSize: labelSize, color: INK, letterSpacing: 1, textShadow: "0 3px 16px rgba(255,255,255,0.92)",
        opacity: interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{label}</div>
    </AbsoluteFill>
  );
};
