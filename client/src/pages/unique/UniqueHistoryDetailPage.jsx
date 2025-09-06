// // File: src/pages/UniqueCountDetails.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { fetchDetails } from "../api/uniqueCount";
// import { ExternalLink } from "lucide-react";

// function BarList({ data }) {
//   const entries = Object.entries(data || {});
//   const max = useMemo(
//     () => (entries.length ? Math.max(...entries.map(([, v]) => Number(v) || 0)) : 0),
//     [entries]
//   );
//   if (!entries.length) return <p className="text-sm text-slate-500">No counts available.</p>;
//   return (
//     <ul className="space-y-2">
//       {entries.map(([k, v]) => {
//         const val = Number(v) || 0;
//         const pct = max ? Math.round((val / max) * 100) : 0;
//         return (
//           <li key={k} className="grid grid-cols-5 items-center gap-3">
//             <span className="col-span-1 truncate font-medium" title={k}>
//               {k}
//             </span>
//             <div className="col-span-3 h-2 bg-slate-100 rounded-full overflow-hidden">
//               <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
//             </div>
//             <span className="col-span-1 text-right tabular-nums">{val}</span>
//           </li>
//         );
//       })}
//     </ul>
//   );
// }

// export default function UniqueCountDetails() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const d = await fetchDetails(id); // GET /historyUniqueCount/:id
//         setData(d);
//       } catch (e) {
//         setError(e?.response?.data?.message || e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!data) return <div className="p-6">No data.</div>;

//   // Align with your controller (populates: video.title, video.cloudinary.url, video.createdAt)
//   const counts = data.countsByClass || data.result?.countsByClass || {};
//   const inputParams = data.inputParams || data.params || {};
//   const video = data.video || data.result?.video || {};
//   const createdAt = data.createdAt || data.timestamp;
//   const artifactsFlag = typeof data.artifacts === "boolean" ? data.artifacts : undefined;
//   const artifacts = Array.isArray(data.artifacts) ? data.artifacts : data.result?.artifacts;

//   const videoUrl = video?.cloudinary?.url || video?.url;

//   return (
//     <div className="mx-auto max-w-5xl p-4 pb-24">
//       <div className="mb-6 flex items-center justify-between">
//         <div className="min-w-0">
//           <h1 className="text-2xl font-semibold">Unique Count – Details</h1>
//           <p className="text-slate-600 truncate">
//             Video: <span className="font-medium">{video.title || video.name || video._id || "Unknown"}</span>
//           </p>
//           {createdAt && (
//             <p className="text-xs text-slate-500">Processed on {new Date(createdAt).toLocaleString()}</p>
//           )}
//         </div>
//         <Link to="/unique-count" className="text-indigo-600 hover:underline">
//           Back to list
//         </Link>
//       </div>

//       {/* Preview + Counts */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="rounded-2xl border border-slate-200 p-4">
//           <h2 className="font-medium mb-3">Preview</h2>
//           {videoUrl ? (
//             <div className="space-y-3">
//               <video src={videoUrl} controls className="w-full rounded-xl bg-black" />
//               <a
//                 href={videoUrl}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
//               >
//                 Open original <ExternalLink size={14} />
//               </a>
//             </div>
//           ) : (
//             <p className="text-sm text-slate-500">No preview available.</p>
//           )}
//         </div>

//         <div className="rounded-2xl border border-slate-200 p-4">
//           <h2 className="font-medium mb-3">Counts by Class</h2>
//           <BarList data={counts} />
//         </div>
//       </div>

//       {/* Params + Artifacts */}
//       <div className="mt-6 grid gap-6 md:grid-cols-2">
//         <div className="rounded-2xl border border-slate-200 p-4">
//           <h2 className="font-medium mb-3">Input Parameters</h2>
//           <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-auto max-h-64">
//             {JSON.stringify(inputParams, null, 2)}
//           </pre>
//         </div>

