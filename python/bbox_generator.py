#!/usr/bin/env python3
import cv2
import argparse
import os
import sys
from utils.yolo import YoloDetector
from utils.tracker import CentroidTracker

def parse_args():
    ap = argparse.ArgumentParser(description="Generate bounding-box video with tracking IDs")
    ap.add_argument("--input", required=True, help="Path to input video")
    ap.add_argument("--output", required=True, help="Path to output .mp4")
    ap.add_argument("--weights", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--names", required=True)
    ap.add_argument("--classes", nargs="*", default=None, help="Optional list of class names to keep")
    ap.add_argument("--conf", type=float, default=0.5)
    ap.add_argument("--nms", type=float, default=0.4)
    ap.add_argument("--max_disappeared", type=int, default=20)
    ap.add_argument("--max_distance", type=int, default=60)
    return ap.parse_args()

def main():
    args = parse_args()
    if not os.path.exists(args.input):
        print(f"Input not found: {args.input}", file=sys.stderr)
        sys.exit(2)

    det = YoloDetector(args.weights, args.config, args.names, args.conf, args.nms, args.classes)
    tracker = CentroidTracker(max_disappeared=args.max_disappeared, max_distance=args.max_distance)

    cap = cv2.VideoCapture(args.input)
    if not cap.isOpened():
        print("Cannot open input video", file=sys.stderr)
        sys.exit(3)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
    out = cv2.VideoWriter(args.output, fourcc, fps, (w, h))

    while True:
        ok, frame = cap.read()
        if not ok: break

        detections = det.detect(frame)
        boxes = [d["bbox"] for d in detections]
        ids_map = tracker.update(boxes)  # id -> centroid

        # draw
        for d in detections:
            (x,y,bw,bh) = d["bbox"]
            cls = d["class_name"]
            # find closest id to this box centroid
            cx, cy = x + bw//2, y + bh//2
            closest_id, best = None, None
            for oid, c in ids_map.items():
                dist = (c[0]-cx)**2 + (c[1]-cy)**2
                if best is None or dist < best:
                    best = dist; closest_id = oid

            cv2.rectangle(frame, (x,y), (x+bw, y+bh), (0,255,0), 2)
            label = f"{cls}#{closest_id if closest_id is not None else '?'}"
            cv2.putText(frame, label, (x, max(0, y-6)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)

        out.write(frame)

    cap.release()
    out.release()
    print("OK")
    sys.exit(0)

if __name__ == "__main__":
    main()
