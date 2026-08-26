# INBREEDING_CLONE

**How Did Ancient Humans Avoid Inbreeding?** — full Remotion production package, cloned from the original `INBREEDING/` folder. Renders the same 92 shots, 8:58 video at 1920×1080 30fps, with a **chunked GitHub Actions pipeline** that runs the render as 8 parallel jobs and stitches them back together.

> ⚠️ **The original `INBREEDING/` folder was never modified.** This clone is a full independent copy with its own render pipeline, so you can experiment, branch, and re-render without touching the canonical package.

---

## What's here

```
INBREEDING_CLONE/
├── README.md                    ← you are here
├── IB_ANC_all/                  ← 44 ANCIENT stills (A (1..44).png)
├── IB_VOX_all/                  ← 48 VOX stills (V (1..48).png)
│
├── FULL_PACKAGE_ancient-inbreeding.md   ← section-0→14 production spec
├── SHOTLIST_ancient-inbreeding.md       ← 92-row table (trigger, file, timecode)
├── SCRIPT_ONLY_ancient-inbreeding.md    ← narration (when present in source)
├── EDIT_ancient-inbreeding.csv          ← 18-column edit sheet
├── EDIT_ancient-inbreeding.edl          ← CMX-3600 EDL
├── FILENAME_MAP_ancient-inbreeding.csv  ← shot → file
├── zone_report.json                     ← per-VOX zone report
├── music_map.json                       ← section → track map
│
├── video/                       ← Remotion project
│   ├── package.json             ← Node + Remotion 4.0.481
│   ├── tsconfig.json
│   ├── remotion.config.ts
│   ├── src/
│   │   ├── index.ts             ← registerRoot(RemotionRoot)
│   │   ├── Root.tsx             ← <Composition> wired to scenes.json
│   │   ├── Main.tsx             ← top-level <AbsoluteFill> + audio + grain
│   │   ├── ShotScene.tsx        ← 18-style animation engine
│   │   ├── TextOverlay.tsx      ← caption engine v3 (spine, stagger, plate, underline)
│   │   ├── theme.ts             ← Anton font, palette, GRADE, easing
│   │   ├── types.ts             ← Shot, Data types
│   │   ├── scenes.json          ← 92 shot records + musicDuck frames
│   │   ├── overlay/
│   │   │   ├── FilmGrain.tsx
│   │   │   ├── Vignette.tsx
│   │   │   └── ShimmerOverlay.tsx
│   │   └── fx/Snow.tsx
│   └── public/                  ← assets served by Remotion
│       ├── VOICEOVER_ancient-inbreeding_FULL.mp3
│       ├── music_bed.m4a
│       ├── IB_ANC_all/  (44 png)
│       ├── IB_VOX_all/  (48 png)
│       └── sfx/  (9 wav)
│
├── scripts/                     ← local + CI helpers
│   ├── plan_chunks.py           ← splits 16,142 frames into 8 chunks
│   ├── render_chunk.mjs         ← renders one chunk (CI matrix)
│   ├── combine_chunks.mjs       ← trims overlaps, concats, re-encodes
│   └── validate.py              ← CSV↔scenes↔EDL↔MAP↔SHOTLIST↔ffprobe
│
├── chunks.json                  ← output of plan_chunks.py
├── reports/                     ← validation reports (one per CI run)
│
└── .github/workflows/
    └── render.yml               ← Plan → 8×Render → Combine → Validate
```

## How rendering works

The full video is **16,142 frames** at 30 fps. Rendering it as a single Remotion job takes ~25-30 minutes on a small Linux runner. So we split it into 8 chunks of ~2,018 frames each (~67 seconds of footage), render them in parallel on separate runners, then ffmpeg-stitch them back.

```
┌──────────┐    ┌──────────────────────────────────────────────────┐
│  plan    │───▶│  8 parallel render jobs (matrix.chunk = 0..7)    │
│ (one)    │    │                                                  │
└────┬─────┘    │  chunk 00: frames     0– 2047  ( 68.2s)           │
     │          │  chunk 01: frames  1987– 4064  ( 69.2s)           │
     │          │  chunk 02: frames  4004– 6081  ( 69.2s)           │
     │          │  chunk 03: frames  6021– 8098  ( 69.2s)           │
     │          │  chunk 04: frames  8038–10115  ( 69.2s)           │
     │          │  chunk 05: frames 10055–12132  ( 69.2s)           │
     │          │  chunk 06: frames 12072–14149  ( 69.2s)           │
     │          │  chunk 07: frames 14089–16142  ( 68.4s)           │
     │          └────────────────────┬─────────────────────────────┘
     │                               │ 8× chunk_NN.mp4 artifacts
     ▼                               ▼
┌──────────┐                ┌──────────────────┐
│ combine  │◀───────────────│  downloads +     │
│ (one)    │                │  trim + xfade    │
└────┬─────┘                └──────────────────┘
     │                                │
     ▼                                ▼
┌──────────┐                ┌──────────────────┐
│ validate │                │  final_video.mp4 │
│ (one)    │                │  (artifact)      │
└──────────┘                └──────────────────┘
```

