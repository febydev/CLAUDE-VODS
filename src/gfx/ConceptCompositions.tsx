import {COLORS} from "../theme";
import {Arrow, Artboard, Basket, Drop, Flame, Jar, Snow, Tag, type ArtProps} from "./ConceptPrimitives";

// form-0: berry trust dial
const BerryTrustDial: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="1040" cy="535" r={250*p} fill={`${accent}18`} stroke={COLORS.ivory} strokeWidth="10"/>
  <path d="M850 695 A250 250 0 1 1 1232 695" fill="none" stroke={accent} strokeWidth="25" strokeDasharray="980" strokeDashoffset={980*(1-p)} strokeLinecap="round"/>
  {[[-150,-85,"#9D423D"],[0,-195,"#78372F"],[155,-82,"#554638"]].map(([dx,dy,c],i)=><g key={i} opacity={at(i,4)} transform={`translate(${1040+Number(dx)} ${535+Number(dy)})`}><circle r="45" fill={String(c)} stroke={COLORS.ivory} strokeWidth="7"/><path d="M0 -42 Q18 -75 38 -55" fill="none" stroke={COLORS.leaf} strokeWidth="9"/></g>)}
  <line x1="1040" y1="535" x2={1040+190*Math.cos(-2.65+3.8*p)} y2={535+190*Math.sin(-2.65+3.8*p)} stroke={COLORS.ochre} strokeWidth="14" strokeLinecap="round"/>
  <circle cx="1040" cy="535" r="28" fill={COLORS.ochre}/>
  <g opacity={at(1,4)} transform="translate(475 535)"><circle cy="-120" r="45" fill={COLORS.ivory}/><path d="M0 -72 L-35 60 L45 125 M-18 2 L122 60 L210 0 M-28 55 L-118 160" fill="none" stroke={COLORS.ivory} strokeWidth="18" strokeLinecap="round"/><circle cx="210" r="22" fill={accent}/></g>
  <Tag x={820} y={790} text={labels[0]} accent={accent} p={at(0,4)}/><Tag x={1040} y={850} text={labels[1]} accent={accent} p={at(1,4)}/><Tag x={1280} y={790} text={labels[2]} accent={accent} p={at(2,4)}/><Tag x={1510} y={520} text={labels[3]} accent={COLORS.rust} p={at(3,4)}/>
</Artboard>;

// form-1: harvest bridge and droplets
const HarvestBridge: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M250 735 Q520 620 760 720 M1160 720 Q1420 615 1690 735" fill="none" stroke={COLORS.leaf} strokeWidth="35"/>
  <path d="M700 700 Q960 500 1220 700" fill="none" stroke={COLORS.ivory} strokeWidth="20" strokeDasharray="900" strokeDashoffset={900*(1-p)}/>
  <Basket x={500} y={590} p={at(0,3)}/><Basket x={1390} y={610} p={at(2,3)} dry/>
  {[0,1,2,3].map((i)=><Drop key={i} x={680+i*85} y={520+Math.sin(i)*70+130*p} scale={.7} p={at(1,3)}/>) }
  <g opacity={at(2,3)} transform={`translate(${850+380*p} 560)`}><path d="M-65 20 L0 -70 L65 20 V95 H-65Z" fill={accent} stroke={COLORS.ivory} strokeWidth="8"/><path d="M-45 10 Q0 -20 45 10" fill="none" stroke={COLORS.cave} strokeWidth="8"/></g>
  <Tag x={500} y={820} text={labels[0]} accent={accent} p={at(0,3)}/><Tag x={950} y={700} text={labels[1]} accent={COLORS.water} p={at(1,3)}/><Tag x={1430} y={820} text={labels[2]} accent={accent} p={at(2,3)}/>
</Artboard>;

// form-2: dual activity hourglasses
const DualActivityHourglasses: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  {[650,1270].map((x,j)=><g key={x} opacity={at(j,3)}><path d={`M${x-145} 315 H${x+145} L${x+70} 515 L${x+145} 715 H${x-145} L${x-70} 515Z`} fill={`${j?COLORS.stone:accent}22`} stroke={COLORS.ivory} strokeWidth="10"/><path d={`M${x-92} 350 Q${x} ${445+(j?30:95)*p} ${x+92} 350 M${x-92} 680 Q${x} ${600-(j?12:55)*p} ${x+92} 680`} fill={j?COLORS.water:accent} opacity=".8"/></g>)}
  {Array.from({length:18},(_,i)=><circle key={i} cx={650+(i%5-2)*25} cy={375+(i*47*p)%280} r="9" fill={accent} opacity={at(0,3)}/>) }
  {Array.from({length:10},(_,i)=><circle key={i} cx={1270+(i%4-1.5)*28} cy={385+(i*19*p)%245} r="9" fill={COLORS.water} opacity={at(1,3)}/>) }
  <Tag x={650} y={800} text={labels[0]} accent={accent} p={at(0,3)}/><Tag x={1270} y={800} text={labels[1]} accent={COLORS.water} p={at(1,3)}/><Tag x={960} y={875} text={labels[2]} accent={COLORS.ivory} p={at(2,3)}/>
