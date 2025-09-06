// src/utils/checksum.js
import crypto from "crypto";
import fs from "fs";

export async function fileChecksum(localPath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const s = fs.createReadStream(localPath);
    s.on("error", reject);
    s.on("data", (d) => hash.update(d));
    s.on("end", () => resolve(hash.digest("hex")));
  });
}
