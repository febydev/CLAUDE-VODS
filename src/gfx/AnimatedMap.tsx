import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MG_BG, fitFont } from "../theme";
import world from "../world_map.json";

// REAL world map (country polygons, equirectangular) on warm dark-earth. Minimal treatment:
// zoom to the region, highlight the country with a soft ochre LIFT + one small marker. No pulses.
const BW = (world as any).w as number;
const BH = (world as any).h as number;
const px = (lon: number) => ((lon + 180) / 360) * BW;
const py = (lat: number) => ((90 - lat) / 180) * BH;

const LAND = "#4a3626";
const LAND_STROKE = "#5f4630";

const LOC: Record<string, { box: number[]; marker: number[] }> = {
  anatolia: { box: [22, 33, 46, 43], marker: [37.67, 32.83] }, // Çatalhöyük, central Turkey
};

function viewBoxFor(box: number[], pad = 0.4) {
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
  mode: "point"; location: string; counterTo?: number; counterPrefix?: string; label: string; glow?: string;
}> = ({ location, counterTo, counterPrefix = "", label, glow = "#E0A458" }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const loc = LOC[location] || LOC.anatolia;

  const vbArr = viewBoxFor(loc.box);
  const zoom = interpolate(frame, [0, 50], [1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = vbArr[0] + vbArr[2] / 2, cy = vbArr[1] + vbArr[3] / 2;
  const vw = vbArr[2] * zoom, vh = vbArr[3] * zoom;
  const vb = `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`;

  const mapIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const hiIn = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const markerR = (vw / width) * 8;
  const labelSize = fitFont(label, 74);

  return (
    <AbsoluteFill style={{ background: MG_BG }}>
      <svg width="100%" height="100%" viewBox={vb} preserveAspectRatio="xMidYMid slice" style={{ opacity: mapIn }}>
        <rect x={-200} y={-200} width={BW + 400} height={BH + 400} fill="rgba(20,12,7,0)" />
        {(world as any).countries.map((co: any, i: number) => {
          const hi = inBox(co.c, loc.box);
          return co.p.map((ring: number[][], j: number) => {
            const d = "M " + ring.map((p) => `${p[0]} ${p[1]}`).join(" L ") + " Z";
            return (
              <path key={`${i}-${j}`} d={d}
                fill={hi ? glow : LAND}
                fillOpacity={hi ? 0.35 + 0.5 * hiIn : 1}
                stroke={hi ? glow : LAND_STROKE}
                strokeWidth={hi ? 1.2 : 0.5}
                style={hi ? { filter: `drop-shadow(0 0 ${3 * hiIn}px ${glow})` } : undefined} />
            );
          });
        })}
        <g>
          <circle cx={px(loc.marker[1])} cy={py(loc.marker[0])} r={markerR * 2.6} fill={glow} opacity={0.18 * hiIn} />
          <circle cx={px(loc.marker[1])} cy={py(loc.marker[0])} r={markerR * hiIn} fill={glow} style={{ filter: `drop-shadow(0 0 ${markerR}px ${glow})` }} />
        </g>
      </svg>

      {counterTo ? (
        <div style={{ position: "absolute", top: "15%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
          fontSize: 84, color: "#FFF3DE", opacity: interpolate(frame, [18, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>{counterPrefix}{Math.round(interpolate(frame, [18, 46], [0, counterTo], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })).toLocaleString("en-US")}</div>
      ) : null}

      <div style={{ position: "absolute", bottom: "9%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900,
        fontSize: labelSize, color: "#FFF3DE", letterSpacing: 1, textShadow: `0 0 26px ${glow}66, 0 3px 16px rgba(0,0,0,0.7)`,
        opacity: interpolate(frame, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{label}</div>
    </AbsoluteFill>
  );
};
