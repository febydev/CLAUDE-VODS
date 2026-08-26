// render_chunk.mjs
// Render ONE chunk of the Remotion composition in isolation.
// Called by the GitHub Actions matrix job — each job sets CHUNK_INDEX to 0..7.
//
// Usage:
//   CHUNK_INDEX=0 node scripts/render_chunk.mjs
// or (local):
//   node scripts/render_chunk.mjs 0
//
// Reads chunks.json for from_frame / to_frame, then calls `remotion render`
// with --frames=<from>-<to>. The full voiceover and music bed are still loaded
// by Remotion (they're pinned to the master timeline) so the chunk's audio is
// in sync with what it would be in the full render.

import { execSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VIDEO = join(ROOT, "video");
const OUT_DIR = join(VIDEO, "out", "chunks");
const PLAN = JSON.parse(readFileSync(join(ROOT, "chunks.json"), "utf-8"));

const idx = Number(process.env.CHUNK_INDEX ?? process.argv[2] ?? 0);
if (!Number.isFinite(idx) || idx < 0 || idx >= PLAN.numChunks) {
  console.error(`[fatal] bad CHUNK_INDEX: ${idx}`);
  process.exit(1);
}

const chunk = PLAN.chunks[idx];
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const outFile = join(OUT_DIR, chunk.output);
const from = chunk.from_frame;
const to = chunk.to_frame - 1;   // remotion uses inclusive frame numbers
const dur = chunk.frames;

console.log(`[chunk ${idx}] ${chunk.label}`);
console.log(`[chunk ${idx}] frames ${from}–${to}  (${dur} frames, ${chunk.duration_s.toFixed(2)}s)`);
console.log(`[chunk ${idx}] output: ${outFile}`);

// Remotion render command — uses node-only path (no browser) when in a CI runner
// with @remotion/renderer. For the simple matrix we'll use the CLI directly:
//   remotion render Main <out> --frames=<from>-<to> --concurrency=1
const concurrency = process.env.RENDER_CONCURRENCY ?? "1";
const cmd = [
  "npx", "remotion", "render",
  "Main",
  outFile,
  `--frames=${from}-${to}`,
  `--concurrency=${concurrency}`,
  "--jpeg-quality=88",
  "--color-space=bt709",
].join(" ");

console.log(`[chunk ${idx}] running: ${cmd}`);
const t0 = Date.now();
execSync(cmd, {
  cwd: VIDEO,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});
const dt = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`[chunk ${idx}] done in ${dt}s → ${outFile}`);
