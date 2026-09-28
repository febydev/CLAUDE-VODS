import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const plan=JSON.parse(readFileSync('chunks.json','utf8'));
const probe=p=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',p],{encoding:'utf8'}));
for(const c of plan.chunks){
  const p=probe('out/chunks/'+c.file);const v=p.streams.find(s=>s.codec_type==='video');
  assert.equal(Number(v.nb_frames),c.frames,c.file);assert.equal(v.r_frame_rate,'25/1');
  assert.ok(!p.streams.some(s=>s.codec_type==='audio'),'Chunks must be silent');
}
mkdirSync('out',{recursive:true});
writeFileSync('out/concat.txt',plan.chunks.map(c=>`file 'chunks/${c.file}'`).join('\n'));
execFileSync('ffmpeg',['-v','warning','-y','-f','concat','-safe','0','-i','out/concat.txt','-i','public/master.flac',
  '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000',
  '-t',String(plan.totalFrames/plan.fps),'-movflags','+faststart','out/IRAN_final.mp4'],{stdio:'inherit'});
const result=probe('out/IRAN_final.mp4');const v=result.streams.find(s=>s.codec_type==='video');
assert.equal(Number(v.nb_frames),plan.totalFrames);assert.equal(v.width,1920);assert.equal(v.height,1080);
assert.equal(v.r_frame_rate,'25/1');assert.ok(Math.abs(Number(result.format.duration)-plan.totalFrames/plan.fps)<.05);
writeFileSync('out/delivery-probe.json',JSON.stringify(result,null,2));console.log('Final file passed frame count, dimensions, fps and duration checks.');