</Artboard>;

// form-3: four-condition hearth table
const FourConditionHearth: React.FC<ArtProps> = ({labels,accent,at}) => <Artboard>
  <Flame x={960} y={550} p={at(0,4)} scale={1.25}/>
  {[[540,360,true,true],[1380,360,true,false],[540,700,false,true],[1380,700,false,false]].map(([x,y,warm,damp],i)=><g key={i} opacity={at(i,4)}><rect x={Number(x)-210} y={Number(y)-105} width="420" height="210" rx="28" fill={warm?`${accent}50`:`${COLORS.stone}55`} stroke={COLORS.ivory} strokeWidth="7"/>{warm?<path d={`M${Number(x)-80} ${Number(y)+25} q35 -80 70 0 q35 -80 70 0`} fill="none" stroke={COLORS.ochre} strokeWidth="9"/>:<Snow x={Number(x)} y={Number(y)-5}/>} {damp?<Drop x={Number(x)+110} y={Number(y)-5} scale={.65}/>:<path d={`M${Number(x)+65} ${Number(y)-15} h95`} stroke={COLORS.ochre} strokeWidth="10"/>}<Tag x={Number(x)} y={Number(y)+68} text={labels[i]} accent={warm?accent:COLORS.stone}/></g>)}
</Artboard>;

// form-4: moisture decision trail
const MoistureDecisionTrail: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M260 550 C470 300 650 760 850 510 S1250 310 1650 560" fill="none" stroke={COLORS.ivory} strokeWidth="12" strokeDasharray="1900" strokeDashoffset={1900*(1-p)}/>
  {[[290,535],[610,505],[925,500],[1240,465]].map(([x,y],i)=><g key={i} opacity={at(i,4)}><circle cx={x} cy={y} r="78" fill={`${i===3?COLORS.rust:accent}bb`} stroke={COLORS.ivory} strokeWidth="8"/>{i===0?<Drop x={x} y={y-8} scale={.75}/>:i===1?<path d={`M${x} ${y-40} v45 l34 26`} stroke={COLORS.ivory} strokeWidth="10" fill="none"/>:i===2?<path d={`M${x-42} ${y} q42 -45 84 0 q-42 45 -84 0`} fill="none" stroke={COLORS.ivory} strokeWidth="9"/>:<path d={`M${x-40} ${y} h80 M${x} ${y-40} v80`} stroke={COLORS.ivory} strokeWidth="10"/>}<Tag x={x} y={y+125} text={labels[i]} accent={i===3?COLORS.rust:accent}/></g>)}
  <g opacity={at(3,4)}><circle cx="1630" cy="560" r="105" fill="none" stroke={COLORS.ochre} strokeWidth="12"/><path d="M1570 560 L1615 605 L1700 510" fill="none" stroke={COLORS.ivory} strokeWidth="15"/></g>
</Artboard>;

// form-5: method-pressure constellation
const MethodPressureConstellation: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="960" cy="520" r={125*p} fill={`${accent}88`} stroke={COLORS.ivory} strokeWidth="10"/><text x="960" y="535" textAnchor="middle" fill={COLORS.ivory} fontSize="38" fontWeight="700">FOOD</text>
  {[[410,330],[760,760],[1160,760],[1510,330],[1460,650]].map(([x,y],i)=><g key={i} opacity={at(i,5)}><Arrow x1={960} y1={520} x2={x} y2={y} p={p} color={i%2?COLORS.water:accent}/><circle cx={x} cy={y} r="78" fill={COLORS.charcoal} stroke={i%2?COLORS.water:accent} strokeWidth="8"/><Tag x={x} y={y} text={labels[i]} accent={i%2?COLORS.water:accent}/></g>)}
</Artboard>;

// form-6: drying landscape
const DryingLandscape: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="420" cy="335" r={90*p} fill={COLORS.ochre} stroke={COLORS.ivory} strokeWidth="8"/><Tag x={420} y={470} text={labels[0]} accent={COLORS.ochre} p={at(0,4)}/>
  {[0,1,2].map(i=><path key={i} d={`M560 ${360+i*52} C760 ${300+i*45} 870 ${440+i*28} 1050 ${370+i*40}`} fill="none" stroke={COLORS.ivory} strokeWidth="9" strokeDasharray="22 15" strokeDashoffset={300*(1-p)}/>) }<Tag x={810} y={515} text={labels[1]} accent={COLORS.water} p={at(1,4)}/>
  <path d="M250 730 Q540 640 800 720 T1340 700 T1720 735" fill="none" stroke={COLORS.leaf} strokeWidth="42"/>
  {[1050,1190,1330,1470].map((x,i)=><g key={x} opacity={at(2,4)} transform={`rotate(${-12+i*7} ${x} 650)`}><rect x={x-65} y="610" width="130" height="42" rx="21" fill={accent} stroke={COLORS.ivory} strokeWidth="6"/></g>)}<Tag x={1260} y={790} text={labels[2]} accent={accent} p={at(2,4)}/>
  {[0,1,2].map(i=><Drop key={i} x={1180+i*135} y={560-120*p-i*15} scale={.6} p={at(3,4)}/>)}<Tag x={1510} y={500} text={labels[3]} accent={COLORS.water} p={at(3,4)}/>
