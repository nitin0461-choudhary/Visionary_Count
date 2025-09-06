# Python workers

These scripts are called by Node controllers.

## Model files
Place these in `python/assets/`:
- `yolov4.weights`
- `yolov4.cfg`
- `coco.names`

## Scripts
- `bbox_generator.py` — draw boxes/labels/tracking IDs → write a video
- `unique_counter.py` — count unique objects per class using centroid tracking (sampled frames)
- `graph_analyzer.py` — create a line chart PNG of counts over time (no DB storage)

## Conventions (MUST match Node)
- Args:
  - `--input`, `--output` (where applicable)
  - `--weights`, `--config`, `--names`
  - Optional: `--classes ...`, `--conf`, `--nms`, `--sample_rate`, `--limit` (graph)
- Tagged JSON lines printed to stdout:
  - Unique counts: `JSON_UNIQUE_COUNTS::<json>`
  - Graph analyzer: `JSON_GRAPH_OUTPUT::<json>`

Return code `0` on success. Non-zero on error.

## Quick test
```bash
python3 bbox_generator.py --input ./sample.mp4 --output ./out.mp4 \
  --weights assets/yolov4.weights --config assets/yolov4.cfg --names assets/coco.names

python3 unique_counter.py --input ./sample.mp4 \
  --weights assets/yolov4.weights --config assets/yolov4.cfg --names assets/coco.names

python3 graph_analyzer.py --input ./sample.mp4 --output ./chart.png --limit 200 \
  --weights assets/yolov4.weights --config assets/yolov4.cfg --names assets/coco.names
