import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS, INTER } from "../theme";
import { NumberCounter } from "./NumberCounter";
import world from "../world_map.json";

type Region = "africa" | "india" | "amazon" | "us_east" | "tsavo" | "champawat";

// region box [minLon, minLat, maxLon, maxLat], marker [lat, lon]
const REG: Record<Region, { box: number[]; marker: number[] }> = {
  africa:    { box: [-20, -37, 54, 38],  marker: [2, 21] },
  india:     { box: [66, 5, 92, 33],     marker: [22, 79] },
  amazon:    { box: [-80, -20, -44, 10], marker: [-4, -62] },
  us_east:   { box: [-104, 24, -66, 50], marker: [38, -80] },
  tsavo:     { box: [31, -6, 43, 6],     marker: [-2.98, 38.46] },
  champawat: { box: [66, 5, 92, 36],     marker: [29.3, 80.1] },
};
const SEQ: Region[] = ["africa", "india", "amazon"];
const SEQ_VIEW = [-112, -40, 150, 58]; // wide world view for the 3-continent reveal

const BW = (world as any).w as number; // 1000
const BH = (world as any).h as number; // 500
const px = (lon: number) => (lon + 180) / 360 * BW;
const py = (lat: number) => (90 - lat) / 180 * BH;

function viewBoxFor(box: number[], pad = 0.28) {
  let x0 = px(box[0]), x1 = px(box[2]);
  let y0 = py(box[3]), y1 = py(box[1]); // maxLat -> top
  let w = x1 - x0, h = y1 - y0;
  x0 -= w * pad; y0 -= h * pad; w *= (1 + 2 * pad); h *= (1 + 2 * pad);
  // enforce 16:9
  const target = 16 / 9;
  if (w / h < target) { const nw = h * target; x0 -= (nw - w) / 2; w = nw; }
  else { const nh = w / target; y0 -= (nh - h) / 2; h = nh; }
  return [x0, y0, w, h];
}

function inBox(c: number[], box: number[]) {
  // c is [bx,by] base coords; box is lon/lat
  const lon = c[0] / BW * 360 - 180;
  const lat = 90 - c[1] / BH * 180;
  return lon >= box[0] && lon <= box[2] && lat >= box[1] && lat <= box[3];
}

export const NetflixMap: React.FC<{
  region: Region; label: string; sub?: string; seqStep?: number; color: string; counter?: any;
}> = ({ region, label, sub, seqStep = 1, color, counter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isSeq = SEQ.includes(region);

  const targetVB = isSeq ? viewBoxFor(SEQ_VIEW, 0.05) : viewBoxFor(REG[region].box);
  // gentle camera push (zoom in ~6%) over the scene
  const zoom = interpolate(frame, [0, 40], [1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cxv = targetVB[0] + targetVB[2] / 2, cyv = targetVB[1] + targetVB[3] / 2;
  const vw = targetVB[2] * zoom, vh = targetVB[3] * zoom;
  const vx = cxv - vw / 2, vy = cyv - vh / 2;

  const highlightBoxes = isSeq ? SEQ.slice(0, seqStep).map((r) => REG[r].box) : [REG[region].box];
  const isHi = (c: number[]) => highlightBoxes.some((b) => inBox(c, b));

  const markerUnit = vw / 1920; // svg units per screen px
  const activePins: Region[] = isSeq ? SEQ.slice(0, seqStep) : [region];
  const newest = activePins[activePins.length - 1];

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #0c2438 0%, #06121d 80%)" }}>
      <svg width="100%" height="100%" viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid slice">
        {/* ocean */}
        <rect x={-200} y={-200} width={BW + 400} height={BH + 400} fill="#0a2030" />
        {/* graticule */}
        {new Array(13).fill(0).map((_, i) => (
          <line key={`v${i}`} x1={i / 12 * BW} y1={0} x2={i / 12 * BW} y2={BH} stroke="#1d4258" strokeWidth={0.6} />
        ))}
        {new Array(7).fill(0).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i / 6 * BH} x2={BW} y2={i / 6 * BH} stroke="#1d4258" strokeWidth={0.6} />
        ))}
        {/* countries */}
        {(world as any).countries.map((co: any, i: number) => {
          const hi = isHi(co.c);
          return co.p.map((ring: number[][], j: number) => {
            const d = "M " + ring.map((p) => `${p[0]} ${p[1]}`).join(" L ") + " Z";
            return (
              <path key={`${i}-${j}`} d={d}
                fill={hi ? color : "#16384a"}
                fillOpacity={hi ? 0.55 : 1}
                stroke={hi ? color : "#2c5870"}
                strokeWidth={hi ? 1.1 : 0.5}
                style={hi ? { filter: `drop-shadow(0 0 3px ${color})` } : undefined} />
            );
          });
        })}
        {/* arcs for the sequence */}
        {isSeq && seqStep > 1 && SEQ.slice(0, seqStep).map((r, i) => {
          if (i === 0) return null;
          const a = REG[SEQ[i - 1]].marker, b = REG[r].marker;
          const x1 = px(a[1]), y1 = py(a[0]), x2 = px(b[1]), y2 = py(b[0]);
          const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 40;
          const dash = interpolate(frame, [14, 34], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <path key={i} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none"
            stroke={color} strokeWidth={1.6 * markerUnit * 1.5} strokeDasharray={400}
            strokeDashoffset={dash * 400} opacity={0.9} />;
        })}
        {/* markers */}
        {activePins.map((r) => {
          const m = REG[r].marker; const mx = px(m[1]), my = py(m[0]);
          const isNew = r === newest;
          const appear = isNew ? interpolate(frame, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
          const rings = isNew ? frame - 16 : 9999;
          const pinR = 9 * markerUnit;
          return (
            <g key={r}>
              {[0, 1].map((k) => {
                const local = rings - k * 16;
                if (local < 0) return null;
                const rr = interpolate(local % 48, [0, 48], [pinR, pinR * 9]);
                const op = interpolate(local % 48, [0, 48], [0.7, 0]);
                return <circle key={k} cx={mx} cy={my} r={rr} fill="none" stroke={color} strokeWidth={markerUnit * 1.5} opacity={op} />;
              })}
              <circle cx={mx} cy={my} r={pinR * appear} fill={color} style={{ filter: `drop-shadow(0 0 ${6 * markerUnit}px ${color})` }} />
            </g>
          );
        })}
      </svg>

      {/* label card (screen space) */}
      <div style={{
        position: "absolute", left: "7%", top: "14%",
        opacity: interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [20, 34], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        textShadow: "0 2px 14px rgba(0,0,0,0.9)",
      }}>
        <div style={{ fontFamily: BEBAS, fontSize: 82, color: "#fff", letterSpacing: 3, textShadow: `0 0 26px ${color}` }}>{label}</div>
        {sub ? <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color }}>{sub}</div> : null}
      </div>

      {counter ? (
        <div style={{ position: "absolute", right: "8%", bottom: "16%" }}>
          <NumberCounter stat={counter} color={color} big={false} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