</Artboard>;

// form-7: weather interruption
const WeatherInterruption: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <rect x="220" y="330" width="500" height="360" rx="55" fill={`${COLORS.ochre}28`} stroke={COLORS.ochre} strokeWidth="9"/><path d="M300 590 C410 450 520 650 650 455" fill="none" stroke={COLORS.ivory} strokeWidth="12" strokeDasharray="25 18"/><Tag x={470} y={760} text={labels[0]} accent={COLORS.ochre} p={at(0,4)}/>
  <g opacity={at(1,4)} transform={`translate(0 ${-40+40*p})`}><path d="M775 385 Q850 285 925 385 Q1020 285 1110 410 Q1070 485 790 465Z" fill={COLORS.stone} stroke={COLORS.ivory} strokeWidth="8"/>{[830,920,1010,1080].map(x=><Drop key={x} x={x} y={540} scale={.65}/>) }<Tag x={945} y={640} text={labels[1]} accent={accent}/></g>
  <rect x="1190" y="330" width="500" height="360" rx="55" fill={`${COLORS.water}25`} stroke={COLORS.water} strokeWidth="9" strokeDasharray="18 13"/><path d="M1270 445 Q1390 375 1510 445 T1640 445 M1270 535 Q1390 465 1510 535 T1640 535" fill="none" stroke={COLORS.water} strokeWidth="14"/><Tag x={1440} y={760} text={labels[2]} accent={COLORS.water} p={at(2,4)}/>
  <Tag x={960} y={850} text={labels[3]} accent={COLORS.ivory} p={at(3,4)}/>
</Artboard>;

// form-8: portable bundle balance
const PortableBundle: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <line x1="390" y1="620" x2="1530" y2={620-90*p} stroke={COLORS.ivory} strokeWidth="18" strokeLinecap="round"/><circle cx="960" cy="640" r="42" fill={accent}/><path d="M880 850 L960 640 L1040 850Z" fill={`${accent}88`} stroke={COLORS.ivory} strokeWidth="8"/>
  <Basket x={530} y={505} p={at(0,3)}/>{[0,1,2].map(i=><Drop key={i} x={720+i*90} y={460+110*p+i*25} scale={.6} p={at(0,3)}/>)}<Tag x={520} y={800} text={labels[0]} accent={COLORS.water} p={at(0,3)}/>
  <g opacity={at(1,3)} transform={`translate(1380 ${480-70*p})`}><path d="M-85 25 L0 -85 L85 25 V115 H-85Z" fill={accent} stroke={COLORS.ivory} strokeWidth="9"/><path d="M-58 0 Q0 -32 58 0" fill="none" stroke={COLORS.cave} strokeWidth="8"/></g><Tag x={1380} y={760} text={labels[1]} accent={accent} p={at(1,3)}/><Tag x={1380} y={850} text={labels[2]} accent={COLORS.ochre} p={at(2,3)}/>
</Artboard>;

// form-9: twin smoke racks
const TwinSmokeRacks: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  {[520,1370].map((x,j)=><g key={x} opacity={at(j,5)}><path d={`M${x-160} 690 V330 H${x+160} V690 M${x-180} 690 H${x+180}`} fill="none" stroke={COLORS.ivory} strokeWidth="13"/><path d={`M${x-110} 420 H${x+110} M${x-110} 520 H${x+110}`} stroke={accent} strokeWidth="16"/>{j===0&&<><Flame x={x} y={760} scale={.7}/>{[0,1,2].map(i=><path key={i} d={`M${x-65+i*65} 665 Q${x-120+i*75} ${560-80*p} ${x-30+i*45} 470`} fill="none" stroke={COLORS.stone} strokeWidth="18" opacity=".7"/>)}</>}<Tag x={x} y={280} text={labels[j]} accent={j?COLORS.water:accent}/></g>)}
  <Arrow x1={720} y1={760} x2={1180} y2={760} p={at(2,5)} color={COLORS.ochre}/><Tag x={820} y={700} text={labels[2]} accent={COLORS.ochre} p={at(2,5)}/><Tag x={960} y={845} text={labels[3]} accent={COLORS.ivory} p={at(3,5)}/><Arrow x1={1200} y1={845} x2={1500} y2={805} p={at(4,5)} color={accent}/><Tag x={1630} y={805} text={labels[4]} accent={accent} p={at(4,5)}/>
</Artboard>;

