# unique_counter.py (drop-in replacement)
#!/usr/bin/env python3
import cv2
import argparse
import os
import sys
import json
from collections import defaultdict

from utils.yolo import YoloDetector
from utils.tracker import CentroidTracker

def parse_args():
    ap = argparse.ArgumentParser(description="Count unique objects by class using centroid tracking")
    ap.add_argument("--input", required=True)
    ap.add_argument("--weights", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--names", required=True)
    ap.add_argument("--classes", nargs="*", default=None)
    ap.add_argument("--conf", type=float, default=0.5)
    ap.add_argument("--nms", type=float, default=0.4)
    ap.add_argument("--sample_rate", type=int, default=5, help="Process every Nth frame")
    ap.add_argument("--max_disappeared", type=int, default=20)
    ap.add_argument("--max_distance", type=int, default=60)
    return ap.parse_args()

def main():
    args = parse_args()
    if not os.path.exists(args.input):
        print(f"Input not found: {args.input}", file=sys.stderr)
        sys.exit(2)

    det = YoloDetector(args.weights, args.config, args.names, args.conf, args.nms, args.classes)

    trackers = {}  # class_name -> CentroidTracker
    # Track the max 'next_id' reached for each class over the whole video.
    # Because next_id starts at 0 and increments on every new object, this is the true unique count.
    unique_counts = defaultdict(int)

    cap = cv2.VideoCapture(args.input)
    if not cap.isOpened():
        print("Cannot open input video", file=sys.stderr)
        sys.exit(3)

    frame_idx = 0
    sample = max(1, int(args.sample_rate))

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        if frame_idx % sample == 0:
            detections = det.detect(frame)
            boxes_by_class = defaultdict(list)
            for d in detections:
                boxes_by_class[d["class_name"]].append(d["bbox"])

            # Update trackers per class
            for cls, boxes in boxes_by_class.items():
                if cls not in trackers:
                    trackers[cls] = CentroidTracker(args.max_disappeared, args.max_distance)
                trackers[cls].update(boxes)
                # After update, the tracker's next_id equals the number of unique objects ever registered.
                # Keep the maximum reached so far.
                if trackers[cls].next_id > unique_counts[cls]:
                    unique_counts[cls] = trackers[cls].next_id

            # Also tick disappeared for classes with no detections this round
            for cls in list(trackers.keys()):
                if cls not in boxes_by_class:
                    trackers[cls].update([])  # advance disappearance
                # No need to touch unique_counts here, next_id only grows when registering new objects.

        frame_idx += 1

    cap.release()

    # Convert defaultdict to regular dict for JSON safety
    out = { k: int(v) for k, v in unique_counts.items() }

    print("JSON_UNIQUE_COUNTS::" + json.dumps(out))
    sys.exit(0)

if __name__ == "__main__":
    main()
