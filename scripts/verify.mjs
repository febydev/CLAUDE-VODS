import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const d=JSON.parse(readFileSync('src/scenes.json','utf8'));
const graphics=JSON.parse(readFileSync('src/graphics.json','utf8'));
assert.equal(d.fps,25);assert.equal(d.totalFrames,36855);assert.equal(d.shots.length,249);
assert.equal(d.music,null);assert.equal(d.introFrames,0);
let end=0;const sources=new Set();let cues=0;let vox=0;
for(const s of d.shots){
  assert.equal(s.start,end,s.id);assert.ok(s.duration>0);end+=s.duration;
  if(s.type==='CODE'){
    assert.ok(graphics[s.id]);assert.ok(!Object.values(graphics[s.id].layers).some(v=>v.includes('<text')));
  }else{assert.ok(existsSync('public/'+s.file),s.file);sources.add(s.source);}
  if(s.type==='VOX'){
    vox++;assert.ok(existsSync('public/'+s.overlay));
    assert.ok(s.overlayStart>=0 && s.overlayFull>=s.overlayStart);
    assert.ok(s.overlayEnd-s.overlayFull>=50,s.id+' title hold');
    assert.ok(s.overlayEnd<=s.duration);
  }
  if(s.sfx){cues++;assert.ok(existsSync('public/'+s.sfx.file));assert.ok(s.sfx.at<s.duration);}
}
assert.equal(end,d.totalFrames);assert.equal(sources.size,179);assert.equal(vox,72);
assert.equal(Object.keys(graphics).length,70);assert.equal(cues,42);
assert.ok(existsSync('public/master.flac'));
console.log('Verified: 249 contiguous shots, 179 unique illustrations, 70 outlined graphics, 72 titles, 42 SFX; no music.');