// form-10: fire distance zones
const FireDistanceZones: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <Flame x={300} y={650} p={p} scale={1.25}/>
  <path d="M360 700 A690 690 0 0 0 1620 700" fill="none" stroke={COLORS.ivory} strokeWidth="14" strokeDasharray="1900" strokeDashoffset={1900*(1-p)}/>
  {[[600,COLORS.rust],[1020,COLORS.ochre],[1480,COLORS.stone]].map(([x,c],i)=><g key={i} opacity={at(i,3)}><rect x={Number(x)-100} y="410" width="200" height="210" fill={`${c}66`} stroke={String(c)} strokeWidth="9"/><path d={`M${Number(x)-70} 460 H${Number(x)+70} M${Number(x)-70} 530 H${Number(x)+70}`} stroke={COLORS.ivory} strokeWidth="13"/><Tag x={Number(x)} y={700} text={labels[i]} accent={String(c)}/></g>)}
</Artboard>;

// form-11: smoke shield deconstruction
const SmokeShieldDeconstruction: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <g opacity={1-p*.35}><path d="M280 520 Q500 280 720 520 V700 Q500 835 280 700Z" fill={`${COLORS.stone}70`} stroke={COLORS.ivory} strokeWidth="12"/><path d="M390 430 L490 565 L445 665 M620 430 L535 555 L590 705" fill="none" stroke={COLORS.rust} strokeWidth="12"/></g><Tag x={500} y={825} text={labels[0]} accent={COLORS.rust} p={at(0,4)}/>
  <Arrow x1={740} y1={560} x2={940} y2={560} p={p} color={accent}/>
  {[[1040,390],[1330,560],[1600,730]].map(([x,y],i)=><g key={i} opacity={at(i+1,4)}><circle cx={x} cy={y} r="95" fill={`${accent}55`} stroke={COLORS.ivory} strokeWidth="8"/>{i===0?<path d={`M${x-45} ${y} h90`} stroke={COLORS.ochre} strokeWidth="16"/>:i===1?<path d={`M${x-42} ${y+18} l28 -58 l24 48 l32 -72`} fill="none" stroke={COLORS.ivory} strokeWidth="12"/>:<path d={`M${x-42} ${y} l30 35 l65 -78`} fill="none" stroke={COLORS.ivory} strokeWidth="13"/>}<Tag x={x} y={y+145} text={labels[i+1]} accent={accent}/></g>)}
</Artboard>;

// form-12: salt access routes
const SaltAccessRoutes: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M180 720 Q390 510 610 650 Q820 790 990 560 Q1190 340 1390 570 Q1540 700 1740 520" fill={`${COLORS.leaf}55`} stroke={COLORS.ivory} strokeWidth="9"/>
  {[[330,540],[690,690],[1120,470],[1500,590]].map(([x,y],i)=><g key={i} opacity={at(i,4)}><circle cx={x} cy={y} r="62" fill={i===0?COLORS.water:i===1?COLORS.ivory:i===2?COLORS.stone:accent} stroke={COLORS.charcoal} strokeWidth="8"/><Arrow x1={x} y1={y+65} x2={960} y2={820} p={p} color={accent}/><Tag x={x} y={y-105} text={labels[i]} accent={accent}/></g>)}
  <path d="M800 820 Q960 730 1120 820 L1070 890 H850Z" fill={`${COLORS.ivory}cc`} stroke={accent} strokeWidth="8"/>
</Artboard>;

// form-13: available-water comparison
const AvailableWaterComparison: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <g><line x1="960" y1="275" x2="960" y2="760" stroke={COLORS.ivory} strokeWidth="8"/><circle cx="960" cy="300" r="42" fill={COLORS.stone}/><text x="960" y="315" fill={COLORS.ivory} fontSize="38" fontWeight="700" textAnchor="middle">=</text></g>
  {[[570,0],[1350,1]].map(([x,j])=><g key={j} opacity={at(Number(j),3)}><rect x={Number(x)-235} y="350" width="470" height="380" rx="45" fill={`${Number(j)?accent:COLORS.water}28`} stroke={COLORS.ivory} strokeWidth="8"/>{Array.from({length:Number(j)?7:16},(_,i)=><Drop key={i} x={Number(x)-155+(i%4)*100} y={420+Math.floor(i/4)*78} scale={.45} color={Number(j)?accent:COLORS.water}/>)}<Tag x={Number(x)} y={805} text={labels[Number(j)]} accent={Number(j)?accent:COLORS.water}/></g>)}
  <Tag x={960} y={885} text={labels[2]} accent={accent} p={at(2,3)}/><Arrow x1={780} y1={850} x2={1140} y2={850} p={p} color={accent}/>
</Artboard>;

// form-14: handling lifecycle
const HandlingLifecycle: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M340 530 C520 260 840 260 960 520 C1080 780 1400 780 1580 520" fill="none" stroke={COLORS.ivory} strokeWidth="12" strokeDasharray="1800" strokeDashoffset={1800*(1-p)}/>
  {[[350,520],[730,390],[1120,650],[1560,520]].map(([x,y],i)=><g key={i} opacity={at(i,4)}><circle cx={x} cy={y} r="92" fill={`${i===2?COLORS.water:accent}66`} stroke={i===2?COLORS.water:COLORS.ivory} strokeWidth="9"/>{i===0?<path d={`M${x-38} ${y+25} H${x+38} V${y-30} H${x-38}Z`} fill="none" stroke={COLORS.ivory} strokeWidth="9"/>:i===1?<path d={`M${x-45} ${y-20} L${x+45} ${y+20} M${x-45} ${y+20} L${x+45} ${y-20}`} stroke={COLORS.ivory} strokeWidth="11"/>:i===2?<Drop x={x} y={y}/>:<path d={`M${x-48} ${y} q48 -52 96 0 q-48 52 -96 0`} fill="none" stroke={COLORS.ivory} strokeWidth="10"/>}<Tag x={x} y={y+145} text={labels[i]} accent={i===2?COLORS.water:accent}/></g>)}
