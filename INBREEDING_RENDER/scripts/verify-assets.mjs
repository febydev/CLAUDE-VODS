// verify-assets.mjs — pre-render gate: every file referenced by scenes.json
// must exist in video/public/, and the composition metadata must be sane.
// Catches missing-asset failures in seconds instead of 10 minutes into a render.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PUBLIC = join(ROOT, "video", "public");

const scenes = JSON.parse(readFileSync(join(ROOT, "video", "src", "scenes.json"), "utf-8"));

const fail = (msg) => {
  console.error(`[verify][fatal] ${msg}`);
  process.exit(1);
};

for (const k of ["fps", "width", "height", "totalFrames", "shots"]) {
  if (scenes[k] === undefined) fail(`scenes.json missing key: ${k}`);
}

// timeline continuity: shots must tile [0, totalFrames) without gaps
let cursor = 0;
for (const s of scenes.shots) {
  if (s.start !== cursor) fail(`shot ${s.shot}: starts at ${s.start}, expected ${cursor}`);
  if (!Number.isFinite(s.duration) || s.duration <= 0) fail(`shot ${s.shot}: bad duration ${s.duration}`);
  cursor = s.start + s.duration;
}
if (cursor !== scenes.totalFrames) {
  fail(`shots tile ${cursor} frames but totalFrames=${scenes.totalFrames}`);
}

// every referenced asset exists
const missing = [];
for (const s of scenes.shots) {
  if (!s.file) fail(`shot ${s.shot}: no image file`);
  if (!existsSync(join(PUBLIC, s.file))) missing.push(s.file);
  if (s.sfxFile && !existsSync(join(PUBLIC, s.sfxFile))) missing.push(s.sfxFile);
}
for (const a of ["VOICEOVER_ancient-inbreeding_FULL.mp3", "music_bed.m4a"]) {
  if (!existsSync(join(PUBLIC, a))) missing.push(a);
}
if (missing.length) {
  for (const m of [...new Set(missing)]) console.error(`[verify] missing: ${m}`);
  fail(`${missing.length} missing asset references`);
}

const dur = scenes.totalFrames / scenes.fps;
console.log(
  `[verify] ✓ ${scenes.shots.length} shots tile ${scenes.totalFrames}f @ ${scenes.fps}fps ` +
  `(${Math.floor(dur / 60)}:${String(Math.round(dur % 60)).padStart(2, "0")}), ` +
  `${scenes.width}x${scenes.height}, all assets present`,
);
