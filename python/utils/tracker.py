import math
from collections import OrderedDict

def euclidean(a, b):
    return math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)

class CentroidTracker:
    """
    Minimal centroid tracker assigning stable IDs.
    Tracks centroids; if a detection is near an existing centroid, it reuses the ID.
    """
    def __init__(self, max_disappeared=30, max_distance=50):
        self.next_id = 0
        self.objects = OrderedDict()     # id -> (cx, cy)
        self.disappeared = OrderedDict() # id -> ticks
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def _register(self, c):
        oid = self.next_id
        self.objects[oid] = c
        self.disappeared[oid] = 0
        self.next_id += 1
        return oid

    def _deregister(self, oid):
        del self.objects[oid]
        del self.disappeared[oid]

    def update(self, boxes):
        """
        boxes: list of [x,y,w,h]
        returns map: id -> centroid
        """
        if len(boxes) == 0:
            # mark disappeared
            for oid in list(self.disappeared.keys()):
                self.disappeared[oid] += 1
                if self.disappeared[oid] > self.max_disappeared:
                    self._deregister(oid)
            return self.objects

        input_centroids = []
        for (x,y,w,h) in boxes:
            cx = int(x + w/2); cy = int(y + h/2)
            input_centroids.append((cx, cy))

        if len(self.objects) == 0:
            for c in input_centroids:
                self._register(c)
            return self.objects

        # match by nearest neighbor greedy
        existing_ids = list(self.objects.keys())
        existing_centroids = [self.objects[i] for i in existing_ids]

        used_input = set()
        used_existing = set()

        # For each input centroid, find closest existing
        for in_idx, c in enumerate(input_centroids):
            # best match
            best_dist = None
            best_eidx = None
            for eidx, oc in enumerate(existing_centroids):
                if eidx in used_existing:
                    continue
                d = euclidean(c, oc)
                if best_dist is None or d < best_dist:
                    best_dist = d
                    best_eidx = eidx
            if best_dist is not None and best_dist <= self.max_distance:
                oid = existing_ids[best_eidx]
                self.objects[oid] = c
                self.disappeared[oid] = 0
                used_input.add(in_idx)
                used_existing.add(best_eidx)

        # unmatched input -> register
        for in_idx, c in enumerate(input_centroids):
            if in_idx not in used_input:
                self._register(c)

        # unmatched existing -> disappear++
        for eidx, oid in enumerate(existing_ids):
            if eidx not in used_existing:
                self.disappeared[oid] += 1
                if self.disappeared[oid] > self.max_disappeared:
                    self._deregister(oid)

        return self.objects
