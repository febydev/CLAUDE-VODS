import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './scenes.json';
import rawGraphics from './graphics.json';

type Shot = typeof data.shots[number];
type Graphic = {layers: Record<string,string>; component:string; labels:string[]; headline:string};
const graphics = rawGraphics as unknown as Record<string,Graphic>;
const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease = Easing.bezier(.22,.61,.36,1);
const unit=(f:number,a:number,b:number)=>interpolate(f,[a,Math.max(a+1,b)],[0,1],{...clamp,easing:ease});

const GraphicScene:React.FC<{shot:Shot; handle:number}>=({shot,handle})=>{
  const frame=useCurrentFrame()-handle;const graphic=graphics[shot.id];
  const layers=graphic.layers;
  return <AbsoluteFill style={{background:'#F7E5BC'}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-label={graphic.headline}>
      <style>{`.iran-code text{font-family:IranImpact,sans-serif}.iran-code text.body{font-family:IranBody,sans-serif}`}</style>
      <g className="iran-code">
        {Object.entries(layers).map(([id,markup])=>{
          let p=1;let dy=0;let dx=0;
          if(id==='headline'){p=unit(frame,0,6);dy=12*(1-p);}
          if(id.startsWith('item-')){
            const i=Number(id.split('-')[1])-1;
            p=unit(frame,Math.round((.32+i*.22)*25),Math.round((.54+i*.22)*25));
            dy=14*(1-p);
          }
          if(id==='connections') p=unit(frame,8,Math.round((.54+.22*(graphic.labels.length-1))*25));
          if(id==='character-anchor') dx=Math.sin(Math.min(1,frame/shot.duration)*Math.PI)*3;
          return <g key={id} opacity={p} transform={`translate(${dx} ${dy})`} dangerouslySetInnerHTML={{__html:markup}}/>;
        })}
      </g>
    </svg>
    <Img src={staticFile('paper-grain.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.035,mixBlendMode:'multiply',pointerEvents:'none'}}/>
  </AbsoluteFill>;
};

const Illustration:React.FC<{shot:Shot;handle:number}>=({shot,handle})=>{
  const frame=useCurrentFrame()-handle;
  const p=interpolate(frame,[0,shot.duration-1],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
  // Use the supplied flat-art fallback values; optional object masks are not available.
  let scale=1.02+p*.06;let x=-p*1920*.008;let y=0;
  if(shot.motion==='PARALLAX-TRAVEL'){scale=1.04+p*.04;x=(p*2-1)*1920*.014;}
  if(shot.motion==='RESTRAINED-PUSH'){scale=1.02+p*.035;x=0;y=(1-p)*1080*.005;}
  if(shot.motion==='BRACKET-REVEAL'){scale=1.02+p*.03;x=0;}
  if(shot.motion==='CONNECTION-PAN'){scale=1.04+p*.03;x=(p*2-1)*1920*.01;}
  if(shot.motion==='CLUSTER-REVEAL'){scale=1.02+p*.04;x=0;}
  if(shot.motion==='PAIR-REVEAL'){scale=1.02+p*.035;x=-p*1920*.005;}
  if(shot.motion==='HIERARCHY-PUSH'){scale=1.02+p*.04;x=0;y=(1-p)*1080*.005;}
  if(shot.motion==='TIMELINE-DRIFT'){scale=1.04+p*.03;x=(p*2-1)*1920*.007;}
  return <AbsoluteFill style={{overflow:'hidden',background:'#EADCB9'}}>
    <Img src={staticFile(shot.file)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${x}px,${y}px) scale(${scale})`,filter:'saturate(1.02) contrast(1.015)'}}/>
    {shot.type==='VOX' && frame>=shot.overlayStart && frame<shot.overlayEnd ?
      <Img src={staticFile(shot.overlay)} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:unit(frame,shot.overlayStart,shot.overlayFull),transform:`translateY(${8*(1-unit(frame,shot.overlayStart,shot.overlayFull))}px)`}}/>:null}
  </AbsoluteFill>;
};

const Picture:React.FC<{shot:Shot;handle:number}>=({shot,handle})=>shot.type==='CODE'?<GraphicScene shot={shot} handle={handle}/>:<Illustration shot={shot} handle={handle}/>;

// Six-frame paragraph dissolves are centered on the existing cut, using three-frame handles.
// Audio and title cues keep their exact master-timeline positions.
const VisualSequence:React.FC<{shot:Shot; dissolve:boolean}>=({shot,dissolve})=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{opacity:dissolve?unit(frame,0,6):1}}><Picture shot={shot} handle={dissolve?3:0}/></AbsoluteFill>;
};

export const Main:React.FC=()=> <AbsoluteFill style={{background:'#241B16',overflow:'hidden'}}>
  {data.shots.map((shot,i)=>{
    // Three-frame handles center the dissolve on the recorded cut. The picture's local clock and
    // all audio/title offsets compensate for the handle, keeping their original master frames.
    const incoming=shot.dissolve && i>0;
    const outgoing=i<data.shots.length-1 && data.shots[i+1].dissolve;
    const handle=incoming?3:0;
    return <Sequence key={shot.id} from={shot.start-handle} durationInFrames={shot.duration+handle+(outgoing?3:0)} name={`${shot.id} ${shot.type}`} layout="none">
      <VisualSequence shot={shot} dissolve={incoming}/>
    </Sequence>;
  })}
  <Img src={staticFile('film-grain.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.027,mixBlendMode:'soft-light',pointerEvents:'none'}}/>
  <Audio src={staticFile('master.flac')}/>
</AbsoluteFill>;
