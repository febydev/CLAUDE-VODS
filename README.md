# Iran video

The supplied 249-shot edit, rendered at 1920 x 1080, 25 fps. Duration: 36,855 frames / 24:34.200. The original narration lasts 24:34.190 and is padded by 10 ms to the last video frame. No background music.

## Contents

- 107 narrative illustrations from `iran1 org-all` and 72 VOX collages from `iran 2 vox org`.
- 70 animated native SVG graphics, recovered from the original production package.
- 72 timed title overlays. Impact/Bahnschrift text is exported as artwork so rendering does not depend on system fonts.
- One continuous narration/SFX master. Narration gain is -1.8 dB; 42 restrained cues use gain 0.10. The final conflict and closing sections remain quiet.

The locked CSV provides every shot boundary and title cue. Source image names were matched against the prompt content; `production/asset_mapping.json` records the selected originals and hashes. Generated borders and baked text were cleaned in derived images. Original images and narration remain untouched in the parent project folder.

Camera motion follows the flat-image fallback in the edit specification. Optional independent object masks/parallax layers were not supplied. Paragraph dissolves use six frames centered on the recorded cut. No intro, CTA, extra facts, or narration retiming was added.

## Local use

```sh
npm ci
node scripts/verify.mjs
npx tsc --noEmit
npm run dev
npm run render
```

For a local Windows render, an installed Chrome can be selected using `--browser-executable`. Remotion 4.0.481 is pinned in the lockfile.

## GitHub Actions

Run **Render video** on this video's branch. Eight chunks are planned by default, with boundaries at real cuts. Chunks contain picture only. The combine job verifies every frame count, concatenates without recompressing the picture, and encodes the continuous master once to 192 kbps AAC. The final artifact is `iran_final_video` containing `IRAN_final.mp4` and its probe report.

## Validation and limits

The asset/timing check verifies 249 contiguous shots, 179 unique source illustrations, 70 outlined graphics, all 72 title holds of at least two seconds, and 42 SFX cues. TypeScript passes. Local stills and a 52-second opening preview were checked. The full mix measures -18.8 LUFS and -4.6 dBTP before final AAC encoding.

The supplied narration and its September 27, 2026 factual cutoff are preserved. This edit does not independently resolve the pronunciation listening questions listed in the original production QC document. Stylized generated artwork retains its original drawing inconsistencies.
