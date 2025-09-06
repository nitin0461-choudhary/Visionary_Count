import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const TEMP_DIR = path.resolve("./public/temp");

// ensure temp dir exists
function ensureTempDir() {
  try {
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch (e) {
    console.error("Failed to create temp dir:", e.message);
  }
}
ensureTempDir();

// sanitize filename (keep ascii-ish, no path parts)
function sanitizeBase(name) {
  return name
    .replace(/[/\\?%*:|"<>]/g, "_") // remove dangerous chars
    .replace(/\s+/g, "-")           // spaces → dashes
    .toLowerCase()
    .slice(0, 80);                  // keep it short
}

function uniqueName(originalname) {
  const ext = path.extname(originalname || "").toLowerCase() || "";
  const base = sanitizeBase(path.basename(originalname || "upload", ext));
  const rand = crypto.randomBytes(6).toString("hex");
  const stamp = Date.now();
  return `${base || "file"}-${stamp}-${rand}${ext}`;
}

// disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TEMP_DIR),
  filename: (req, file, cb) => cb(null, uniqueName(file.originalname)),
});

// MIME filters
const imageMimeSet = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const videoMimeSet = new Set([
  "video/mp4",
  "video/quicktime",      // .mov
  "video/x-matroska",     // .mkv
  "video/webm",
  "video/avi",
  "video/mpeg",
]);

function makeFileFilter(allowedSet) {
  return (req, file, cb) => {
    if (!allowedSet.has(file.mimetype)) {
      return cb(new Error(`Unsupported file type: ${file.mimetype || "unknown"}`));
    }
    cb(null, true);
  };
}

// size limits (tune as needed)
const IMAGE_LIMIT = 5 * 1024 * 1024;      // 5MB
const VIDEO_LIMIT = 200 * 1024 * 1024;    // 200MB

// Export ready-to-use uploaders:

// 1) Single avatar image: field name "avatar"
export const uploadAvatar = multer({
  storage,
  fileFilter: makeFileFilter(imageMimeSet),
  limits: { fileSize: IMAGE_LIMIT },
});

// 2) Single video file: field name "video"
export const uploadVideo = multer({
  storage,
  fileFilter: makeFileFilter(videoMimeSet),
  limits: { fileSize: VIDEO_LIMIT },
});

// 3) For register route using fields (only avatar here)
export const uploadRegisterFields = multer({
  storage,
  fileFilter: makeFileFilter(imageMimeSet),
  limits: { fileSize: IMAGE_LIMIT },
});
