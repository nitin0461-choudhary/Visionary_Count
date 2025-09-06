import { ApiError } from "../utils/ApiError.js";

/**
 * Multer error handler middleware
 * Place immediately after multer middlewares in your route chain
 * Example:
 *   router.post("/upload", uploadVideo.single("video"), handleMulterError, controllerFn);
 */
export function handleMulterError(err, req, res, next) {
  if (!err) return next();

  // Multer errors have .code like "LIMIT_FILE_SIZE"
  if (err.code === "LIMIT_FILE_SIZE") {
    return next(new ApiError(400, "File too large"));
  }

  // Custom fileFilter error or other multer errors
  return next(new ApiError(400, err.message || "Upload error"));
}
