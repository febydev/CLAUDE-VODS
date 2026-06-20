import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";

const rise = (f: number, d: number) => interpolate(f, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Diagram: React.FC<{ type: string; accent: string }> = ({ type, accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2, cy = height * 0.52;
  const bg = "radial-gradient(ellipse at 50% 42%, #132a36 0%, #08151d 74%)";

  const Title: React.FC<{ t: string }> = ({ t }) => (
    <div style={{ position: "absolute", top: "13%", width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800,
      fontSize: 52, color: "#fff", letterSpacing: 1, textShadow: `0 0 24px ${accent}66`, opacity: rise(frame, 2) }}>{t}</div>
  );
  const Lbl: React.FC<{ x: number; y: number; t: string; d?: number; size?: number; c?: string }> = ({ x, y, t, d = 0, size = 30, c = "#fff" }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 600,
      fontSize: size, letterSpacing: 1, color: c, opacity: rise(frame, d), whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{t}</div>
  );
  const Dot: React.FC<{ x: number; y: number; r?: number; c?: string; d?: number }> = ({ x, y, r = 16, c = accent, d = 0 }) => {
    const s = spring({ frame: frame - d, fps, config: { damping: 12 } });
    return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: c, transform: `scale(${s})`, boxShadow: `0 0 18px ${c}` }} />;
  };

  let title = ""; let body: React.ReactNode = null;

  const wave = (yBase: number, dir: number) => {
    const o = rise(frame, 8);
    return <svg width={width} height={height} style={{ position: "absolute" }}>
      {[0,1,2].map(k => { const ph = (frame/10 + k); const yy = yBase + Math.sin(ph)*8;
        return <path key={k} d={`M ${cx-dir*40} ${yy} q ${dir*70} -40 ${dir*150} 0`} fill="none" stroke={accent} strokeWidth={4} opacity={o*(0.8-k*0.2)} style={{filter:`drop-shadow(0 0 5px ${accent})`}} />; })}
    </svg>;
  };

  if (type === "breath") {
    title = "TWO PEOPLE EXCHANGE BREATH";
    body = <>{wave(cy, 1)}
      <Dot x={cx - 150} y={cy} r={40} c="rgba(255,200,190,0.9)" d={4} />
      <Dot x={cx + 150} y={cy} r={40} c="rgba(255,200,190,0.9)" d={8} />
      <Lbl x={cx} y={cy + 150} t="breath \u00b7 warmth \u00b7 air" d={20} c={accent} /></>;
  } else if (type === "spread") {
    title = "AN INSTINCT WOULD BE EVERYWHERE";
    body = <>{new Array(40).fill(0).map((_,i)=>{const col=i%10,row=Math.floor(i/10);const x=width*0.16+col*((width*0.68)/9);const y=cy-130+row*90;const lit=rise(frame,4+i*1.2);return <div key={i} style={{position:"absolute",left:x-10,top:y-10,width:20,height:20,borderRadius:"50%",background:accent,opacity:0.25+0.55*lit,boxShadow:lit>0.5?`0 0 12px ${accent}`:"none"}}/>;})}
      <Lbl x={cx} y={cy+180} t="but it isn't" d={44} size={34} c="#fff" /></>;
  } else if (type === "threetheories") {
    title = "THREE THEORIES";
    const cards = [["1","FOOD"],["2","SMELL"],["3","THE TEST"]];
    body = <>{cards.map((c,i)=>{const s=spring({frame:frame-(8+i*10),fps,config:{damping:13}});const x=width*(0.26+i*0.24);return <div key={i} style={{position:"absolute",left:x,top:cy,transform:`translate(-50%,-50%) scale(${s})`,width:280,height:200,borderRadius:20,background:"rgba(255,255,255,0.06)",border:`2px solid ${accent}`,boxShadow:`0 0 26px ${accent}44`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontFamily:FONT,fontWeight:800,fontSize:60,color:accent}}>{c[0]}</div>
      <div style={{fontFamily:FONT,fontWeight:700,fontSize:38,color:"#fff"}}>{c[1]}</div></div>;})}</>;
  } else if (type === "smell") {
    title = "WHAT LOOKS LIKE A KISS \u2014 IS SMELL";
    body = <>{wave(cy-20,1)}<Dot x={cx} y={cy+40} r={46} c="rgba(255,205,195,0.95)" d={4} />
      <Lbl x={cx} y={cy+170} t="noses press \u00b7 inhale" d={20} c={accent} /></>;
  } else if (type === "infoflood") {
    title = "YOU ARE FLOODED WITH INFORMATION";
    const tags=["scent","breath","chemistry","health","mood"];
    body = <><Dot x={cx} y={cy} r={50} c="rgba(255,205,195,0.95)" d={2} />
      {tags.map((t,i)=>{const ang=(i/tags.length)*Math.PI*2;const prog=rise(frame,6+i*5);const dist=interpolate(prog,[0,1],[320,150]);const x=cx+Math.cos(ang)*dist;const y=cy+Math.sin(ang)*dist*0.7;return <div key={i} style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%)",fontFamily:FONT,fontWeight:600,fontSize:30,color:accent,opacity:prog,background:"rgba(22,11,18,0.7)",padding:"6px 16px",borderRadius:20,border:`1px solid ${accent}66`}}>{t}</div>;})}</>;
  } else if (type === "signals") {
    title = "SIGNALS YOU'RE NOT AWARE OF";
    body = <>{new Array(16).fill(0).map((_,i)=>{const o=rise(frame,4+i*2);const x=cx+Math.cos(i)*((i%4+1)*70);const y=cy+Math.sin(i*1.7)*((i%3+1)*60);return <div key={i} style={{position:"absolute",left:x,top:y,fontFamily:FONT,fontSize:34,color:accent,opacity:o*0.8}}>?</div>;})}
      <Lbl x={cx} y={cy} t="chemical signals" d={2} size={40} /></>;
  } else if (type === "immune") {
    title = "READING THE IMMUNE SYSTEM";
    const match = rise(frame, 26);
    body = <><Dot x={cx-180} y={cy} r={54} c="#ff9ab0" d={4} /><Dot x={cx+180} y={cy} r={54} c={accent} d={8} />
      <Lbl x={cx-180} y={cy+90} t="your genes" d={14} /><Lbl x={cx+180} y={cy+90} t="their genes" d={18} />
      <div style={{position:"absolute",left:cx,top:cy,transform:"translate(-50%,-50%)",fontFamily:FONT,fontWeight:800,fontSize:64,color:"#fff",opacity:match,textShadow:`0 0 24px ${accent}`}}>MHC</div>
      <Lbl x={cx} y={cy+150} t="immune compatibility" d={30} c={accent} /></>;
  } else if (type === "salivadata") {
    title = "SALIVA CARRIES DATA";
    const items=["hormones","health signals","body chemistry"];
    body = <><path d={`M ${cx} ${cy-120} q -46 70 0 110 q 46 -40 0 -110`} fill="rgba(150,205,230,0.5)" stroke={accent} strokeWidth={3} style={{}} transform="" />
      <svg width={width} height={height} style={{position:"absolute"}}><path d={`M ${cx} ${cy-120} q -46 70 0 110 q 46 -40 0 -110 Z`} fill="rgba(150,205,230,0.35)" stroke={accent} strokeWidth={3} /></svg>
      {items.map((t,i)=>{const o=rise(frame,16+i*8);return <div key={i} style={{position:"absolute",left:cx+120,top:cy-60+i*60,fontFamily:FONT,fontWeight:600,fontSize:34,color:"#fff",opacity:o}}>{t}</div>;})}</>;
  } else if (type === "compatibility") {
    title = "AN UNCONSCIOUS COMPATIBILITY CHECK";
    const meter = interpolate(frame,[16,46],[0,0.82],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
    body = <><Dot x={cx-200} y={cy-40} r={48} c="#ff9ab0" d={4} /><Dot x={cx+200} y={cy-40} r={48} c={accent} d={8} />
      <svg width={width} height={height} style={{position:"absolute"}}><rect x={cx-240} y={cy+70} width={480} height={34} rx={17} fill="rgba(255,255,255,0.1)" /><rect x={cx-240} y={cy+70} width={480*meter} height={34} rx={17} fill={accent} style={{filter:`drop-shadow(0 0 10px ${accent})`}} /></svg>
      <Lbl x={cx} y={cy+150} t="MATCH" d={30} c={accent} size={34} /></>;
  } else if (type === "lips") {
    title = "YOUR LIPS \u2014 HYPERSENSITIVE";
    body = <><svg width={width} height={height} style={{position:"absolute"}}><path d={`M ${cx-160} ${cy} q 160 -90 320 0 q -160 90 -320 0 Z`} fill="rgba(255,120,150,0.5)" stroke={accent} strokeWidth={5} /><line x1={cx-160} y1={cy} x2={cx+160} y2={cy} stroke={accent} strokeWidth={3} /></svg>
      <Lbl x={cx} y={cy+150} t="more nerve endings than your skin" d={18} c="#fff" /></>;
  } else if (type === "nerves") {
    title = "PACKED WITH NERVE ENDINGS";
    body = <>{new Array(60).fill(0).map((_,i)=>{const o=rise(frame,2+i*0.6);const x=cx-220+ (i%20)*23;const y=cy-30+Math.floor(i/20)*36;return <div key={i} style={{position:"absolute",left:x,top:y,width:8,height:8,borderRadius:"50%",background:accent,opacity:o,boxShadow:`0 0 6px ${accent}`}}/>;})}
      <Lbl x={cx} y={cy+150} t="far denser than most skin" d={40} c="#fff" /></>;
  } else if (type === "brain") {
    title = "A HUGE PART OF YOUR BRAIN";
    body = <><svg width={width} height={height} style={{position:"absolute"}}><ellipse cx={cx} cy={cy} rx={200} ry={150} fill="rgba(255,255,255,0.06)" stroke={accent} strokeWidth={4} /><path d={`M ${cx-120} ${cy} q 60 -60 120 0 q 60 60 120 0`} fill="none" stroke={accent} strokeWidth={2} opacity={0.5} /></svg>
      <Dot x={cx-60} y={cy-20} r={46} c={accent} d={16} /><Lbl x={cx-60} y={cy-20} t="lips" d={26} size={26} c="#160b12" /></>;
  } else if (type === "brainlight") {
    title = "LIGHTING UP AT ONCE";
    const pulse = 0.5+0.5*Math.sin(frame/6);
    body = <><svg width={width} height={height} style={{position:"absolute"}}><ellipse cx={cx} cy={cy} rx={200} ry={150} fill={`rgba(255,77,109,${0.15+0.25*pulse})`} stroke={accent} strokeWidth={4} style={{filter:`drop-shadow(0 0 ${20+pulse*30}px ${accent})`}} /></svg>
      <Lbl x={cx} y={cy+200} t="an enormous region, all at once" d={10} c="#fff" /></>;
  } else if (type === "dopamine" || type === "oxytocin" || type === "cortisol") {
    const map: any = { dopamine: ["DOPAMINE","reward \u00b7 craving","\u2191","#ff9ab0"], oxytocin: ["OXYTOCIN","bonding \u00b7 attachment","\u2191",accent], cortisol: ["CORTISOL","stress","\u2193","#9ad0ff"] };
    const [name, sub, arrow, col] = map[type];
    title = "A FLOOD OF CHEMISTRY";
    const s = spring({ frame: frame - 6, fps, config: { damping: 12 } });
    body = <><div style={{position:"absolute",left:cx,top:cy-20,transform:`translate(-50%,-50%) scale(${s})`,width:230,height:230,borderRadius:"50%",background:`radial-gradient(circle,${col}cc,${col}33)`,border:`3px solid ${col}`,boxShadow:`0 0 40px ${col}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:800,fontSize:90,color:"#160b12"}}>{arrow}</div>
      <Lbl x={cx} y={cy+150} t={name} d={14} size={56} c="#fff" /><Lbl x={cx} y={cy+205} t={sub} d={22} size={32} c={col} /></>;
  } else {
    title = type.toUpperCase();
  }

  return (<AbsoluteFill style={{ background: bg }}><Title t={title} />{body}</AbsoluteFill>);
};
