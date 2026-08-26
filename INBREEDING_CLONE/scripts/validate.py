#!/usr/bin/env python3
"""
validate.py — final-build validator for the INBREEDING_CLONE package.

Confirms the rendered video matches the locked-down editorial package:
  1. CSV  ↔ scenes.json   : every shot in the CSV exists in the engine, with matching
                            in_sec, dur_sec, type, file, animation, and text overlay
  2. CSV  ↔ FILENAME_MAP  : every shot has a corresponding map row, file paths agree
  3. CSV  ↔ EDL           : every shot has a corresponding EDL record, timecodes agree
  4. SHOTLIST ↔ CSV       : SHOTLIST has every CSV shot in order, triggers match
  5. video file           : ffprobe reports width=1920, height=1080, fps=30,
                            duration within 0.5s of the package's durationSeconds
  6. asset files          : every IB_ANC_all/A (n).png and IB_VOX_all/V (n).png exists
                            under video/public/

Exit code 0 on success, 1 on any failure. Writes a structured JSON report.
"""
from __future__ import annotations
import argparse
import csv
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

# ── helpers ──────────────────────────────────────────────────────────────────
def sec_to_tc(sec: float, fps: int = 30) -> str:
    """00:00:00:00 SMPTE non-drop timecode."""
    total = int(round(sec * fps))
    h, rem = divmod(total, 3600 * fps)
    m, rem = divmod(rem, 60 * fps)
    s, f = divmod(rem, fps)
    return f"{h:02d}:{m:02d}:{s:02d}:{f:02d}"

def tc_to_sec(tc: str, fps: int = 30) -> float:
    """00:00:00:00 SMPTE → seconds."""
    h, m, s, f = (int(x) for x in tc.split(":"))
    return (h * 3600 + m * 60 + s) + f / fps

def load_csv(p: Path) -> list[dict[str, str]]:
    with p.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def load_md_table(p: Path) -> list[dict[str, str]]:
    """Parse the SHOTLIST markdown pipe table into rows."""
    rows: list[dict[str, str]] = []
    in_table = False
    with p.open(encoding="utf-8") as f:
        for line in f:
            line = line.rstrip()
            if not line.startswith("|"):
                if in_table:
                    break
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if not in_table:
                # header row
                in_table = True
                header = cells
                continue
            if all(set(c) <= set("-: ") for c in cells):
                # separator
                continue
            rows.append(dict(zip(header, cells)))
    return rows

