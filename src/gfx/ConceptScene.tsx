import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {Scene} from "../types";
import {COLORS, EASE, FONT, fitFont} from "../theme";

const AncientFigure: React.FC<{x: number; flip?: boolean; accent: string; progress: number}> = ({x, flip, accent, progress}) => (
  <svg viewBox="0 0 260 430" style={{position: "absolute", left: x, bottom: 50, width: 250, height: 420,
    transform: `scaleX(${flip ? -1 : 1}) translateY(${(1-progress)*35}px)`, opacity: progress}}>
    <circle cx="130" cy="70" r="52" fill={COLORS.ivory} stroke={COLORS.charcoal} strokeWidth="8" />
    <path d="M88 54 Q130 8 175 48" fill="none" stroke={COLORS.charcoal} strokeWidth="18" strokeLinecap="round" />
    <circle cx="112" cy="68" r="6" fill={COLORS.charcoal}/><circle cx="150" cy="68" r="6" fill={COLORS.charcoal}/>
    <path d="M112 94 Q132 108 154 92" fill="none" stroke={COLORS.charcoal} strokeWidth="5" strokeLinecap="round" />
    <path d="M130 124 L130 286 M130 165 L66 236 M130 165 L208 214 M130 286 L78 392 M130 286 L188 392" fill="none" stroke={COLORS.charcoal} strokeWidth="12" strokeLinecap="round" />
    <path d="M112 132 L180 176 L148 285 L88 250 Z" fill={accent} stroke={COLORS.charcoal} strokeWidth="7" opacity=".92" />
  </svg>
);

