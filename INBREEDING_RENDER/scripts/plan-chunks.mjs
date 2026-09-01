// plan-chunks.mjs — split the composition into N parallel render chunks.
//
// Reads video/src/scenes.json and writes chunks.json at the package root.
// Chunk boundaries are snapped to actual shot start frames, so every seam
// between chunks lands on a real cut in the edit: chunk i renders exactly
// [b_i, b_i+1) and the concatenation of all chunks is frame-exact with no
// overlap, trim, or dissolve fudges.
//
// Usage: node scripts/plan-chunks.mjs [numChunks]   (default 8)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const scenes = JSON.parse(
  readFileSync(join(ROOT, "video", "src", "scenes.json"), "utf-8"),
);

const NUM_CHUNKS = Number(process.argv[2] ?? 8);
const { fps, width, height, totalFrames } = scenes;
if (!Number.isFinite(NUM_CHUNKS) || NUM_CHUNKS < 2 || NUM_CHUNKS > 16) {
  console.error(`[plan] bad chunk count: ${NUM_CHUNKS} (use 2..16)`);
  process.exit(1);
}

// Candidate boundary frames = start frame of every shot (0 and totalFrames
// are always boundaries). We pick, for each ideal even split point, the
// nearest shot start within a tolerance so chunks stay roughly balanced.
const shotStarts = [0, ...scenes.shots.map((s) => s.start).filter((f) => f > 0 && f < totalFrames)];
const span = totalFrames / NUM_CHUNKS;
const tol = Math.floor(span / 3);

const boundaries = [0];
for (let i = 1; i < NUM_CHUNKS; i++) {
  const ideal = Math.round(i * span);
  const near = shotStarts.filter((f) => Math.abs(f - ideal) <= tol && f > boundaries.at(-1));
  const best = near.sort((a, b) => Math.abs(a - ideal) - Math.abs(b - ideal))[0] ?? ideal;
  boundaries.push(best);
}
boundaries.push(totalFrames);

// Sanity: strictly increasing, full coverage.
for (let i = 0; i < boundaries.length - 1; i++) {
  if (boundaries[i] >= boundaries[i + 1]) {
    console.error(`[plan] boundary collapse at chunk ${i}: ${boundaries.join(",")}`);
    process.exit(1);
  }
}

const shotAt = (frame) => scenes.shots.filter((s) => s.start <= frame).length; // 1-based count

const chunks = [];
for (let i = 0; i < NUM_CHUNKS; i++) {
  const from = boundaries[i];
  const to = boundaries[i + 1]; // exclusive
  chunks.push({
    index: i,
    fromFrame: from,
    toFrameExclusive: to,
    frames: to - from,
    firstShot: `S${String(shotAt(from)).padStart(3, "0")}`,
    lastShot: `S${String(shotAt(to - 1)).padStart(3, "0")}`,
    file: `chunk_${i}.mp4`,
  });
}

const plan = {
  fps,
  width,
  height,
  totalFrames,
  expectedDurationSeconds: totalFrames / fps,
  numChunks: NUM_CHUNKS,
  chunks,
};

writeFileSync(join(ROOT, "chunks.json"), JSON.stringify(plan, null, 2));

console.log(`[plan] ${totalFrames} frames @ ${fps}fps = ${(totalFrames / fps).toFixed(2)}s → ${NUM_CHUNKS} chunks`);
for (const c of chunks) {
  console.log(
    `  chunk ${c.index}: frames ${String(c.fromFrame).padStart(5)}–${String(c.toFrameExclusive).padStart(5)} ` +
    `(${String(c.frames).padStart(5)}f, ${(c.frames / fps).toFixed(1)}s)  ${c.firstShot}–${c.lastShot}`,
  );
}
console.log(`[plan] wrote chunks.json — longest chunk ${(Math.max(...chunks.map((c) => c.frames)) / fps).toFixed(1)}s sets the wall time`);
