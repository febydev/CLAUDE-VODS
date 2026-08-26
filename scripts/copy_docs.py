#!/usr/bin/env python3
"""
copy_docs.py — copy the editorial documentation files (FULL_PACKAGE, SHOTLIST,
EDIT CSV, EDIT EDL, FILENAME_MAP) from the original INBREEDING folder into
INBREEDING_CLONE so the clone is fully self-contained.
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "INBREEDING"
DST = ROOT / "INBREEDING_CLONE"

FILES = [
    "FULL_PACKAGE_ancient-inbreeding.md",
    "SCRIPT_ONLY_ancient-inbreeding.md",
    "SHOTLIST_ancient-inbreeding.md",
    "EDIT_ancient-inbreeding.csv",
    "EDIT_ancient-inbreeding.edl",
    "FILENAME_MAP_ancient-inbreeding.csv",
    "zone_report.json",
    "music_map.json",
]

copied = 0
for fname in FILES:
    src = SRC / fname
    if not src.exists():
        print(f"[warn] missing: {src}")
        continue
    dst = DST / fname
    shutil.copy2(src, dst)
    print(f"[ok] {fname}  ({src.stat().st_size:,} bytes)")
    copied += 1

print(f"\n[done] {copied}/{len(FILES)} docs copied into INBREEDING_CLONE/")