const Arrow: React.FC<{x1:number;y1:number;x2:number;y2:number;progress:number;color:string}> = ({x1,y1,x2,y2,progress,color}) => (
  <g opacity={progress}><line x1={x1} y1={y1} x2={x1+(x2-x1)*progress} y2={y1+(y2-y1)*progress} stroke={color} strokeWidth="8" strokeLinecap="round"/>
  <path d={`M${x2-18} ${y2-14} L${x2} ${y2} L${x2-18} ${y2+14}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></g>
);

export const ConceptScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const labels = scene.content.labels ?? [];
  const form = scene.content.form ?? 0;
  const family = form % 10;
  const variant = Math.floor(form / 10);
  const buildEnd = Math.max(18, Math.min(52, scene.duration - 10));
  const enter = spring({frame, fps, durationInFrames: Math.min(22, buildEnd), config: {damping: 18, stiffness: 120}});
  const build = interpolate(frame, [4, buildEnd], [0, 1], {easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const cx = variant === 1 ? 1080 : variant === 2 ? 970 : 1030;
  const cy = 565;
  const labelProgress = (index:number) => {
    const spread = Math.max(1, labels.length - 1);
    const requestedStart = 7 + (buildEnd - 15) * (index / spread);
    const start = Math.min(buildEnd - 1, requestedStart);
    const end = Math.max(start + 1, Math.min(buildEnd, start + 8));
    return interpolate(frame, [start, end], [0,1], {extrapolateLeft:"clamp", extrapolateRight:"clamp"});
  };
  let body: React.ReactNode;

  if (family === 0 || family === 6) {
    const radii = family === 0 ? [92,150,210] : [100,170,245];
    body = <svg width="1920" height="1080" style={{position:"absolute"}}>
      {radii.map((r,i)=><circle key={r} cx={cx} cy={cy} r={r*build} fill={i===0?`${scene.accent}28`:"none"}
        stroke={i%2?COLORS.ivory:scene.accent} strokeWidth={family===6?7:11} strokeDasharray={family===6&&i>0?"18 13":undefined} opacity={.95-i*.2}/>) }
      <path d={`M${cx} ${cy-265} A265 265 0 ${variant?1:0} 1 ${cx+230} ${cy+132}`} fill="none" stroke={scene.accent} strokeWidth="14" strokeLinecap="round" strokeDasharray="920" strokeDashoffset={920*(1-build)}/>
    </svg>;
  } else if (family === 1 || family === 9) {
    const count=Math.max(3,labels.length); const points=new Array(count).fill(0).map((_,i)=>({x:cx-300+i*(600/(count-1)),y:family===9?cy+Math.sin(i/count*Math.PI*2)*150:cy+(i%2?70:-70)}));
    body=<svg width="1920" height="1080" style={{position:"absolute"}}>
      <path d={points.map((p,i)=>`${i?"L":"M"}${p.x} ${p.y}`).join(" ")} fill="none" stroke={scene.accent} strokeWidth="10" strokeDasharray="1200" strokeDashoffset={1200*(1-build)} strokeLinecap="round"/>
      {points.map((p,i)=><g key={i} opacity={labelProgress(i)}><circle cx={p.x} cy={p.y} r={34+variant*7} fill={i===count-1?scene.accent:COLORS.ivory} stroke={COLORS.charcoal} strokeWidth="7"/></g>)}
    </svg>;
  } else if (family === 2) {
    const count=Math.min(4,Math.max(2,labels.length));
    body=<div style={{position:"absolute",left:560,top:345,width:940,height:430,display:"grid",gridTemplateColumns:`repeat(${count},1fr)`,gap:18}}>
      {new Array(count).fill(0).map((_,i)=><div key={i} style={{height:`${210+(i%2)*110}px`,alignSelf:"end",borderRadius:variant===2?"50% 50% 18px 18px":"26px 26px 10px 10px",background:`linear-gradient(180deg,${scene.accent},${COLORS.charcoal})`,border:`5px solid ${COLORS.ivory}`,opacity:labelProgress(i),transform:`scaleY(${.2+.8*build})`,transformOrigin:"bottom"}}/>)}
    </div>;
  } else if (family === 3) {
    body=<div style={{position:"absolute",left:570,top:330,width:940,height:470,display:"grid",gridTemplateColumns:`repeat(${variant===2?3:4},1fr)`,gap:14,transform:`rotate(${variant===1?-3:variant===2?3:0}deg)`}}>
      {new Array(12).fill(0).map((_,i)=><div key={i} style={{border:`4px solid ${i%3===0?scene.accent:COLORS.ivory}88`,background:i<Math.round(build*12)?`${scene.accent}${i%2?"55":"2a"}`:"rgba(247,229,188,.04)",borderRadius:i%3===0?60:12,transform:`scale(${i<build*12?1:.7})`}}/>)}
    </div>;
  } else if (family === 4) {
    body=<svg width="1920" height="1080" style={{position:"absolute"}}>
      <path d={`M510 720 Q680 ${460-variant*40} 840 690 Q1050 ${370+variant*50} 1250 680 Q1400 520 1540 720 Z`} fill={`${scene.accent}55`} stroke={scene.accent} strokeWidth="8" opacity={build}/>
      <path d="M500 720 H1550" stroke={COLORS.ivory} strokeWidth="9"/><circle cx={730+variant*260} cy={470} r={76*build} fill={variant===2?COLORS.ivory:COLORS.ochre}/>
      {new Array(5).fill(0).map((_,i)=><path key={i} d={`M${650+i*175} 710 Q${690+i*175} ${620-i%2*60} ${730+i*175} 710`} fill="none" stroke={COLORS.ivory} strokeWidth="10" opacity={labelProgress(i)}/>) }
    </svg>;
  } else if (family === 5) {
    body=<div style={{position:"absolute",left:650,top:315,width:760,height:500}}>
      {labels.slice(0,5).map((_,i)=><div key={i} style={{position:"absolute",left:(variant===1?i*50:(i%2)*90),top:i*82,width:620-i*35,height:72,borderRadius:variant===2?36:12,background:i===labels.length-1?scene.accent:`rgba(247,229,188,${.12+i*.05})`,border:`4px solid ${i%2?scene.accent:COLORS.ivory}`,transform:`translateY(${(1-labelProgress(i))*45}px)`,opacity:labelProgress(i),boxShadow:"0 18px 28px rgba(0,0,0,.18)"}}/>)}
    </div>;
  } else if (family === 7) {
    body=<svg width="1920" height="1080" style={{position:"absolute"}}>
      {labels.slice(0,4).map((_,i)=>{const y=390+i*115;return <g key={i} opacity={labelProgress(i)}><rect x={560} y={y} width={230} height={76} rx={variant===2?38:12} fill={`${scene.accent}55`} stroke={COLORS.ivory} strokeWidth="5"/><Arrow x1={810} y1={y+38} x2={1270} y2={cy} progress={build} color={scene.accent}/></g>})}
      <circle cx="1345" cy={cy} r={115*build} fill={scene.accent} stroke={COLORS.ivory} strokeWidth="8"/>
    </svg>;
  } else {
    body=<svg width="1920" height="1080" style={{position:"absolute"}}><line x1="690" y1="560" x2="1370" y2="560" stroke={COLORS.ivory} strokeWidth="13" transform={`rotate(${(variant-1)*7} 1030 560)`}/><circle cx="1030" cy="575" r="42" fill={scene.accent}/><path d="M720 560 L650 740 L790 740 Z M1340 560 L1270 740 L1410 740 Z" fill={`${scene.accent}88`} stroke={COLORS.ivory} strokeWidth="7" opacity={build}/></svg>;
  }

  return <AbsoluteFill style={{overflow:"hidden",background:`radial-gradient(ellipse at ${variant===1?"62%":"54%"} 44%, ${scene.accent}36 0%, ${COLORS.charcoal} 48%, ${COLORS.cave} 100%)`,fontFamily:FONT}}>
    <AbsoluteFill style={{opacity:.18,backgroundImage:"linear-gradient(rgba(247,229,188,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(247,229,188,.08) 1px,transparent 1px)",backgroundSize:"54px 54px",transform:`translate(${(frame%54)-54}px,0)`}}/>
    <div style={{position:"absolute",left:210,right:210,top:88,textAlign:"center",fontSize:fitFont(scene.content.title??"",64),lineHeight:1.04,fontWeight:700,color:COLORS.ivory,letterSpacing:1.5,opacity:enter,textShadow:"0 5px 18px rgba(0,0,0,.45)"}}>{scene.content.title}</div>
    {body}
    <AncientFigure x={variant===1?1420:120} flip={variant===1} accent={scene.accent} progress={enter}/>
    <div style={{position:"absolute",left:variant===1?180:520,right:variant===1?520:180,bottom:92,display:"flex",justifyContent:"center",gap:18,flexWrap:"wrap"}}>
      {labels.map((label,i)=><div key={label} style={{padding:"15px 25px",borderRadius:i%2?999:12,background:i===labels.length-1?scene.accent:"rgba(247,229,188,.12)",border:`3px solid ${i===labels.length-1?scene.accent:COLORS.ivory}aa`,fontSize:fitFont(label,30,330),fontWeight:700,color:COLORS.ivory,opacity:labelProgress(i),transform:`translateY(${(1-labelProgress(i))*20}px)`,whiteSpace:"nowrap"}}>{label}</div>)}
    </div>
  </AbsoluteFill>;
};