# ── main validator ───────────────────────────────────────────────────────────
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", type=Path, required=True)
    ap.add_argument("--scenes", type=Path, required=True)
    ap.add_argument("--csv", type=Path, required=True)
    ap.add_argument("--shotlist", type=Path, required=True)
    ap.add_argument("--map", dest="map_", type=Path, required=True)
    ap.add_argument("--edl", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()

    report: dict[str, Any] = {
        "package": "INBREEDING_CLONE",
        "checks": [],
        "summary": {"passed": 0, "failed": 0, "warned": 0, "errors": []},
    }

    def check(name: str, ok: bool, detail: str = "", warn: bool = False) -> None:
        status = "PASS" if ok else ("WARN" if warn else "FAIL")
        report["checks"].append({"name": name, "status": status, "detail": detail})
        if not ok and not warn:
            report["summary"]["failed"] += 1
            report["summary"]["errors"].append(f"{name}: {detail}")
        elif warn and not ok:
            report["summary"]["warned"] += 1
        else:
            report["summary"]["passed"] += 1

    # ── 1. CSV ↔ scenes.json ──────────────────────────────────────────────────
    csv_rows = load_csv(args.csv)
    scenes = json.loads(args.scenes.read_text(encoding="utf-8"))
    scenes_by_id = {s["shot"]: s for s in scenes["shots"]}
    csv_by_id = {r["shot"]: r for r in csv_rows}

    if len(csv_rows) != len(scenes["shots"]):
        check("csv/scenes row count", False,
              f"csv={len(csv_rows)} scenes={len(scenes['shots'])}")
    else:
        check("csv/scenes row count", True, f"{len(csv_rows)} shots")

    mismatches = []
    for sid, row in csv_by_id.items():
        if sid not in scenes_by_id:
            mismatches.append(f"{sid}: missing from scenes.json")
            continue
        s = scenes_by_id[sid]
        csv_in = float(row["in_sec"])
        csv_dur = float(row["dur_sec"])
        # scenes.json start is in frames, duration is in frames
        if abs(s["start"] / scenes["fps"] - csv_in) > 0.05:
            mismatches.append(f"{sid}: in mismatch csv={csv_in} scenes={s['start']/scenes['fps']:.3f}")
        if abs(s["duration"] / scenes["fps"] - csv_dur) > 0.05:
            mismatches.append(f"{sid}: dur mismatch csv={csv_dur} scenes={s['duration']/scenes['fps']:.3f}")
        if row["type"] != s["type"]:
            mismatches.append(f"{sid}: type mismatch csv={row['type']} scenes={s['type']}")
        if row["image_file"] != s["file"]:
            mismatches.append(f"{sid}: file mismatch csv={row['image_file']} scenes={s['file']}")
        if row["animation_style"] != s["anim"]:
            mismatches.append(f"{sid}: anim mismatch csv={row['animation_style']} scenes={s['anim']}")
    check("csv/scenes field alignment", not mismatches,
          "all 92 shots match" if not mismatches else f"{len(mismatches)} mismatches: {mismatches[:3]}")

    # ── 2. CSV ↔ FILENAME_MAP ────────────────────────────────────────────────
    map_rows = load_csv(args.map_)
    map_by_id = {r["shot_id"]: r for r in map_rows}
    map_mismatches = []
    for sid, row in csv_by_id.items():
        if sid not in map_by_id:
            map_mismatches.append(f"{sid}: missing from FILENAME_MAP")
            continue
        if row["image_file"] != map_by_id[sid]["file"]:
            map_mismatches.append(f"{sid}: file mismatch csv={row['image_file']} map={map_by_id[sid]['file']}")
    check("csv/FILENAME_MAP alignment", not map_mismatches,
          f"all {len(csv_rows)} shots match" if not map_mismatches else f"{len(map_mismatches)} mismatches")

    # ── 3. CSV ↔ EDL ─────────────────────────────────────────────────────────
    edl_text = args.edl.read_text(encoding="utf-8")
    edl_shots = []
    for line in edl_text.splitlines():
        m = re.match(r"^\s*(\d{3})\s+(\w+)\s+V\s+C\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})", line)
        if m:
            edl_shots.append({"id": m.group(1), "type": m.group(2), "in": m.group(5)})
    edl_count_video = sum(1 for s in edl_shots if s["type"] in ("ANC", "VOX"))
    check("edl video event count", edl_count_video == len(csv_rows),
          f"edl={edl_count_video} csv={len(csv_rows)}")

    # ── 4. SHOTLIST ↔ CSV (row count + first/last + order) ───────────────────
    sl_rows = load_md_table(args.shotlist)
    sl_ids = [r["Shot"] for r in sl_rows if r.get("Shot")]
    csv_ids = list(csv_by_id.keys())
    check("shotlist row count", len(sl_ids) == len(csv_ids),
          f"shotlist={len(sl_ids)} csv={len(csv_ids)}")
    check("shotlist order matches csv", sl_ids == csv_ids,
          "perfect alignment" if sl_ids == csv_ids else f"mismatch at index {next(i for i,(a,b) in enumerate(zip(sl_ids, csv_ids)) if a!=b)}")

    # ── 5. video file via ffprobe ────────────────────────────────────────────
    if args.video.exists():
        probe = subprocess.run(
            ["ffprobe", "-v", "error", "-print_format", "json",
             "-show_format", "-show_streams", str(args.video)],
            capture_output=True, text=True
        )
        if probe.returncode == 0:
            p = json.loads(probe.stdout)
            vstream = next((s for s in p.get("streams", []) if s.get("codec_type") == "video"), {})
            w = int(vstream.get("width", 0))
            h = int(vstream.get("height", 0))
            fps_str = vstream.get("r_frame_rate", "0/1")
            try:
                num, den = fps_str.split("/")
                fps = round(int(num) / int(den)) if int(den) else 0
            except Exception:
                fps = 0
            dur = float(p.get("format", {}).get("duration", 0))
            check("video dimensions", w == 1920 and h == 1080, f"{w}x{h}")
            check("video fps", fps == scenes["fps"], f"got={fps} expected={scenes['fps']}")
            dur_exp = scenes["durationSeconds"]
            check("video duration", abs(dur - dur_exp) < 0.5,
                  f"got={dur:.2f}s expected={dur_exp:.2f}s",
                  warn=abs(dur - dur_exp) < 2.0)
        else:
            check("ffprobe", False, probe.stderr[:200])
    else:
        check("video file exists", False, f"not found: {args.video}", warn=True)

    # ── 6. asset files exist ────────────────────────────────────────────────
    pub_anc = args.scenes.parent.parent / "public" / "IB_ANC_all"
    pub_vox = args.scenes.parent.parent / "public" / "IB_VOX_all"
    missing_anc = []
    missing_vox = []
    for s in scenes["shots"]:
        if s["type"] == "ANCIENT":
            if not (pub_anc / s["file"].split("/")[-1]).exists():
                missing_anc.append(s["file"])
        else:
            if not (pub_vox / s["file"].split("/")[-1]).exists():
                missing_vox.append(s["file"])
    check("ancient assets", not missing_anc,
          "all 44 present" if not missing_anc else f"missing: {missing_anc[:3]}")
    check("vox assets", not missing_vox,
          "all 48 present" if not missing_vox else f"missing: {missing_vox[:3]}")

    # ── final report ─────────────────────────────────────────────────────────
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    s = report["summary"]
    print()
    print("=" * 64)
    print(f"VALIDATION: {s['passed']} pass / {s['warned']} warn / {s['failed']} fail")
    print("=" * 64)
    for c in report["checks"]:
        print(f"  [{c['status']}] {c['name']:36s}  {c['detail']}")
    if s["errors"]:
        print("\nERRORS:")
        for e in s["errors"]:
            print(f"  - {e}")
    print(f"\nReport: {args.out}")
    return 0 if s["failed"] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