//         <div className="rounded-2xl border border-slate-200 p-4">
//           <h2 className="font-medium mb-3">Artifacts</h2>
//           {Array.isArray(artifacts) ? (
//             artifacts.length === 0 ? (
//               <p className="text-sm text-slate-500">No artifact files.</p>
//             ) : (
//               <ul className="list-disc ml-5 space-y-1">
//                 {artifacts.map((a, idx) => (
//                   <li key={idx}>
//                     {a?.url ? (
//                       <a href={a.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
//                         {a?.label || a?.publicId || a?.url}
//                       </a>
//                     ) : (
//                       <span className="text-slate-600">{a?.label || "Artifact"}</span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )
//           ) : (
//             <p className="text-sm text-slate-500">
//               {artifactsFlag === undefined
//                 ? "No artifact list provided."
//                 : artifactsFlag
//                 ? "Artifacts generated."
//                 : "No artifacts were generated."}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// ---------------------------------------------------------------------------
// File: src/pages/unique/UniqueHistoryDetailPage.jsx
// Detail view for a single Unique Count history item (updated to use uniqueApi)
import React from 'react';

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios.js";
import { ExternalLink, Loader2, Video as VideoIcon } from "lucide-react";

function BarList({ data }) {
  const entries = Object.entries(data || {});
  const max = useMemo(
    () => (entries.length ? Math.max(...entries.map(([, v]) => Number(v) || 0)) : 0),
    [entries]
  );
  if (!entries.length) return <p className="text-sm text-slate-500">No counts available.</p>;
  return (
    <ul className="space-y-2">
      {entries.map(([k, v]) => {
        const val = Number(v) || 0;
        const pct = max ? Math.round((val / max) * 100) : 0;
        return (
          <li key={k} className="grid grid-cols-5 items-center gap-3">
            <span className="col-span-1 truncate font-medium" title={k}>{k}</span>
            <div className="col-span-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="col-span-1 text-right tabular-nums">{val}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function UniqueHistoryDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      const res = await api.get(`/historyUniqueCount/${id}`);
      console.log("detail response in frontend =", res);

      const detail = res?.data?.data || res?.data; // unwrap correctly
      setData(detail);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  })();
}, [id]);


  if (loading) return (
    <div className="p-6 flex items-center gap-2 text-slate-600"><Loader2 className="animate-spin" size={18}/> Loading…</div>
  );
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">No data.</div>;

  const counts = data.countsByClass || data.result?.countsByClass || {};
  const inputParams = data.inputParams || data.params || {};
  const video = data.video || data.result?.video || {};
  const createdAt = data.createdAt || data.timestamp;
  const artifactsFlag = typeof data.artifacts === "boolean" ? data.artifacts : undefined;
  const artifacts = Array.isArray(data.artifacts) ? data.artifacts : data.result?.artifacts;
  const videoUrl = video?.cloudinary?.url || video?.url;

  return (
    <div className="mx-auto max-w-5xl p-4 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Unique Count – Details</h1>
          <p className="text-slate-600 truncate flex items-center gap-2"><VideoIcon size={16}/> <span className="font-medium">{video.title || video.name || video._id || "Unknown"}</span></p>
          {createdAt && (
            <p className="text-xs text-slate-500">Processed on {new Date(createdAt).toLocaleString()}</p>
          )}
        </div>
        <Link to="/unique" className="text-indigo-600 hover:underline">Back to list</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="font-medium mb-3">Preview</h2>
          {videoUrl ? (
            <div className="space-y-3">
              <video src={videoUrl} controls className="w-full rounded-xl bg-black" />
              <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                Open original <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No preview available.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="font-medium mb-3">Counts by Class</h2>
          <BarList data={counts} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="font-medium mb-3">Input Parameters</h2>
          <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-auto max-h-64">{JSON.stringify(inputParams, null, 2)}</pre>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="font-medium mb-3">Artifacts</h2>
          {Array.isArray(artifacts) ? (
            artifacts.length === 0 ? (
              <p className="text-sm text-slate-500">No artifact files.</p>
            ) : (
              <ul className="list-disc ml-5 space-y-1">
                {artifacts.map((a, idx) => (
                  <li key={idx}>
                    {a?.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{a?.label || a?.publicId || a?.url}</a>
                    ) : (
                      <span className="text-slate-600">{a?.label || "Artifact"}</span>
                    )}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-sm text-slate-500">
              {artifactsFlag === undefined
                ? "No artifact list provided."
                : artifactsFlag
                ? "Artifacts generated."
                : "No artifacts were generated."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// (Optional compatibility shim)
// File: src/pages/unique/UniqueCountDetails.jsx
// If some routes still import `UniqueCountDetails`, re-export the updated page.

//export { default } from "./UniqueHistoryDetailPage";