</Artboard>;

// form-15: living fermentation vessel
const FermentationVessel: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <Jar x={960} y={560} p={at(1,4)} fill={accent}/>{Array.from({length:12},(_,i)=><circle key={i} cx={900+(i%4)*40} cy={500+Math.floor(i/4)*58-24*p} r={9+(i%3)*3} fill={i%2?COLORS.ochre:COLORS.ivory} opacity={at(2,4)}/>) }
  <g opacity={at(0,4)}>{[0,1,2].map(i=><circle key={i} cx={370+i*110} cy={470+i%2*85} r="50" fill={accent} stroke={COLORS.ivory} strokeWidth="7"/>)}<Arrow x1={650} y1={550} x2={820} y2={550} p={p} color={accent}/><Tag x={480} y={690} text={labels[0]} accent={accent}/></g>
  <Tag x={960} y={790} text={labels[1]} accent={accent} p={at(1,4)}/><Tag x={960} y={340} text={labels[2]} accent={COLORS.ochre} p={at(2,4)}/>
  <g opacity={at(3,4)}><Arrow x1={1100} y1={500} x2={1410} y2={410} p={p} color={COLORS.ochre}/><Arrow x1={1100} y1={600} x2={1410} y2={700} p={p} color={COLORS.water}/><circle cx="1510" cy="400" r="72" fill={`${COLORS.ochre}55`} stroke={COLORS.ochre} strokeWidth="8"/><circle cx="1510" cy="710" r="72" fill={`${COLORS.water}55`} stroke={COLORS.water} strokeWidth="8"/><Tag x={1510} y={555} text={labels[3]} accent={accent}/>{[0,1,2].map(i=><circle key={i} cx={1630+i*35} cy={650-i*70} r="18" fill={COLORS.stone}/>)}</g>
</Artboard>;

// form-16: ingredient-to-vessel landscape
const IngredientVesselLandscape: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M180 720 Q420 570 660 700 T1110 690 T1740 700" fill="none" stroke={COLORS.leaf} strokeWidth="35"/>
  <g opacity={at(0,4)}>{[300,420,540].map((x,i)=><path key={x} d={`M${x} ${530-i*20} q45 -65 90 0 q-45 65 -90 0`} fill={i%2?COLORS.ochre:accent} stroke={COLORS.ivory} strokeWidth="7"/>)}<Tag x={450} y={780} text={labels[0]} accent={accent}/></g>
  <Arrow x1={620} y1={570} x2={770} y2={570} p={p} color={accent}/><Jar x={860} y={570} p={at(1,4)} fill={accent}/><Tag x={860} y={800} text={labels[1]} accent={accent} p={at(1,4)}/>
  <path d="M1010 570 H1250" stroke={COLORS.ivory} strokeWidth="8" strokeDasharray="18 14"/><Tag x={1130} y={500} text={labels[2]} accent={COLORS.ochre} p={at(2,4)}/>
  <g opacity={at(3,4)}><Jar x={1380} y={510} fill={COLORS.ochre}/><Jar x={1590} y={620} fill={COLORS.water}/><path d="M1310 690 q70 70 140 0 M1520 800 q70 35 140 0" fill="none" stroke={COLORS.ivory} strokeWidth="10"/><Tag x={1490} y={850} text={labels[3]} accent={accent}/></g>
</Artboard>;

// form-17: evidence certainty lens
const EvidenceCertaintyLens: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="960" cy="535" r={115*p} fill={`${accent}99`} stroke={COLORS.ivory} strokeWidth="10"/><circle cx="960" cy="535" r={245*p} fill="none" stroke={COLORS.ochre} strokeWidth="13"/><circle cx="960" cy="535" r={385*p} fill="none" stroke={COLORS.stone} strokeWidth="10" strokeDasharray="26 18"/>
  <path d="M865 480 Q960 390 1055 480 L1025 610 Q960 660 895 610Z" fill={`${COLORS.ivory}55`} stroke={COLORS.ivory} strokeWidth="7"/>
  <Tag x={960} y={535} text={labels[0]} accent={accent} p={at(0,3)}/><Tag x={960} y={820} text={labels[1]} accent={COLORS.ochre} p={at(1,3)}/><Tag x={1510} y={535} text={labels[2]} accent={COLORS.stone} p={at(2,3)}/>
</Artboard>;

