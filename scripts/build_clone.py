#!/usr/bin/env python3
"""
Build script for INBREEDING_CLONE — clones the original INBREEDING folder
into a fresh INBREEDING_CLONE folder with no modifications to the source.

Steps:
  1. Create folder skeleton
  2. Copy 44 ANCIENT stills
  3. Copy 48 VOX stills
  4. Copy voiceover + music bed
  5. (Remotion project files are written by write_to_file separately)

Original INBREEDING folder is NEVER modified — we only READ from it.
"""
from __future__ import annotations
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "INBREEDING"
DST = ROOT / "INBREEDING_CLONE"

# ── 1. skeleton ──────────────────────────────────────────────────────────────
DIRS = [
    "IB_ANC_all",
    "IB_VOX_all",
    "video/public/IB_ANC_all",
    "video/public/IB_VOX_all",
    "video/public/sfx",
    "video/src/overlay",
    "video/src/fx",
    ".github/workflows",
    "scripts",
    "reports",
]
for d in DIRS:
    (DST / d).mkdir(parents=True, exist_ok=True)
print(f"[ok] skeleton ready under {DST.name}/")

# ── 2. ANCIENT stills ────────────────────────────────────────────────────────
anc_src = SRC / "IB_ANC_all"
anc_dst = DST / "IB_ANC_all"
anc_files = sorted(anc_src.glob("*.png"))
n_anc = 0
for f in anc_files:
    shutil.copy2(f, anc_dst / f.name)
    n_anc += 1
print(f"[ok] copied {n_anc} ANCIENT stills → IB_ANC_all/")

# also copy into video/public/IB_ANC_all
anc_pub_dst = DST / "video" / "public" / "IB_ANC_all"
for f in anc_files:
    shutil.copy2(f, anc_pub_dst / f.name)
print(f"[ok] copied {n_anc} ANCIENT stills → video/public/IB_ANC_all/")

# ── 3. VOX stills ─────────────────────────────────────────────────────────────
vox_src = SRC / "IB_VOX_all"
vox_dst = DST / "IB_VOX_all"
vox_files = sorted(vox_src.glob("*.png"))
n_vox = 0
for f in vox_files:
    shutil.copy2(f, vox_dst / f.name)
    n_vox += 1
print(f"[ok] copied {n_vox} VOX stills → IB_VOX_all/")

# also copy into video/public/IB_VOX_all
vox_pub_dst = DST / "video" / "public" / "IB_VOX_all"
for f in vox_files:
    shutil.copy2(f, vox_pub_dst / f.name)
print(f"[ok] copied {n_vox} VOX stills → video/public/IB_VOX_all/")

# ── 4. voiceover + music bed ─────────────────────────────────────────────────
audio_pairs = [
    (SRC / "VOICEOVER_ancient-inbreeding_FULL.mp3",
     DST / "video" / "public" / "VOICEOVER_ancient-inbreeding_FULL.mp3"),
    (SRC / "video" / "public" / "music_bed.m4a",
     DST / "video" / "public" / "music_bed.m4a"),
]
for src, dst in audio_pairs:
    if not src.exists():
        print(f"[warn] missing: {src}")
        continue
    shutil.copy2(src, dst)
    print(f"[ok] copied {src.name} → video/public/")

# ── 5. SFX folder (copy all wav files from original public/sfx) ──────────────
sfx_src = SRC / "video" / "public" / "sfx"
sfx_dst = DST / "video" / "public" / "sfx"
if sfx_src.exists():
    n_sfx = 0
    for f in sfx_src.glob("*.wav"):
        shutil.copy2(f, sfx_dst / f.name)
        n_sfx += 1
    print(f"[ok] copied {n_sfx} SFX files → video/public/sfx/")
else:
    print("[warn] no SFX folder in source — skipping")

print()
print("=" * 60)
print(f"SUMMARY: cloned {n_anc} ANCIENT + {n_vox} VOX stills")
print(f"Total source untouched: {SRC}")
print(f"Clone destination:      {DST}")
print("=" * 60)
