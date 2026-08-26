#!/usr/bin/env python3
"""Copy scenes.json from source INBREEDING into the clone's video/src/."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "INBREEDING" / "video" / "src" / "scenes.json"
DST = ROOT / "INBREEDING_CLONE" / "video" / "src" / "scenes.json"

if not SRC.exists():
    raise SystemExit(f"missing source: {SRC}")

DST.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(SRC, DST)
print(f"[ok] copied {SRC.name} → {DST}")
print(f"     size: {DST.stat().st_size:,} bytes")
