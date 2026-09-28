import {readFileSync,writeFileSync,appendFileSync} from 'node:fs';
const d=JSON.parse(readFileSync('src/scenes.json','utf8'));
const n=Number(process.argv[2]||8);
if(!Number.isInteger(n)||n<1||n>16)throw Error('Use 1 to 16 chunks');
const starts=d.shots.filter(s=>s.start>0&&!s.dissolve).map(s=>s.start);
const bounds=[0];
for(let i=1;i<n;i++){
  const target=d.totalFrames*i/n;
  const next=starts.filter(f=>f>bounds.at(-1)).sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0];
  if(next===undefined)throw Error('No valid cut');bounds.push(next);
}
bounds.push(d.totalFrames);
const chunks=bounds.slice(0,-1).map((start,index)=>({index,start,end:bounds[index+1]-1,frames:bounds[index+1]-start,file:`chunk_${String(index).padStart(2,'0')}.mp4`}));
writeFileSync('chunks.json',JSON.stringify({fps:d.fps,totalFrames:d.totalFrames,chunks},null,2));
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`matrix=${JSON.stringify(chunks)}\n`);
console.log(chunks);
