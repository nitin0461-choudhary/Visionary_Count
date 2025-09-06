import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Config:
 * - If you set CLOUDINARY_URL in .env, the SDK auto-loads it.
 * - OR set explicit keys below (uncomment).
 */
cloudinary.config({
  // If using explicit keys, uncomment and fill:
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // always https links
});

// If you prefer to pass the single URL explicitly (optional):
// if (process.env.CLOUDINARY_URL) {
//   cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL, secure: true });
// }

const safeUnlink = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("Failed to remove temp file:", err.message);
  }
};

/**
 * Upload a local file to Cloudinary and return a normalized object
 * so callers can always read .url and .public_id
 */
export const uploadOnCloudinary = async (localFilePath, resourceType = "auto", folder = "uploads") => {
  try {
    if (!localFilePath) return null;

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,   // "image" | "video" | "auto"
      folder,                        // optional folder for organization
    });

    safeUnlink(localFilePath);

    // NORMALIZE: always expose .url (https) and .public_id
    return {
      url: res.secure_url || res.url || "",
      public_id: res.public_id || "",
      resource_type: res.resource_type,
      bytes: res.bytes,
      width: res.width,
      height: res.height,
      format: res.format,
      original_filename: res.original_filename,
    };
  } catch (err) {
    safeUnlink(localFilePath);
    // Temporary debug (uncomment if needed):
    // console.error("Cloudinary upload error:", err);
    return null;
  }
};

/**
 * Delete a Cloudinary asset by public_id
 */
export const destroyOnCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return { result: "skipped" };
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, // "image" | "video"
      invalidate: true,
    });
    return res;
  } catch (err) {
    return { result: "error", error: err.message };
  }
};