// form-18: artifact evidence assembly
const ArtifactEvidenceAssembly: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <g opacity={at(0,4)}><path d="M300 350 H650 L610 735 Q475 820 340 735Z" fill={`${accent}55`} stroke={COLORS.ivory} strokeWidth="10"/>{Array.from({length:12},(_,i)=><circle key={i} cx={365+(i%4)*75} cy={430+Math.floor(i/4)*90} r="16" fill={COLORS.cave}/>) }<Tag x={475} y={850} text={labels[0]} accent={accent}/></g>
  <g opacity={at(1,4)}>{[0,1,2,3].map(i=><path key={i} d={`M760 ${390+i*90} C850 ${335+i*95} 900 ${445+i*70} 990 ${390+i*90}`} fill="none" stroke={COLORS.ochre} strokeWidth="13"/>)}<Tag x={875} y={800} text={labels[1]} accent={COLORS.ochre}/></g>
  <Arrow x1={1030} y1={540} x2={1250} y2={540} p={p} color={accent}/><g opacity={at(2,4)}><path d="M1320 380 H1690 L1640 720 Q1505 800 1370 720Z" fill={`${COLORS.ivory}38`} stroke={COLORS.ivory} strokeWidth="10"/><circle cx="1505" cy="560" r="100" fill={`${accent}55`} stroke={accent} strokeWidth="8"/><Tag x={1505} y={560} text={labels[2]} accent={accent}/><Tag x={1505} y={850} text={labels[3]} accent={COLORS.stone} p={at(3,4)}/></g>
</Artboard>;

// form-19: generational vessel relay
const GenerationalRelay: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M270 550 C520 260 750 780 960 520 C1170 260 1400 780 1650 500" fill="none" stroke={COLORS.ivory} strokeWidth="12" strokeDasharray="1900" strokeDashoffset={1900*(1-p)}/>
  {[[330,520],[740,600],[1160,430],[1580,520]].map(([x,y],i)=><g key={i} opacity={at(i,4)}><path d={`M${x-115} ${y+60} Q${x-20} ${y-20} ${x+110} ${y+45} M${x-70} ${y+45} L${x-120} ${y-15}`} fill="none" stroke={i%2?COLORS.ochre:COLORS.ivory} strokeWidth="20" strokeLinecap="round"/><Jar x={x} y={y-70} fill={accent}/><Tag x={x} y={y+175} text={labels[i]} accent={accent}/></g>)}
</Artboard>;

// form-20: cave slowdown
const CaveSlowdown: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M180 820 Q250 250 850 260 Q1150 260 1280 520 Q1420 780 1740 820Z" fill={`${COLORS.stone}45`} stroke={COLORS.ivory} strokeWidth="10"/><circle cx="390" cy="410" r="80" fill={COLORS.ochre}/><Tag x={390} y={550} text={labels[0]} accent={COLORS.ochre} p={at(0,3)}/>
  <Arrow x1={540} y1={590} x2={900} y2={590} p={p} color={COLORS.water}/><circle cx="1130" cy="590" r={175*p} fill={`${COLORS.water}25`} stroke={COLORS.water} strokeWidth="11"/><path d={`M1130 590 L${1130+125*Math.cos(-1.5+1.1*p)} ${590+125*Math.sin(-1.5+1.1*p)}`} stroke={COLORS.ivory} strokeWidth="14" strokeLinecap="round"/><Tag x={1130} y={820} text={labels[1]} accent={COLORS.water} p={at(1,3)}/><Tag x={1510} y={590} text={labels[2]} accent={accent} p={at(2,3)}/>
</Artboard>;

// form-21: raised storage cutaway
const RaisedStorageCutaway: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M260 760 H1660" stroke={COLORS.leaf} strokeWidth="38"/><path d="M560 650 V830 M1360 650 V830 M500 650 H1420" stroke={COLORS.ivory} strokeWidth="18"/><path d="M470 380 L960 240 L1450 380 V650 H470Z" fill={`${COLORS.stone}55`} stroke={COLORS.ivory} strokeWidth="10"/>
  <g opacity={at(0,4)}><path d="M350 760 Q430 820 510 760" fill="none" stroke={COLORS.water} strokeWidth="16"/><Arrow x1={430} y1={720} x2={430} y2={835} p={p} color={COLORS.water}/><Tag x={350} y={885} text={labels[0]} accent={COLORS.water}/></g>
  <g opacity={at(1,4)}><path d="M1510 690 q60 -100 120 0 l55 65" fill="none" stroke={COLORS.rust} strokeWidth="18"/><line x1="1470" y1="540" x2="1710" y2="790" stroke={COLORS.rust} strokeWidth="13"/><Tag x={1570} y={480} text={labels[1]} accent={COLORS.rust}/></g>
  <g opacity={at(2,4)}><path d="M700 390 H1220 V560 H700Z" fill={`${accent}55`} stroke={COLORS.ivory} strokeWidth="9"/><Tag x={960} y={470} text={labels[2]} accent={accent}/></g><Tag x={960} y={720} text={labels[3]} accent={COLORS.ochre} p={at(3,4)}/>
</Artboard>;

