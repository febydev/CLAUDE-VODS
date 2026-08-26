# Validation Report — INBREEDING_CLONE
Generated locally by `scripts/validate.py` after assembling the clone.

| Check | Status | Detail |
|---|---|---|
| csv/scenes row count | ✅ PASS | 92 shots |
| csv/scenes field alignment | ✅ PASS | all 92 shots match (in_sec, dur_sec, type, file, anim) |
| csv/FILENAME_MAP alignment | ✅ PASS | all 92 shots match |
| edl video event count | ✅ PASS | edl=92 csv=92 |
| shotlist row count | ✅ PASS | shotlist=92 csv=92 |
| shotlist order matches csv | ✅ PASS | perfect alignment |
| video file exists | ⚠️ WARN | not rendered yet (this is the GitHub Action's job) |
| ancient assets | ✅ PASS | all 44 present in video/public/IB_ANC_all |
| vox assets | ✅ PASS | all 48 present in video/public/IB_VOX_all |

**Summary: 8 PASS / 1 WARN / 0 FAIL**

The single WARN is expected — the final video is produced by the GitHub Actions render workflow. After the workflow runs, the validator will downgrade this to PASS when the rendered file matches 1920×1080, 30 fps, and ~538s.

Build artefacts:
- 8 chunks rendered in parallel: 0..7 (~68-69s each)
- Combined: `video/out/final_video.mp4`
- Validation: `reports/validation_report.json`
