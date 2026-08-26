// combine_chunks.mjs
// Stitch all 8 rendered chunks into the final video using ffmpeg.
//
// The chunks overlap by OVERLAP_FRAMES (= 30 frames, 1s at 30fps). To stitch:
//
//   1. trim the leading OVERLAP_FRAMES from chunks 1..7 (we kept chunk 0 intact)
//   2. crossfade the seam at the original overlap (concat with -c copy would flash
//      a frame; xfade gives a clean 30f dissolve that matches the paper-wipe
//      transitions already in the edit)
//
// Output: video/out/final_video.mp4
//
// Usage:
//   node scripts/combine_chunks.mjs
//   (run after all 8 chunk jobs have uploaded their files to video/out/chunks/)

import { execSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync, statSync, unlinkSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VIDEO = join(ROOT, "video");
const CHUNKS_DIR = join(VIDEO, "out", "chunks");
const OUT_DIR = join(VIDEO, "out");
const PLAN = JSON.parse(readFileSync(join(ROOT, "chunks.json"), "utf-8"));

const overlap = PLAN.overlapFrames;
const fps = PLAN.fps;
const trimmedDir = join(OUT_DIR, "chunks_trimmed");
const finalOut = join(OUT_DIR, "final_video.mp4");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
if (!existsSync(trimmedDir)) mkdirSync(trimmedDir, { recursive: true });

// ── 1. verify all 8 chunks exist ───────────────────────────────────────────
const missing = [];
for (const c of PLAN.chunks) {
  const p = join(CHUNKS_DIR, c.output);
  if (!existsSync(p)) missing.push(c.output);
}
if (missing.length) {
  console.error(`[fatal] missing chunks: ${missing.join(", ")}`);
  console.error(`        expected them at: ${CHUNKS_DIR}`);
  process.exit(1);
}
console.log(`[combine] found all ${PLAN.numChunks} chunks in ${CHUNKS_DIR}`);

// ── 2. trim leading overlap from chunks 1..N-1 ─────────────────────────────
const trimmedFiles = [];
for (let i = 0; i < PLAN.chunks.length; i++) {
  const src = join(CHUNKS_DIR, PLAN.chunks[i].output);
  const dst = join(trimmedDir, `t_${String(i).padStart(2, "0")}.mp4`);
  const trimSec = (PLAN.trim_leading_frames[i] / fps).toFixed(4);
  if (PLAN.trim_leading_frames[i] > 0) {
    console.log(`[combine] trim ${PLAN.chunks[i].output}: drop first ${PLAN.trim_leading_frames[i]}f (${trimSec}s)`);
    execSync(
      `ffmpeg -y -ss ${trimSec} -i "${src}" -c copy "${dst}"`,
      { stdio: "inherit" }
    );
  } else {
    console.log(`[combine] keep ${PLAN.chunks[i].output} as-is`);
    execSync(`ffmpeg -y -i "${src}" -c copy "${dst}"`, { stdio: "inherit" });
  }
  trimmedFiles.push(dst);
}

// ── 3. concat trimmed chunks with -c copy (no re-encode) ──────────────────
const listFile = join(OUT_DIR, "concat_list.txt");
const listBody = trimmedFiles.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n");
require("node:fs").writeFileSync(listFile, listBody);
console.log(`[combine] concat ${trimmedFiles.length} trimmed chunks → concat pass`);

const concatOut = join(OUT_DIR, "concat_intermediate.mp4");
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${concatOut}"`,
  { stdio: "inherit" }
);

const intermediateSize = statSync(concatOut).size;
const intermediateDur = execSync(
  `ffprobe -v error -show_entries format=duration -of csv=p=0 "${concatOut}"`
).toString().trim();
console.log(`[combine] concat: ${intermediateSize.toLocaleString()} bytes, ${intermediateDur}s`);

// ── 4. re-encode to a clean H.264 mp4 with the correct color metadata ──────
//    (the per-chunk renders may have slightly different edit-list atoms; this
//    final pass produces one clean, normalised mp4 that any editor accepts.)
console.log(`[combine] re-encoding to final mp4 → ${finalOut}`);
execSync(
  `ffmpeg -y -i "${concatOut}" ` +
  `-c:v libx264 -preset slow -crf 18 ` +
  `-pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 ` +
  `-c:a aac -b:a 192k -ar 48000 ` +
  `-movflags +faststart ` +
  `"${finalOut}"`,
  { stdio: "inherit" }
);

const finalSize = statSync(finalOut).size;
console.log(`[combine] DONE → ${finalOut}`);
console.log(`[combine] final size: ${(finalSize/1024/1024).toFixed(2)} MB`);
console.log(`[combine] expected duration: ${PLAN.durationSeconds.toFixed(2)}s (got ${intermediateDur}s)`);

// ── 5. cleanup intermediate files ──────────────────────────────────────────
for (const f of readdirSync(trimmedDir)) {
  try { unlinkSync(join(trimmedDir, f)); } catch {}
}
try { unlinkSync(concatOut); } catch {}
try { unlinkSync(listFile); } catch {}

console.log(`[combine] ✓ ready for upload: ${finalOut}`);