// form-22: cool-store queue
const CoolStoreQueue: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <rect x="230" y="315" width="1460" height="440" rx="65" fill={`${COLORS.stone}45`} stroke={COLORS.ivory} strokeWidth="10"/>
  {[460,740,1020,1300].map((x,i)=><g key={x} opacity={at(i,4)}><Jar x={x} y={520} p={1} fill={i<2?COLORS.water:accent}/><circle cx={x} cy="420" r="18" fill={COLORS.ochre} opacity={.35+.65*((i+1)*p%1)}/><Tag x={x} y={700} text={labels[i]} accent={i<2?COLORS.water:accent}/></g>)}
  <Arrow x1={350} y1={825} x2={1570} y2={825} p={p} color={accent}/>
</Artboard>;

// form-23: seasonal ice dependencies
const SeasonalIceDependencies: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <rect x="780" y="350" width="360" height="360" rx="48" fill={`${COLORS.water}66`} stroke={COLORS.ivory} strokeWidth="10"/><Snow x={960} y={530}/>
  {[[350,350],[350,720],[1570,350],[1570,720]].map(([x,y],i)=><g key={i} opacity={at(i,4)}><rect x={x-150} y={y-80} width="300" height="160" rx="28" fill={COLORS.charcoal} stroke={i===3?COLORS.rust:accent} strokeWidth="9"/><Tag x={x} y={y} text={labels[i]} accent={i===3?COLORS.rust:accent}/><Arrow x1={x+(x<960?150:-150)} y1={y} x2={x<960?780:1140} y2={y<530?430:630} p={p} color={accent}/></g>)}
  <path d="M875 720 Q960 820 1045 720" fill="none" stroke={COLORS.water} strokeWidth="14" strokeDasharray="18 13"/>
</Artboard>;

// form-24: no-ladder branching paths
const NoLadderPaths: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="300" cy="540" r="80" fill={`${accent}66`} stroke={COLORS.ivory} strokeWidth="8"/><text x="300" y="555" textAnchor="middle" fill={COLORS.ivory} fontSize="38" fontWeight="700">START</text>
  {[[710,330],[710,540],[710,750]].map(([x,y],i)=><g key={i} opacity={at(i,4)}><path d={`M380 540 C500 540 520 ${y} ${x-100} ${y}`} fill="none" stroke={i===0?COLORS.water:i===1?COLORS.ochre:COLORS.stone} strokeWidth="12"/><circle cx={x} cy={y} r="95" fill={COLORS.charcoal} stroke={accent} strokeWidth="9"/><Tag x={x} y={y} text={labels[i]} accent={accent}/><Arrow x1={x+100} y1={y} x2={1350} y2={540} p={p} color={accent}/></g>)}
  <circle cx="1510" cy="540" r="130" fill={`${accent}55`} stroke={COLORS.ivory} strokeWidth="10"/><path d="M1450 540 L1495 585 L1580 490" fill="none" stroke={COLORS.ivory} strokeWidth="15"/><Tag x={1510} y={760} text={labels[3]} accent={accent} p={at(3,4)}/>
</Artboard>;

// form-25: three-environment equalizer
const ThreeEnvironments: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  {[[420,COLORS.water],[960,COLORS.ochre],[1500,COLORS.stone]].map(([x,c],i)=><g key={i} opacity={at(i,4)}><path d={i===0?`M${Number(x)-180} 620 Q${x} 390 ${Number(x)+180} 620`:i===1?`M${Number(x)-180} 620 Q${x} 480 ${Number(x)+180} 620`:`M${Number(x)-190} 620 L${x} 330 L${Number(x)+190} 620Z`} fill={`${c}55`} stroke={String(c)} strokeWidth="9"/>{i===0?<Drop x={Number(x)} y={500}/>:i===1?<circle cx={Number(x)} cy="480" r="65" fill={COLORS.ochre}/>:<Snow x={Number(x)} y={500}/>}<Tag x={Number(x)} y={720} text={labels[i]} accent={String(c)}/><Arrow x1={Number(x)} y1={790} x2={960} y2={860} p={p} color={String(c)}/></g>)}
  <Tag x={960} y={870} text={labels[3]} accent={accent} p={at(3,4)}/>
</Artboard>;

// form-26: combined-method journey
const CombinedMethodJourney: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <path d="M180 650 C420 330 650 780 900 500 S1360 330 1740 620" fill="none" stroke={COLORS.ivory} strokeWidth="14" strokeDasharray="2200" strokeDashoffset={2200*(1-p)}/>
  {[[290,570],[610,575],[930,475],[1270,465],[1600,560]].map(([x,y],i)=><g key={i} opacity={at(i,5)}><circle cx={x} cy={y} r="82" fill={`${i===1?COLORS.rust:i===4?COLORS.water:accent}99`} stroke={COLORS.ivory} strokeWidth="8"/>{i===0?<path d={`M${x-40} ${y} H${x+40}`} stroke={COLORS.ivory} strokeWidth="14"/>:i===1?<Flame x={x} y={y} scale={.45}/>:i===2?<path d={`M${x-38} ${y+25} l38 -60 l38 60`} fill="none" stroke={COLORS.ivory} strokeWidth="10"/>:i===3?<Jar x={x} y={y} fill={accent}/>:<Snow x={x} y={y}/>}<Tag x={x} y={y+135} text={labels[i]} accent={accent}/></g>)}
