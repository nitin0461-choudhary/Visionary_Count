


# `python/utils/yolo.`
import cv2
import numpy as np

class YoloDetector:
    def __init__(self, weights_path, config_path, names_path, conf_thresh=0.5, nms_thresh=0.4, class_filter=None):
        self.net = cv2.dnn.readNet(weights_path, config_path)
        self.output_layers = self.net.getUnconnectedOutLayersNames()
        with open(names_path, "r") as f:
            self.classes = [c.strip() for c in f.readlines()]
        self.conf_thresh = float(conf_thresh)
        self.nms_thresh = float(nms_thresh)
        self.class_filter = set(class_filter) if class_filter else None

    def detect(self, frame):
        """Returns list of dicts: {bbox:[x,y,w,h], conf:float, class_id:int, class_name:str}"""
        h, w = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416), (0,0,0), swapRB=True, crop=False)
        self.net.setInput(blob)
        layer_outputs = self.net.forward(self.output_layers)

        boxes, confs, class_ids = [], [], []
        for output in layer_outputs:
            for det in output:
                scores = det[5:]
                class_id = int(np.argmax(scores))
                confidence = float(scores[class_id])
                if confidence < self.conf_thresh:
                    continue
                if self.class_filter and self.classes[class_id] not in self.class_filter:
                    continue
                cx, cy, bw, bh = det[0]*w, det[1]*h, det[2]*w, det[3]*h
                x = int(cx - bw/2); y = int(cy - bh/2)
                boxes.append([x, y, int(bw), int(bh)])
                confs.append(confidence)
                class_ids.append(class_id)

        idxs = cv2.dnn.NMSBoxes(boxes, confs, self.conf_thresh, self.nms_thresh)
        results = []
        if len(idxs) > 0:
            for i in idxs.flatten():
                results.append({
                    "bbox": boxes[i],
                    "conf": float(confs[i]),
                    "class_id": int(class_ids[i]),
                    "class_name": self.classes[class_ids[i]]
                })
        return results
