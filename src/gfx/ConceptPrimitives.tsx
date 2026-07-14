import type {ReactNode} from "react";
import {COLORS, FONT} from "../theme";

export const SAFE = {left: 110, right: 1810, top: 70, bottom: 940} as const;
export const TITLE_MIN_PX = 48;
export const BODY_MIN_PX = 38;
export const OBJECT_LABEL_MAX_Y = 900;

export type ArtProps = {
  labels: string[];
  accent: string;
  p: number;
  at: (index: number, total?: number) => number;
};

export const Artboard: React.FC<{children: ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: "absolute", inset: 0, fontFamily: FONT}}>
    {children}
  </svg>
);

export const Tag: React.FC<{x: number; y: number; text?: string; accent?: string; width?: number; p?: number}> = ({x, y, text = "", accent = COLORS.ochre, width, p = 1}) => {
  const w = width ?? Math.max(170, Math.min(410, text.length * 22 + 48));
  return <g opacity={p} transform={`translate(0 ${(1-p)*14})`}>
    <rect x={x-w/2} y={y-28} width={w} height="56" rx="14" fill={COLORS.cave} stroke={accent} strokeWidth="4"/>
    <text x={x} y={y+13} fill={COLORS.ivory} fontSize={BODY_MIN_PX} fontWeight="700" textAnchor="middle">{text}</text>
  </g>;
};

export const Arrow: React.FC<{x1:number;y1:number;x2:number;y2:number;p:number;color?:string;dash?:boolean}> = ({x1,y1,x2,y2,p,color=COLORS.ivory,dash}) => {
  const ex=x1+(x2-x1)*p; const ey=y1+(y2-y1)*p; const a=Math.atan2(y2-y1,x2-x1); const s=18;
  return <g opacity={p}><line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={dash?"16 13":undefined}/>
    <path d={`M${ex-Math.cos(a-.65)*s} ${ey-Math.sin(a-.65)*s} L${ex} ${ey} L${ex-Math.cos(a+.65)*s} ${ey-Math.sin(a+.65)*s}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>
  </g>;
};

export const Drop: React.FC<{x:number;y:number;scale?:number;color?:string;p?:number}> = ({x,y,scale=1,color=COLORS.water,p=1}) => <path opacity={p} transform={`translate(${x} ${y}) scale(${scale})`} d="M0 -27 C22 0 26 15 0 28 C-26 15 -22 0 0 -27Z" fill={color} stroke={COLORS.ivory} strokeWidth="4"/>;
export const Basket: React.FC<{x:number;y:number;p?:number;dry?:boolean}> = ({x,y,p=1,dry}) => <g opacity={p} transform={`translate(${x} ${y}) scale(${.82+.18*p})`}><path d="M-105 -15 Q0 -105 105 -15" fill="none" stroke={COLORS.ivory} strokeWidth="10"/><path d="M-125 -18 Q-105 95 0 105 Q105 95 125 -18Z" fill={dry?COLORS.ochre:"#7E3D34"} stroke={COLORS.ivory} strokeWidth="8"/><path d="M-90 25 H90 M-70 62 H70" stroke={COLORS.cave} strokeWidth="6" opacity=".45"/></g>;
export const Jar: React.FC<{x:number;y:number;p?:number;fill?:string}> = ({x,y,p=1,fill=COLORS.water}) => <g opacity={p} transform={`translate(${x} ${y}) scale(${.8+.2*p})`}><path d="M-58 -95 H58 L76 -55 V82 Q76 115 43 122 H-43 Q-76 115 -76 82 V-55Z" fill={`${fill}88`} stroke={COLORS.ivory} strokeWidth="8"/><path d="M-54 -94 H54" stroke={COLORS.ochre} strokeWidth="14"/></g>;
export const Flame: React.FC<{x:number;y:number;p?:number;scale?:number}> = ({x,y,p=1,scale=1}) => <path opacity={p} transform={`translate(${x} ${y}) scale(${scale})`} d="M0 70 C-60 25 -45 -25 -8 -70 C-8 -25 35 -20 24 -64 C82 -10 62 48 0 70Z" fill={COLORS.rust} stroke={COLORS.ochre} strokeWidth="7"/>;
export const Snow: React.FC<{x:number;y:number;p?:number}> = ({x,y,p=1}) => <g opacity={p} stroke={COLORS.ivory} strokeWidth="7"><path d={`M${x-34} ${y} H${x+34} M${x} ${y-34} V${y+34} M${x-25} ${y-25} L${x+25} ${y+25} M${x+25} ${y-25} L${x-25} ${y+25}`}/></g>;
