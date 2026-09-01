// combine-chunks.mjs — stitch rendered chunks into the final video.
//
// Chunks are contiguous, non-overlapping frame ranges (boundaries sit on shot
// cuts), so stitching is: concat demuxer → one clean re-encode. The re-encode
// normalises anything the per-chunk muxers disagree on and gives us a single
// faststart mp4.
//
// Fails hard if any chunk is missing or if the final duration is off by >0.5s
// from the scenes.json expectation.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const VIDEO = join(ROOT, "video");
const CHUNKS_DIR = join(VIDEO, "out", "chunks");
const OUT = join(VIDEO, "out", "final_video.mp4");

const plan = JSON.parse(readFileSync(join(ROOT, "chunks.json"), "utf-8"));
const sh = (cmd) => execSync(cmd, { stdio: ["pipe", "pipe", "inherit"] }).toString().trim();
const probeSeconds = (f) =>
  Number(sh(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`));

mkdirSync(join(VIDEO, "out"), { recursive: true });

// 1. all chunks present, each with a sane duration
let sum = 0;
for (const c of plan.chunks) {
  const p = join(CHUNKS_DIR, c.file);
  if (!existsSync(p)) {
    console.error(`[combine][fatal] missing ${p}`);
    process.exit(1);
  }
  const dur = probeSeconds(p);
  const want = c.frames / plan.fps;
  if (Math.abs(dur - want) > 0.35) {
    console.error(`[combine][fatal] ${c.file}: ${dur.toFixed(2)}s, expected ~${want.toFixed(2)}s`);
    process.exit(1);
  }
  sum += dur;
  console.log(`[combine] ${c.file}  ${dur.toFixed(2)}s  (want ${want.toFixed(2)}s) ✓`);
}

// 2. concat demuxer → single re-encode
const listFile = join(VIDEO, "out", "concat_list.txt");
writeFileSync(
  listFile,
  plan.chunks.map((c) => `file '${join(CHUNKS_DIR, c.file).replace(/'/g, "'\\''")}'`).join("\n"),
);

console.log(`[combine] re-encoding ${plan.numChunks} chunks → final_video.mp4`);
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${listFile}"` +
    ` -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p` +
    ` -color_primaries bt709 -color_trc bt709 -colorspace bt709` +
    ` -c:a aac -b:a 192k -ar 48000 -movflags +faststart "${OUT}"`,
  { stdio: "inherit" },
);

// 3. duration gate
const got = probeSeconds(OUT);
const want = plan.expectedDurationSeconds;
const mb = (f) => (f / 1024 / 1024).toFixed(1);
console.log(`[combine] final: ${got.toFixed(2)}s (expected ${want.toFixed(2)}s), ${mb(statSync(OUT).size)} MB`);
if (Math.abs(got - want) > 0.5) {
  console.error(`[combine][fatal] duration off by ${(got - want).toFixed(2)}s`);
  process.exit(1);
}
console.log(`[combine] ✓ ${OUT}`);
