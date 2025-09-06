// // File: src/pages/UniqueCountDetails.jsx
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { fetchDetails } from "../api/uniqueCount";
// import { Loader2, Video } from "lucide-react";

// export default function UniqueCountDetails() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const d = await fetchDetails(id);
//         setData(d);
//       } catch (e) {
//         setError(e?.response?.data?.message || e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="p-6 flex items-center gap-2 text-slate-600">
//         <Loader2 className="animate-spin" size={20} /> Loading details...
//       </div>
//     );
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!data) return <div className="p-6">No data.</div>;

//   const counts = data.countsByClass || {};
//   const artifacts = data.artifacts || [];
//   const inputParams = data.inputParams || {};
//   const video = data.video || {};

//   return (
//     <div className="mx-auto max-w-5xl p-4 pb-24">
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold">Unique Count – Details</h1>
//           <p className="text-slate-600 flex items-center gap-2">
//             <Video size={18} /> {video.title || "Untitled Video"}
//           </p>
//         </div>
//         <Link to="/unique-count" className="text-indigo-600 hover:underline">
//           Back to list
//         </Link>
//       </div>

//       {/* Video preview */}
//       {video.cloudinary?.url && (
//         <div className="mb-6">
//           <video
//             src={video.cloudinary.url}
//             controls
//             className="rounded-xl w-full border border-slate-200 shadow"
//           />
//         </div>
//       )}

//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="rounded-2xl border border-slate-200 p-4">
//           <h2 className="font-medium mb-3">Counts by Class</h2>
//           {Object.keys(counts).length === 0 ? (
//             <p className="text-sm text-slate-500">No counts available.</p>
//           ) : (
//             <ul className="space-y-1">
//               {Object.entries(counts).map(([k, v]) => (
//                 <li
//                   key={k}
//                   className="flex justify-between border-b last:border-none py-1"
//                 >
//                   <span className="font-medium">{k}</span>
//                   <span>{v}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="rounded-2xl border border-slate-200 p-4">
//           <h2 className="font-medium mb-3">Input Parameters</h2>
//           <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-auto max-h-64">
//             {JSON.stringify(inputParams, null, 2)}
//           </pre>
//         </div>
//       </div>

//       <div className="mt-6 rounded-2xl border border-slate-200 p-4">
//         <h2 className="font-medium mb-3">Artifacts</h2>
//         {Array.isArray(artifacts) && artifacts.length > 0 ? (
//           <ul className="list-disc ml-5 space-y-1">
//             {artifacts.map((a, idx) => (
//               <li key={idx}>
//                 {a?.url ? (
//                   <a
//                     href={a.url}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-indigo-600 hover:underline"
//                   >
//                     {a?.label || a?.publicId || a?.url}
//                   </a>
//                 ) : (
//                   <span className="text-slate-600">{a?.label || "Artifact"}</span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-slate-500">No artifact files.</p>
//         )}
//       </div>
//     </div>
//   );
// }
// File: src/pages/unique/UniqueFeaturePage.jsx
// Select a video, run Unique Count, and browse recent history.
// import React from 'react';

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../../api/axios.js";
// import { Loader2, Play, History, Video as VideoIcon } from "lucide-react";

// export default function UniqueFeaturePage() {
//   const nav = useNavigate();

//   // library
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   // run form
//   const [videoId, setVideoId] = useState("");
//   const [classesStr, setClassesStr] = useState(""); // comma separated
//   const [conf, setConf] = useState(0.5);
//   const [nms, setNms] = useState(0.4);
//   const [submitting, setSubmitting] = useState(false);

//   // history
//   const [history, setHistory] = useState([]);
//   const [histLoading, setHistLoading] = useState(true);

