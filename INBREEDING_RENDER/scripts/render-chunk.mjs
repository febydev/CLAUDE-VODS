// render-chunk.mjs — render ONE chunk of the Main composition.
//
//   CHUNK_INDEX=3 node scripts/render-chunk.mjs     (CI)
//   node scripts/render-chunk.mjs 3                 (local)
//
// Reads chunks.json (from plan-chunks.mjs), renders the exact frame range
// with `remotion render`, audio included (the voiceover/music bed are pinned
// to the master timeline, so a chunk's audio window is automatically correct).
//
// GL backend matches the config that already renders this project green on
// GitHub runners: --gl=swiftshader.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const VIDEO = join(ROOT, "video");
const OUT_DIR = join(VIDEO, "out", "chunks");

const planPath = join(ROOT, "chunks.json");
if (!existsSync(planPath)) {
  console.error("[fatal] chunks.json missing — run: node scripts/plan-chunks.mjs");
  process.exit(1);
}
const plan = JSON.parse(readFileSync(planPath, "utf-8"));

const idx = Number(process.env.CHUNK_INDEX ?? process.argv[2] ?? -1);
const chunk = plan.chunks[idx];
if (!chunk) {
  console.error(`[fatal] bad chunk index ${idx} — chunks.json has ${plan.numChunks}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const out = join(OUT_DIR, chunk.file);
const from = chunk.fromFrame;
const toInclusive = chunk.toFrameExclusive - 1; // remotion --frames is inclusive

const cmd = [
  "npx", "remotion", "render", "Main", JSON.stringify(out),
  `--frames=${from}-${toInclusive}`,
  `--concurrency=${process.env.RENDER_CONCURRENCY ?? "4"}`,
  "--gl=swiftshader",
  "--image-format=jpeg",
  "--jpeg-quality=90",
].join(" ");

console.log(`[chunk ${idx}] ${chunk.firstShot}–${chunk.lastShot}  frames ${from}–${toInclusive} (${chunk.frames}f, ${(chunk.frames / plan.fps).toFixed(1)}s)`);
console.log(`[chunk ${idx}] $ ${cmd}`);
const t0 = Date.now();
execSync(cmd, { cwd: VIDEO, stdio: "inherit" });
console.log(`[chunk ${idx}] done in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${out}`);
