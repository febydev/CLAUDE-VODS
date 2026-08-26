#!/usr/bin/env python3
"""
plan_chunks.py — split the full video into N chunks for parallel GitHub Actions rendering.

Reads scenes.json (built from EDIT_ancient-inbreeding.csv) and produces a chunks.json
describing N equal-time chunks. Each chunk renders independently on a separate runner
then ffmpeg-stitches them back together.

Why chunks:
  The full video is 16,142 frames at 30fps = 9 minutes. Rendering the whole thing on
  one runner takes 25-30 minutes. Splitting into 8 parallel chunks cuts wall time to
  ~4 minutes, and the per-chunk render fails fast if there's a problem with one shot.

The plan:
  - totalFrames = 16,142 (from scenes.json)
  - fps = 30
  - duration = 538.08s = 8:58
  - 8 chunks → ~2,018 frames each, ~67s per chunk
  - 30-frame overlap between adjacent chunks (10 frames pre-roll + 20 frames hold)
    so the stitch is seamless and no flash shows on a cut

Output: chunks.json with { chunk_id, from_frame, to_frame, duration_frames, output }
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCENES = ROOT / "video" / "src" / "scenes.json"
OUT = ROOT / "chunks.json"
NUM_CHUNKS = 8
OVERLAP_FRAMES = 30  # 1 second at 30fps — gives the ffmpeg stitch a clean crossfade

def main() -> None:
    data = json.loads(SCENES.read_text(encoding="utf-8"))
    fps = data["fps"]
    total = data["totalFrames"]
    duration_s = total / fps
    print(f"[plan] totalFrames={total}  fps={fps}  duration={duration_s:.2f}s")

    # Divide total frames into N near-equal pieces, leaving room for the overlaps.
    # Each chunk's effective range covers its fair share, plus overlap on both ends.
    chunk_span = total // NUM_CHUNKS
    chunks = []
    for i in range(NUM_CHUNKS):
        start = max(0, i * chunk_span - (OVERLAP_FRAMES if i > 0 else 0))
        end = min(total, (i + 1) * chunk_span + (OVERLAP_FRAMES if i < NUM_CHUNKS - 1 else 0))
        if i == NUM_CHUNKS - 1:
            end = total
        chunks.append({
            "i": i,
            "from_frame": start,
            "to_frame": end,
            "frames": end - start,
            "duration_s": (end - start) / fps,
            "output": f"chunk_{i:02d}.mp4",
            "label": f"S{(i*chunk_span)//30:03d}–S{((i+1)*chunk_span)//30:03d}",
        })
        print(f"  chunk {i:02d}: frames {start:5d}–{end:5d}  "
              f"({(end-start)/fps:5.1f}s)  → {chunks[-1]['label']}")

    # Trim overlaps on chunks 1..N-1 by OVERLAP_FRAMES from the start, so each chunk
    # only renders its own territory. The combine step joins them with a 30-frame xfade.
    plan = {
        "fps": fps,
        "width": data["width"],
        "height": data["height"],
        "totalFrames": total,
        "durationSeconds": duration_s,
        "overlapFrames": OVERLAP_FRAMES,
        "numChunks": NUM_CHUNKS,
        "chunks": chunks,
        # For the combine step: list of (chunk_file, render_frames) — we render each
        # chunk at its raw range, then trim the leading OVERLAP from all but chunk 0.
        "trim_leading_frames": [OVERLAP_FRAMES if i > 0 else 0 for i in range(NUM_CHUNKS)],
    }
    OUT.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    print(f"\n[ok] wrote {OUT.name}  ({NUM_CHUNKS} chunks, {OVERLAP_FRAMES}f overlap each)")
    print(f"     fastest single chunk: {min(c['duration_s'] for c in chunks):.1f}s")
    print(f"     total render time:    {sum(c['duration_s'] for c in chunks):.1f}s serial")
    print(f"     parallel wall time:   ~{max(c['duration_s'] for c in chunks):.0f}s + stitch")

if __name__ == "__main__":
    main()