</Artboard>;

// form-27: six pressures
const SixPressures: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="960" cy="545" r={120*p} fill={`${accent}88`} stroke={COLORS.ivory} strokeWidth="10"/><text x="960" y="560" fill={COLORS.ivory} fontSize="38" fontWeight="700" textAnchor="middle">FOOD</text>
  {[[420,320],[800,270],[1350,320],[1500,650],[1080,820],[520,730]].map(([x,y],i)=><g key={i} opacity={at(i,6)}><Arrow x1={x} y1={y} x2={960} y2={545} p={p} color={i%2?COLORS.water:accent}/><circle cx={x} cy={y} r="88" fill={COLORS.charcoal} stroke={i%2?COLORS.water:accent} strokeWidth="8"/><Tag x={x} y={y} text={labels[i]} accent={i%2?COLORS.water:accent}/></g>)}
</Artboard>;

// form-28: outcome branches
const OutcomeBranches: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  <circle cx="330" cy="540" r="105" fill={`${accent}77`} stroke={COLORS.ivory} strokeWidth="9"/><text x="330" y="555" fill={COLORS.ivory} fontSize="38" fontWeight="700" textAnchor="middle">BATCH</text>
  {[[700,300],[700,475],[700,650],[1040,740],[1040,360]].map(([x,y],i)=><g key={i} opacity={at(i,5)}><Arrow x1={430} y1={540} x2={x} y2={y} p={p} color={i%2?COLORS.water:accent}/><rect x={x-155} y={y-55} width="310" height="110" rx="24" fill={COLORS.charcoal} stroke={i%2?COLORS.water:accent} strokeWidth="7"/><Tag x={x} y={y} text={labels[i]} accent={i%2?COLORS.water:accent}/></g>)}
  <Arrow x1={1190} y1={365} x2={1500} y2={310} p={p} color={COLORS.ochre}/><Arrow x1={1190} y1={735} x2={1500} y2={790} p={p} color={COLORS.rust}/><circle cx="1610" cy="290" r="92" fill={`${COLORS.ochre}77`} stroke={COLORS.ivory} strokeWidth="8"/><path d="M1565 290 L1595 320 L1660 250" fill="none" stroke={COLORS.ivory} strokeWidth="13"/><circle cx="1610" cy="810" r="92" fill={`${COLORS.rust}77`} stroke={COLORS.ivory} strokeWidth="8"/><path d="M1565 765 L1655 855 M1655 765 L1565 855" stroke={COLORS.ivory} strokeWidth="13"/>
</Artboard>;

// form-29: time-gained ribbons
const TimeGainedRibbons: React.FC<ArtProps> = ({labels,accent,p,at}) => <Artboard>
  {[[360,380,560,COLORS.ochre],[360,560,950,accent],[360,740,1370,COLORS.water]].map(([x,y,end,c],i)=><g key={i} opacity={at(i,3)}><circle cx={x} cy={y} r="44" fill={String(c)} stroke={COLORS.ivory} strokeWidth="7"/><path d={`M${Number(x)+45} ${y} C${Number(x)+220} ${Number(y)-70} ${Number(end)-180} ${Number(y)+70} ${end} ${y}`} fill="none" stroke={String(c)} strokeWidth="38" strokeLinecap="round" strokeDasharray="1500" strokeDashoffset={1500*(1-p)}/><Tag x={Number(end)+130} y={Number(y)} text={labels[i]} accent={String(c)}/></g>)}
  <path d="M300 850 H1660" stroke={COLORS.ivory} strokeWidth="8"/><path d="M1660 850 L1615 825 M1660 850 L1615 875" stroke={COLORS.ivory} strokeWidth="8"/><text x="980" y="915" fill={COLORS.ivory} fontSize="38" fontWeight="700" textAnchor="middle">TIME GAINED DEPENDS ON METHOD + CONDITIONS</text>
</Artboard>;

export const CONCEPT_FORMS: readonly React.FC<ArtProps>[] = [
  BerryTrustDial, HarvestBridge, DualActivityHourglasses, FourConditionHearth, MoistureDecisionTrail,
  MethodPressureConstellation, DryingLandscape, WeatherInterruption, PortableBundle, TwinSmokeRacks,
  FireDistanceZones, SmokeShieldDeconstruction, SaltAccessRoutes, AvailableWaterComparison, HandlingLifecycle,
  FermentationVessel, IngredientVesselLandscape, EvidenceCertaintyLens, ArtifactEvidenceAssembly, GenerationalRelay,
  CaveSlowdown, RaisedStorageCutaway, CoolStoreQueue, SeasonalIceDependencies, NoLadderPaths,
  ThreeEnvironments, CombinedMethodJourney, SixPressures, OutcomeBranches, TimeGainedRibbons,
];