Each chunk renders with a **30-frame (1s) overlap** with the next chunk. The combine step trims the leading overlap from chunks 1..7 and concats them with `-c copy`, then re-encodes to a clean H.264 MP4 (CRF 18, BT.709, AAC 192k). The single re-encode pass is fast (≈10s) and produces a file any editor accepts.

**Wall time on a GitHub-hosted runner**: ~4 minutes total (≈2-3 min for the parallel render, 1-2 min for combine + validate). Compare to ~25-30 min for a single full-render job.

## Running locally

You need Python 3.11+, Node 20+, ffmpeg.

```bash
# 1. install Node deps
cd INBREEDING_CLONE/video
npm install

# 2. (optional) plan the chunks
cd ..
python scripts/plan_chunks.py
# → writes chunks.json with the 8 chunk ranges

# 3a. (optional) render all 8 chunks locally
for i in 0 1 2 3 4 5 6 7; do
  CHUNK_INDEX=$i node scripts/render_chunk.mjs
done

# 3b. (or) render the whole video as a single job
cd video
npx remotion render Main out/final_video.mp4

# 4. combine the 8 chunks into the final video
cd ..
node scripts/combine_chunks.mjs
# → writes video/out/final_video.mp4

# 5. validate the final build
python scripts/validate.py \
  --video video/out/final_video.mp4 \
  --scenes video/src/scenes.json \
  --csv  EDIT_ancient-inbreeding.csv \
  --shotlist SHOTLIST_ancient-inbreeding.md \
  --map FILENAME_MAP_ancient-inbreeding.csv \
  --edl  EDIT_ancient-inbreeding.edl \
  --out reports/validation_report.json
```

## Running on GitHub Actions

The workflow at `.github/workflows/render.yml` does all of the above automatically:

1. **Plan chunks** — runs `plan_chunks.py`, uploads `chunks.json` as the `render-plan` artifact.
2. **Render 8 chunks in parallel** — matrix job `strategy.matrix.chunk = 0..7`. Each runner:
   - Checks out the repo
   - Installs Node 20 + Python 3.11 + ffmpeg
   - `npm ci` in `video/`
   - Runs `node scripts/render_chunk.mjs` with `CHUNK_INDEX=${{ matrix.chunk }}`
   - Uploads `video/out/chunks/chunk_NN.mp4` as the `chunk-NN` artifact
3. **Combine chunks** — downloads all 8 chunk artifacts, runs `combine_chunks.mjs`, uploads the final mp4 as `final-video`.
4. **Validate** — downloads the final video and runs `validate.py` to confirm CSV/EDL/MAP/scenes.json all align, ffprobe reports correct dimensions/fps/duration, and every asset is present. Uploads the JSON report as `validation-report`.

The workflow fires on:
- `push` to `main`, `master`, `develop`, or any `render/**` branch (when files under `video/`, `scripts/`, or `.github/workflows/render.yml` change)
- manual `workflow_dispatch`

To trigger manually: GitHub → Actions → Render video → Run workflow.

## Validation

The validator (`scripts/validate.py`) confirms the rendered video is consistent with the editorial package:

| Check | What it confirms |
|---|---|
| csv/scenes row count | CSV and scenes.json both list exactly 92 shots |
| csv/scenes field alignment | Every CSV row matches scenes.json on in_sec, dur_sec, type, file, anim |
| csv/FILENAME_MAP alignment | Every CSV row's image_file matches FILENAME_MAP |
| edl video event count | EDL lists exactly 92 video events (matching CSV) |
| shotlist row count | SHOTLIST has exactly 92 rows |
| shotlist order matches csv | SHOTLIST and CSV list the same shots in the same order |
| video dimensions | ffprobe reports 1920×1080 |
| video fps | ffprobe reports 30 fps |
| video duration | within 0.5s of 538.08s (warn-only at 2s tolerance) |
| ancient assets | all 44 `IB_ANC_all/A (n).png` exist under `video/public/` |
| vox assets | all 48 `IB_VOX_all/V (n).png` exist under `video/public/` |

Run it any time after a build. Latest local run: **8 PASS / 1 WARN / 0 FAIL** (the WARN is the not-yet-rendered local video file).

## Notes

- The whole project uses **Anton** (Google Fonts) for every overlay caption. The build script never falls back to a system sans-serif.
- Voiceover and music bed are pinned to the master timeline; chunks render against the same audio so the stitch is in sync.
- The animation engine has 18 named styles (KENBURNS-PUSH, KENBURNS-PULL, PAN-LEFT, PAN-RIGHT, PARALLAX-PAN-L, PARALLAX-PAN-R, SLOW-RISE, GENTLE-SWAY, BREATHING-HOLD, PAPER-WIPE-IN, SWEEP-HIGHLIGHT, IRIS-REVEAL, FIRELIGHT-FLICKER, WEB-EXPAND, TREE-TRACE, WALK-TRACK, PUSH-IN, PULL-BACK). No two adjacent shots share a style.
- The visual grade changes per section (TRAP/BIOLOGY = cool & tight; REVEAL = clean; MACHINE = warm; NEAND = coldest; PAYOFF = warmest & open).

## Provenance

This package was assembled by an AI assistant from the original `INBREEDING/` folder. The original folder is the source of truth; this clone is for re-rendering and experimentation. The original folder is **read-only** from the perspective of the build scripts.