//   // load user's videos
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/historyUniqueCount/choices/list`); // axios canvas exposes .list()
//         const items = res?.data || res?.videos || res || [];
//         setVideos(items);
//         if (!videoId && items?.[0]?._id) setVideoId(items[0]._id);
//       } catch (e) {
//         setErr(e?.response?.data?.message || e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // load recent unique history
//   useEffect(() => {
//     (async () => {
//       try {
//         setHistLoading(true);
//         const h = await api.get(`/historyUniqueCount/cards`);
//         setHistory(h?.data || h?.items || h || []);
//       } catch (e) {
//         // no-op on first load
//       } finally {
//         setHistLoading(false);
//       }
//     })();
//   }, []);

//   const classes = useMemo(
//     () => classesStr.split(",").map((s) => s.trim()).filter(Boolean),
//     [classesStr]
//   );

//   async function onSubmit(e) {
//     e.preventDefault();
//     if (!videoId) return;
//     setSubmitting(true);
//     try {
//       const payload = { classes, conf: Number(conf), nms: Number(nms) };
//       const res = await uniqueApi.run(videoId, payload);
//       const d = res?.data || res;
//       const historyId = d?._id || d?.historyId || d?.result?._id;
//       if (historyId) nav(`/unique/${historyId}`);
//       else alert("Unique Count started. Check history for details.");
//     } catch (e) {
//       alert(e?.response?.data?.message || e.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading)
//     return (
//       <div className="p-6 flex items-center gap-2 text-slate-600">
//         <Loader2 className="animate-spin" size={18} /> Loading…
//       </div>
//     );
//   if (err) return <div className="p-6 text-red-600">{err}</div>;

//   return (
//     <div className="mx-auto max-w-5xl p-4 pb-24">
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Unique Count</h1>
//         <Link to="/unique" className="text-indigo-600 hover:underline">Refresh</Link>
//       </div>

//       {/* Runner */}
//       <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 p-4 mb-8 space-y-4">
//         <div className="grid md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm text-slate-600 mb-1">Select Video</label>
//             <div className="flex items-center gap-2">
//               <VideoIcon size={16} className="text-slate-500" />
//               <select
//                 value={videoId}
//                 onChange={(e) => setVideoId(e.target.value)}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 {videos.map((v) => (
//                   <option key={v._id} value={v._id}>
//                     {v.title || v.name || v._id}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm text-slate-600 mb-1">Classes (comma separated)</label>
//             <input
//               value={classesStr}
//               onChange={(e) => setClassesStr(e.target.value)}
//               placeholder="person, car, bicycle"
//               className="w-full border rounded-lg px-3 py-2"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-slate-600 mb-1">Conf</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="1"
//                 value={conf}
//                 onChange={(e) => setConf(e.target.value)}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-600 mb-1">NMS</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="1"
//                 value={nms}
//                 onChange={(e) => setNms(e.target.value)}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         <button
//           disabled={submitting || !videoId}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
//         >
//           {submitting ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />} Run Unique Count
//         </button>
//       </form>

//       {/* Recent History */}
//       <div className="rounded-2xl border border-slate-200 p-4">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-medium flex items-center gap-2">
//             <History size={18} /> Recent Runs
//           </h2>
//           <Link to="/unique" className="text-sm text-indigo-600 hover:underline">
//             Reload
//           </Link>
//         </div>
//         {histLoading ? (
//           <div className="text-slate-600 text-sm">Loading history…</div>
//         ) : history.length === 0 ? (
//           <p className="text-sm text-slate-500">No history yet.</p>
//         ) : (
//           <ul className="grid md:grid-cols-2 gap-4">
//             {history.map((h) => (
//               <li key={h._id} className="border rounded-xl p-4">
//                 <p className="font-medium truncate">{h?.video?.title || h?.video?.name || h?._id}</p>
//                 <p className="text-xs text-slate-500 mb-3">
//                   {new Date(h.createdAt || h.timestamp).toLocaleString()}
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-slate-600">
//                     Classes: {(h?.inputParams?.classes || []).join(", ") || "—"}
//                   </div>
//                   <Link className="text-indigo-600 text-sm hover:underline" to={`/unique/${h._id}`}>
//                     Open
//                   </Link>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.js";
import { Loader2, Play, History, Video as VideoIcon } from "lucide-react";

export default function UniqueFeaturePage() {
  const nav = useNavigate();

  // library
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // run form
  const [videoId, setVideoId] = useState("");
  const [classesStr, setClassesStr] = useState(""); // comma separated
  const [conf, setConf] = useState(0.5);
  const [nms, setNms] = useState(0.4);
  const [submitting, setSubmitting] = useState(false);

  // history
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(true);

  // load user's videos
  useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      const res = await api.get(`/historyUniqueCount/choices/list`);
     /// console.log("choices list raw data:", JSON.stringify(res.data, null, 2));
     
      //console.log("choices list response:", res);

      // Assume backend sends { videos: [...] }
      //const items = res?.data?.videos || res?.data || [];
      const items = Array.isArray(res?.data?.data) ? res.data.data : [];
      setVideos(items);

     // setVideos(items);

      if (!videoId && items?.[0]?._id) {
        setVideoId(items[0]._id);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  })();
}, []);

  // load recent unique history
  useEffect(() => {
    (async () => {
      try {
        setHistLoading(true);
        const res = await api.get(`/historyUniqueCount/cards`);
       // console.log("history response:", res);

        const h = Array.isArray(res?.data?.data) ? res.data.data : [];
        // Array.isArray(res?.data)
        //   ? res.data
        //   : Array.isArray(res?.data?.items)
        //   ? res.data.items
        //   : Array.isArray(res?.items)
        //   ? res.items
        //   : [];
        console.log(" in frontend  cards=",h);
        setHistory(h);
      } catch (e) {
        // no-op on first load
      } finally {
        setHistLoading(false);
      }
    })();
  }, []);

  const classes = useMemo(
    () => classesStr.split(",").map((s) => s.trim()).filter(Boolean),
    [classesStr]
  );

  async function onSubmit(e) {
    e.preventDefault();
    if (!videoId) return;
    setSubmitting(true);
    try {
      const payload = { classes, conf: Number(conf), nms: Number(nms) };
      const res = await api.post(`/historyUniqueCount/run/${videoId}`,payload);
      const d = res?.data || res;
      const historyId = d?._id || d?.historyId || d?.result?._id;
      if (historyId) nav(`/unique/${historyId}`);
      else alert("Unique Count started. Check history for details.");
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 flex items-center gap-2 text-slate-600">
        <Loader2 className="animate-spin" size={18} /> Loading…
      </div>
    );
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="mx-auto max-w-5xl p-4 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Unique Count</h1>
        <Link to="/unique" className="text-indigo-600 hover:underline">
          Refresh
        </Link>
      </div>

      {/* Runner */}
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 p-4 mb-8 space-y-4"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Select Video
            </label>
            <div className="flex items-center gap-2">
              <VideoIcon size={16} className="text-slate-500" />
              <select
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                {Array.isArray(videos) &&
                  videos.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.title || v.name || v._id}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Classes (comma separated)
            </label>
            <input
              value={classesStr}
              onChange={(e) => setClassesStr(e.target.value)}
              placeholder="person, car, bicycle"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Conf</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={conf}
                onChange={(e) => setConf(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">NMS</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={nms}
                onChange={(e) => setNms(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        <button
          disabled={submitting || !videoId}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Play size={16} />
          )}{" "}
          Run Unique Count
        </button>
      </form>

      {/* Recent History */}
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium flex items-center gap-2">
            <History size={18} /> Recent Runs
          </h2>
          <Link
            to="/unique"
            className="text-sm text-indigo-600 hover:underline"
          >
            Reload
          </Link>
        </div>
        {histLoading ? (
          <div className="text-slate-600 text-sm">Loading history…</div>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-500">No history yet.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {Array.isArray(history) &&
              history.map((h) => (
                <li key={h._id} className="border rounded-xl p-4">
                  <p className="font-medium truncate">
                    {h?.video?.title || h?.video?.name || h?._id}
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    {new Date(h.createdAt || h.timestamp).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Classes:{" "}
                      {(h?.inputParams?.classes || []).join(", ") || "—"}
                    </div>
                    <Link
                      className="text-indigo-600 text-sm hover:underline"
                      to={`/unique/${h._id}`}
                    >
                      Open
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
