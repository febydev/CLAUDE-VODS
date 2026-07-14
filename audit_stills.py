import json
import os
from PIL import Image, ImageStat

folder = os.path.join(os.path.dirname(__file__), "out")
records = []
for name in sorted(item for item in os.listdir(folder) if item.endswith(".png")):
    path = os.path.join(folder, name)
    with Image.open(path) as image:
        rgb = image.convert("RGB")
        stat = ImageStat.Stat(rgb.resize((96, 54)))
        mean = stat.mean
        luma = 0.2126 * mean[0] + 0.7152 * mean[1] + 0.0722 * mean[2]
        extrema = rgb.getextrema()
        records.append({
            "file": name,
            "size": list(image.size),
            "meanLuma": round(luma, 2),
            "extrema": extrema,
            "blank": max(high - low for low, high in extrema) < 12,
        })
assert all(record["size"] == [1920, 1080] for record in records)
assert not any(record["blank"] for record in records)
assert min(record["meanLuma"] for record in records) >= 35
with open(os.path.join(folder, "still_audit.json"), "w", encoding="utf-8") as handle:
    json.dump(records, handle, indent=2)
print(json.dumps(records, indent=2))