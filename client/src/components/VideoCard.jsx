/* A compact, reusable card for each uploaded video */
import React from "react";
export default function VideoCard({ video, onDelete, onOpen }) {
  const { _id, title, description, cloudinary, createdAt } = video || {};
  const url = cloudinary?.url;

  const copyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      alert("Copied video URL to clipboard!");
    } catch {
      alert("Failed to copy URL.");
    }
  };

  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden bg-white flex flex-col">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {url ? (
          <video
            src={url}
            className="w-full h-full object-cover"
            controls={false}
            muted
            onClick={() => onOpen?.(url)}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-500 text-sm">
            No preview
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{title || "Untitled video"}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </span>
        </div>
        {description ? (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No description</p>
        )}

        <div className="mt-3 flex items-center gap-2">
          {url && (
            <button
              onClick={() => onOpen?.(url)}
              className="px-3 py-1.5 rounded-xl bg-black text-white text-sm hover:opacity-90"
            >
              Play
            </button>
          )}
          {url && (
            <button
              onClick={copyLink}
              className="px-3 py-1.5 rounded-xl bg-gray-900/5 text-sm hover:bg-gray-900/10"
            >
              Copy link
            </button>
          )}
          <button
            onClick={() => onDelete?.(_id)}
            className="ml-auto px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-sm hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
