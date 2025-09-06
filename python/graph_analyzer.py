# #!/usr/bin/env python3
# import cv2
# import argparse
# import os
# import sys
# import json
# import matplotlib
# matplotlib.use("Agg")  # headless
# import matplotlib.pyplot as plt
# from collections import defaultdict

# from utils.yolo import YoloDetector

# def parse_args():
#     ap = argparse.ArgumentParser(description="Generate object count chart (PNG) over first N frames")
#     ap.add_argument("--input", required=True)
#     ap.add_argument("--output", required=True, help="PNG path to write chart")
#     ap.add_argument("--weights", required=True)
#     ap.add_argument("--config", required=True)
#     ap.add_argument("--names", required=True)
#     ap.add_argument("--classes", nargs="*", default=None)
#     ap.add_argument("--conf", type=float, default=0.5)
#     ap.add_argument("--nms", type=float, default=0.4)
#     ap.add_argument("--sample_rate", type=int, default=1)
#     ap.add_argument("--limit", type=int, default=200, help="Analyze up to N frames (after sampling)")
#     return ap.parse_args()

# def main():
#     args = parse_args()
#     if not os.path.exists(args.input):
#         print(f"Input not found: {args.input}", file=sys.stderr)
#         sys.exit(2)

#     det = YoloDetector(args.weights, args.config, args.names, args.conf, args.nms, args.classes)

#     cap = cv2.VideoCapture(args.input)
#     if not cap.isOpened():
#         print("Cannot open input video", file=sys.stderr)
#         sys.exit(3)

#     frames = []
#     series = defaultdict(list)  # class -> [counts per sampled frame]

#     processed = 0
#     frame_idx = 0

#     while processed < args.limit:
#         ok, frame = cap.read()
#         if not ok:
#             break
#         if frame_idx % max(1, args.sample_rate) != 0:
#             frame_idx += 1
#             continue

#         detections = det.detect(frame)
#         count_by_class = defaultdict(int)
#         for d in detections:
#             count_by_class[d["class_name"]] += 1

#         # record
#         frames.append(frame_idx)
#         # union of classes so far
#         all_classes = set(series.keys()) | set(count_by_class.keys())
#         for cls in all_classes:
#             series[cls].append(count_by_class.get(cls, 0))

#         processed += 1
#         frame_idx += 1

#     cap.release()

#     # draw chart
#     os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
#     plt.figure()
#     for cls, ys in series.items():
#         plt.plot(frames[:len(ys)], ys, label=cls)
#     plt.xlabel("Frame #")
#     plt.ylabel("Detections per frame")
#     plt.title("Object counts over time")
#     if series:
#         plt.legend(loc="upper right", fontsize="small")
#     plt.tight_layout()
#     plt.savefig(args.output)
#     plt.close()

#     out = {
#         "output_path": os.path.abspath(args.output),
#         "frames": frames,
#         "series": series,  # this is a dict[str, list[int]]
#     }
#     print("JSON_GRAPH_OUTPUT::" + json.dumps(out))
#     sys.exit(0)

# if __name__ == "__main__":
#     main()
#!/usr/bin/env python3
# python/graph_analyzer.py
import cv2
import argparse
import os
import sys
import json
import matplotlib
matplotlib.use("Agg")
from collections import defaultdict

from utils.yolo import YoloDetector

def parse_args():
    ap = argparse.ArgumentParser(description="Count selected classes for ALL sampled frames and emit JSON {frame: {class: count}}")
    ap.add_argument("--input", required=True)
    ap.add_argument("--weights", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--names", required=True)
    ap.add_argument("--classes", nargs="*", default=None, help="Class names to focus on (names from coco.names)")
    ap.add_argument("--conf", type=float, default=0.5)
    ap.add_argument("--nms", type=float, default=0.4)
    ap.add_argument("--sample_rate", type=int, default=1, help="Use every Nth frame (1 = every frame)")
    # optional chart path if you ever want it; otherwise unused
    ap.add_argument("--output", default=None)
    return ap.parse_args()

def main():
    args = parse_args()
    if not os.path.exists(args.input):
        print(f"Input not found: {args.input}", file=sys.stderr)
        sys.exit(2)

    det = YoloDetector(args.weights, args.config, args.names, args.conf, args.nms, args.classes)

    cap = cv2.VideoCapture(args.input)
    if not cap.isOpened():
        print("Cannot open input video", file=sys.stderr)
        sys.exit(3)

    focused = set(args.classes) if args.classes else None
    frame_to_counts = {}  # { frame_index: { class_name: count } }

    frame_idx = 0
    sample = max(1, int(args.sample_rate))

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        if frame_idx % sample == 0:
            detections = det.detect(frame)
            counts = defaultdict(int)
            for d in detections:
                cname = d["class_name"]
                if (focused is None) or (cname in focused):
                    counts[cname] += 1

            if focused is not None:
                for cname in focused:
                    counts.setdefault(cname, 0)

            frame_to_counts[frame_idx] = dict(counts)

        frame_idx += 1

    cap.release()

    out = {
        "frames": sorted(list(frame_to_counts.keys())),
        "counts_by_frame": {str(k): v for k, v in frame_to_counts.items()}
    }
    print("JSON_FRAME_COUNTS::" + json.dumps(out))
    sys.exit(0)

if __name__ == "__main__":
    main()
