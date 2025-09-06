// // // // // export default function Home() {
// // // // //   return (
// // // // //     <div className="p-4">
// // // // //       <h2 className="text-xl font-semibold mb-2">Home</h2>
// // // // //       <p>Use the navbar to upload a video, generate graphs, count unique objects, create bbox videos, and view history.</p>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // import { useEffect, useState } from "react";
// // // // import { Link } from "react-router-dom";
// // // // import api, { unwrap } from "../api/axios";
// // // // import { useAuth } from "../context/AuthContext";

// // // // export default function Home() {
// // // //   const { user } = useAuth();
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [err, setErr] = useState("");
// // // //   const [videos, setVideos] = useState([]);
// // // //   const [history, setHistory] = useState([]);

// // // //   useEffect(() => {
// // // //     let mounted = true;
// // // //     (async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         setErr("");

// // // //         // fetch in parallel (works even if Home is public and user is not logged in)
// // // //         const [vRes, hRes] = await Promise.allSettled([
// // // //           api.get("/videos"),
// // // //           api.get("/feature-history"),
// // // //         ]);

// // // //         if (mounted) {
// // // //           if (vRes.status === "fulfilled") {
// // // //             const v = unwrap(vRes.value) || [];
// // // //             setVideos(v.items || v);
// // // //           }
// // // //           if (hRes.status === "fulfilled") {
// // // //             const h = unwrap(hRes.value) || [];
// // // //             setHistory(h.items || h);
// // // //           }
// // // //         }
// // // //       } catch (e) {
// // // //         if (mounted) setErr(e?.response?.data?.message || "Failed to load data");
// // // //       } finally {
// // // //         if (mounted) setLoading(false);
// // // //       }
// // // //     })();
// // // //     return () => { mounted = false; };
// // // //   }, []);

// // // //   const recentVideos = videos.slice(0, 3);
// // // //   const recentHistory = history.slice(0, 5);

// // // //   return (
// // // //     <div className="p-4 max-w-6xl mx-auto">
// // // //       {/* Header */}
// // // //       <div className="mb-6">
// // // //         <h1 className="text-2xl md:text-3xl font-semibold">
// // // //           {user ? `Welcome, ${user.fullName || user.username}!` : "Welcome to Object Counter"}
// // // //         </h1>
// // // //         <p className="text-zinc-400 mt-1">
// // // //           Upload a video, analyze object counts over time, compute unique instances, draw bounding boxes, and
// // // //           review your history — all from one place.
// // // //         </p>
// // // //       </div>

// // // //       {/* Public CTA when logged out */}
// // // //       {!user && (
// // // //         <div className="mb-8 rounded border border-zinc-800 p-4">
// // // //           <p className="mb-3">You’re browsing as a guest. Sign in to start processing videos.</p>
// // // //           <div className="flex gap-2">
// // // //             <Link className="border border-zinc-600 px-3 py-1 rounded hover:bg-zinc-800" to="/login">Login</Link>
// // // //             <Link className="border border-zinc-600 px-3 py-1 rounded hover:bg-zinc-800" to="/register">Register</Link>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Quick Actions */}
// // // //       <section className="mb-8">
// // // //         <h2 className="text-xl font-semibold mb-3">Quick actions</h2>
// // // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
// // // //           <ActionCard to="/upload" title="Upload Video" desc="Add a new video to your library" />
// // // //           <ActionCard to="/graph" title="Graph Analysis" desc="Counts per frame as a chart" />
// // // //           <ActionCard to="/unique" title="Unique Counts" desc="Total distinct objects per class" />
// // // //           <ActionCard to="/bbox" title="BBox Video" desc="Generate detection overlay video" />
// // // //         </div>
// // // //       </section>

// // // //       {/* Loading / Error */}
// // // //       {loading && (
// // // //         <div className="py-10 text-zinc-400">Loading your recent items…</div>
// // // //       )}
// // // //       {!!err && (
// // // //         <div className="mb-6 text-red-400">{err}</div>
// // // //       )}

// // // //       {/* Recent Videos */}
// // // //       {!loading && (
// // // //         <section className="mb-10">
// // // //           <div className="flex items-center justify-between mb-3">
// // // //             <h2 className="text-xl font-semibold">Recent videos</h2>
// // // //             <Link to="/upload" className="text-sm text-blue-400 hover:text-blue-300">Upload another →</Link>
// // // //           </div>

// // // //           {recentVideos.length === 0 ? (
// // // //             <EmptyState
// // // //               text="No videos yet. Upload your first video to get started."
// // // //               ctaText="Go to Upload"
// // // //               to="/upload"
// // // //             />
// // // //           ) : (
// // // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // //               {recentVideos.map((v) => (
// // // //                 <div key={v._id} className="border border-zinc-800 rounded overflow-hidden">
// // // //                   <div className="bg-zinc-900 aspect-video flex items-center justify-center">
// // // //                     {/* If your backend gives thumbnails, swap the <div> with an <img> */}
// // // //                     <video className="w-full h-full" muted>
// // // //                       <source src={v.url} type="video/mp4" />
// // // //                     </video>
// // // //                   </div>
// // // //                   <div className="p-3">
// // // //                     <div className="text-sm text-zinc-300 truncate">
// // // //                       {v.original_filename || v.filename || `Video ${v._id.slice(-6)}`}
// // // //                     </div>
// // // //                     <div className="text-xs text-zinc-500">
// // // //                       {new Date(v.createdAt).toLocaleString()}
// // // //                     </div>
// // // //                     <div className="mt-2 flex gap-2">
// // // //                       <Link className="border border-zinc-700 px-2 py-1 rounded text-xs hover:bg-zinc-800"
// // // //                             to={`/graph?video=${v._id}`}>Graph</Link>
// // // //                       <Link className="border border-zinc-700 px-2 py-1 rounded text-xs hover:bg-zinc-800"
// // // //                             to={`/unique?video=${v._id}`}>Unique</Link>
// // // //                       <Link className="border border-zinc-700 px-2 py-1 rounded text-xs hover:bg-zinc-800"
// // // //                             to={`/bbox?video=${v._id}`}>BBox</Link>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           )}
// // // //         </section>
// // // //       )}

// // // //       {/* Recent Analyses */}
// // // //       {!loading && (
// // // //         <section className="mb-6">
// // // //           <div className="flex items-center justify-between mb-3">
// // // //             <h2 className="text-xl font-semibold">Recent analyses</h2>
// // // //             <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300">View all history →</Link>
// // // //           </div>

// // // //           {recentHistory.length === 0 ? (
// // // //             <EmptyState
// // // //               text="No analyses yet. Run Graph, Unique, or BBox on one of your videos."
// // // //               ctaText="See Quick Actions"
// // // //               to="/graph"
// // // //             />
// // // //           ) : (
// // // //             <div className="space-y-2">
// // // //               {recentHistory.map((h) => {
// // // //                 const type = h.featureType || h.type;
// // // //                 const video = h.video;
// // // //                 const to =
// // // //                   type === "graph" ? `/graph?video=${video}` :
// // // //                   type === "unique" ? `/unique?video=${video}` :
// // // //                   type === "bbox" ? `/bbox?video=${video}` : "/history";
// // // //                 return (
// // // //                   <Link
// // // //                     key={h._id}
// // // //                     to={to}
// // // //                     className="block border border-zinc-800 rounded p-3 hover:bg-zinc-900"
// // // //                   >
// // // //                     <div className="flex items-center justify-between">
// // // //                       <div className="capitalize">{type} analysis</div>
// // // //                       <div className="text-xs text-zinc-500">{new Date(h.createdAt).toLocaleString()}</div>
// // // //                     </div>
// // // //                     {type === "unique" && h.output?.uniqueCounts && (
// // // //                       <div className="text-xs text-zinc-400 mt-1">
// // // //                         {Object.keys(h.output.uniqueCounts).slice(0, 3).join(", ")}
// // // //                         {Object.keys(h.output.uniqueCounts).length > 3 ? "…" : ""}
// // // //                       </div>
// // // //                     )}
// // // //                   </Link>
// // // //                 );
// // // //               })}
// // // //             </div>
// // // //           )}
// // // //         </section>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // /* ---------- Small helper components ---------- */

// // // // function ActionCard({ to, title, desc }) {
// // // //   return (
// // // //     <Link to={to} className="border border-zinc-800 rounded p-4 hover:bg-zinc-900">
// // // //       <div className="font-medium">{title}</div>
// // // //       <div className="text-sm text-zinc-400 mt-1">{desc}</div>
// // // //       <div className="text-sm text-blue-400 mt-2">Open →</div>
// // // //     </Link>
// // // //   );
// // // // }

// // // // function EmptyState({ text, ctaText, to }) {
// // // //   return (
// // // //     <div className="border border-dashed border-zinc-700 rounded p-6 text-zinc-400">
// // // //       <p>{text}</p>
// // // //       <Link to={to} className="inline-block mt-3 border border-zinc-700 px-3 py-1 rounded hover:bg-zinc-800">
// // // //         {ctaText}
// // // //       </Link>
// // // //     </div>
// // // //   );
// // // // }
// // // import { useEffect, useState } from "react";
// // // import { Link } from "react-router-dom";
// // // import api, { unwrap } from "../api/axios";
// // // import { useAuth } from "../context/AuthContext";

// // // /** Visionary Count – Dashboard */
// // // export default function Dashboard() {
// // //   const { user } = useAuth();
// // //   const [loading, setLoading] = useState(true);
// // //   const [err, setErr] = useState("");
// // //   const [videos, setVideos] = useState([]);
// // //   const [history, setHistory] = useState([]);

// // //   useEffect(() => {
// // //     let alive = true;
// // //     (async () => {
// // //       try {
// // //         setLoading(true);
// // //         setErr("");

// // //         const [vRes, hRes] = await Promise.allSettled([
// // //           api.get("/videos"),
// // //           api.get("/feature-history"),
// // //         ]);

// // //         if (!alive) return;

// // //         if (vRes.status === "fulfilled") {
// // //           const v = unwrap(vRes.value) || [];
// // //           setVideos(v.items || v);
// // //         }
// // //         if (hRes.status === "fulfilled") {
// // //           const h = unwrap(hRes.value) || [];
// // //           setHistory(h.items || h);
// // //         }
// // //       } catch (e) {
// // //         if (alive) setErr(e?.response?.data?.message || "Failed to load dashboard");
// // //       } finally {
// // //         if (alive) setLoading(false);
// // //       }
// // //     })();

// // //     return () => { alive = false; };
// // //   }, []);

// // //   const recentVideos = videos.slice(0, 6);
// // //   const recentHistory = history.slice(0, 6);

// // //   return (
// // //     <div className="mx-auto max-w-7xl px-4 py-6">
// // //       {/* Hero */}
// // //       <header className="rounded-2xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-zinc-800 p-6 md:p-8 mb-8">
// // //         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
// // //           <div>
// // //             <h1 className="text-3xl md:text-4xl font-bold">Visionary Count</h1>
// // //             <p className="text-zinc-400 mt-2 max-w-2xl">
// // //               Upload videos, detect objects, draw bounding boxes, and explore insights
// // //               frame-by-frame — all in one place.
// // //             </p>
// // //             {user && (
// // //               <p className="text-zinc-300 mt-3">
// // //                 Welcome back, <span className="font-semibold">{user.fullName || user.username}</span> 👋
// // //               </p>
// // //             )}
// // //           </div>

// // //           <div className="flex flex-wrap gap-2">
// // //             <CTA to="/upload" label="Upload Video" />
// // //             <CTA to="/graph" label="Graph Analysis" />
// // //             <CTA to="/unique" label="Unique Counts" />
// // //             <CTA to="/bbox" label="BBox Video" />
// // //           </div>
// // //         </div>
// // //       </header>

// // //       {/* Error */}
// // //       {!!err && (
// // //         <div className="mb-6 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-red-300">
// // //           {err}
// // //         </div>
// // //       )}

// // //       {/* Content */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //         {/* Recent Videos */}
// // //         <section className="lg:col-span-2">
// // //           <SectionHeader
// // //             title="Recent videos"
// // //             action={<Link className="text-sm text-blue-400 hover:text-blue-300" to="/upload">Upload another →</Link>}
// // //           />

// // //           {loading ? (
// // //             <VideoSkeletonGrid />
// // //           ) : recentVideos.length === 0 ? (
// // //             <EmptyCard
// // //               title="No videos yet"
// // //               desc="Upload your first video to start analyzing objects."
// // //               cta={{ to: "/upload", text: "Go to Upload" }}
// // //             />
// // //           ) : (
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
// // //               {recentVideos.map((v) => (
// // //                 <VideoCard key={v._id} v={v} />
// // //               ))}
// // //             </div>
// // //           )}
// // //         </section>

// // //         {/* Recent Analyses */}
// // //         <section className="lg:col-span-1">
// // //           <SectionHeader
// // //             title="Recent analyses"
// // //             action={<Link className="text-sm text-blue-400 hover:text-blue-300" to="/history">View all →</Link>}
// // //           />

// // //           {loading ? (
// // //             <HistorySkeletonList />
// // //           ) : recentHistory.length === 0 ? (
// // //             <EmptyCard
// // //               title="No analyses yet"
// // //               desc="Run Graph, Unique, or BBox on one of your videos."
// // //               cta={{ to: "/graph", text: "Try Graph Analysis" }}
// // //             />
// // //           ) : (
// // //             <div className="space-y-3">
// // //               {recentHistory.map((h) => <HistoryRow key={h._id} h={h} />)}
// // //             </div>
// // //           )}
// // //         </section>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ---------------- Reusable Bits ---------------- */

// // // function CTA({ to, label }) {
// // //   return (
// // //     <Link
// // //       to={to}
// // //       className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm hover:bg-zinc-800 transition"
// // //     >
// // //       {label}
// // //     </Link>
// // //   );
// // // }

// // // function SectionHeader({ title, action }) {
// // //   return (
// // //     <div className="mb-3 flex items-center justify-between">
// // //       <h2 className="text-lg font-semibold">{title}</h2>
// // //       {action}
// // //     </div>
// // //   );
// // // }

// // // function EmptyCard({ title, desc, cta }) {
// // //   return (
// // //     <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-zinc-400">
// // //       <div className="text-zinc-200 font-medium">{title}</div>
// // //       <p className="mt-1">{desc}</p>
// // //       {cta && (
// // //         <Link
// // //           to={cta.to}
// // //           className="mt-3 inline-block rounded border border-zinc-700 px-3 py-1 hover:bg-zinc-800"
// // //         >
// // //           {cta.text}
// // //         </Link>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // /* ---------------- Videos ---------------- */

// // // function VideoCard({ v }) {
// // //   const title = v.original_filename || v.filename || `Video ${v._id.slice(-6)}`;
// // //   const date = v.createdAt ? new Date(v.createdAt).toLocaleString() : "";

// // //   return (
// // //     <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
// // //       <div className="aspect-video bg-black/50">
// // //         {/* Swap to thumbnail if your backend provides one */}
// // //         {v.url ? (
// // //           <video className="h-full w-full object-cover" muted>
// // //             <source src={v.url} type="video/mp4" />
// // //           </video>
// // //         ) : (
// // //           <div className="h-full w-full grid place-items-center text-zinc-600 text-sm">
// // //             No preview
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="p-3">
// // //         <div className="truncate text-sm text-zinc-200">{title}</div>
// // //         <div className="text-xs text-zinc-500">{date}</div>

// // //         <div className="mt-3 flex flex-wrap gap-2">
// // //           <TinyLink to={`/graph?video=${v._id}`}>Graph</TinyLink>
// // //           <TinyLink to={`/unique?video=${v._id}`}>Unique</TinyLink>
// // //           <TinyLink to={`/bbox?video=${v._id}`}>BBox</TinyLink>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function TinyLink({ to, children }) {
// // //   return (
// // //     <Link
// // //       to={to}
// // //       className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
// // //     >
// // //       {children}
// // //     </Link>
// // //   );
// // // }

// // // /* ---------------- History ---------------- */

// // // function HistoryRow({ h }) {
// // //   const type = h.featureType || h.type;
// // //   const to =
// // //     type === "graph" ? `/graph?video=${h.video}` :
// // //     type === "unique" ? `/unique?video=${h.video}` :
// // //     type === "bbox" ? `/bbox?video=${h.video}` : "/history";
// // //   const when = h.createdAt ? new Date(h.createdAt).toLocaleString() : "";

// // //   // small preview line (first 2 classes for unique, resolution for bbox)
// // //   let hint = "";
// // //   if ((type === "unique" && h.output?.uniqueCounts) || (type === "unique" && h.uniqueCounts)) {
// // //     const obj = h.output?.uniqueCounts || h.uniqueCounts;
// // //     const keys = Object.keys(obj || {});
// // //     hint = keys.slice(0, 3).join(", ") + (keys.length > 3 ? "…" : "");
// // //   }
// // //   if (type === "bbox" && (h.overlayVideo?.width || h.overlayVideo?.height)) {
// // //     hint = `${h.overlayVideo.width}×${h.overlayVideo.height}`;
// // //   }

// // //   return (
// // //     <Link
// // //       to={to}
// // //       className="block rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 hover:bg-zinc-900"
// // //     >
// // //       <div className="flex items-center justify-between">
// // //         <div className="capitalize">{type} analysis</div>
// // //         <div className="text-xs text-zinc-500">{when}</div>
// // //       </div>
// // //       {hint && <div className="text-xs text-zinc-400 mt-0.5">{hint}</div>}
// // //     </Link>
// // //   );
// // // }

// // // /* ---------------- Skeletons ---------------- */

// // // function VideoSkeletonGrid() {
// // //   return (
// // //     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
// // //       {Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)}
// // //     </div>
// // //   );
// // // }
// // // function VideoSkeleton() {
// // //   return (
// // //     <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse">
// // //       <div className="aspect-video bg-zinc-800/60" />
// // //       <div className="p-3 space-y-2">
// // //         <div className="h-3 w-2/3 bg-zinc-800 rounded" />
// // //         <div className="h-3 w-1/3 bg-zinc-800 rounded" />
// // //         <div className="flex gap-2">
// // //           <div className="h-6 w-14 bg-zinc-800 rounded" />
// // //           <div className="h-6 w-14 bg-zinc-800 rounded" />
// // //           <div className="h-6 w-14 bg-zinc-800 rounded" />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function HistorySkeletonList() {
// // //   return (
// // //     <div className="space-y-3 animate-pulse">
// // //       {Array.from({ length: 6 }).map((_, i) => (
// // //         <div key={i} className="h-[60px] rounded-lg border border-zinc-800 bg-zinc-900/40" />
// // //       ))}
// // //     </div>
// // //   );
// // // }
// // // client/src/pages/Dashboard.jsx
// // import { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext.jsx';
// // import api from '../api/axios.js';
// // import NavBar from "../components/NavBar.jsx";

// // const Dashboard = () => {
// //   const { user } = useAuth();
// //   const [videos, setVideos] = useState([]);
// //   const [recentHistory, setRecentHistory] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [stats, setStats] = useState({
// //     totalVideos: 0,
// //     totalAnalyses: 0,
// //   });

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         setLoading(true);
        
// //         // Fetch recent videos
// //         const videosResponse = await api.get('/videos?limit=5');
// //         setVideos(videosResponse.data.items || []);
        
// //         // Fetch recent feature history
// //         const historyResponse = await api.get('/features/history?limit=5');
// //         setRecentHistory(historyResponse.data.items || []);

// //         // Calculate stats
// //         const allVideosResponse = await api.get('/videos?limit=1000'); // Get count
// //         const allHistoryResponse = await api.get('/features/history?limit=1000');
        
// //         setStats({
// //           totalVideos: allVideosResponse.data.items?.length || 0,
// //           totalAnalyses: allHistoryResponse.data.items?.length || 0,
// //         });

// //       } catch (error) {
// //         console.error('Dashboard data fetch error:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       month: 'short',
// //       day: 'numeric',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   const formatFileSize = (bytes) => {
// //     if (bytes === 0) return '0 Bytes';
// //     const k = 1024;
// //     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// //   };

// //   if (loading) {
// //     return (
// //       <div className="loading-container">
// //         <div className="spinner"></div>
// //         <p>Loading dashboard...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //    <>

// //     <div className="dashboard">
// //            <NavBar/>
// //       <div className="dashboard-header">
          
// //         <h1>Welcome back, {user?.fullName || user?.username}!</h1>
// //         <p>Analyze your videos with AI-powered object detection</p>
// //       </div>

// //       <div className="dashboard-stats">
// //         <div className="stat-card">
// //           <h3>{stats.totalVideos}</h3>
// //           <p>Videos Uploaded</p>
// //         </div>
// //         <div className="stat-card">
// //           <h3>{stats.totalAnalyses}</h3>
// //           <p>Analyses Completed</p>
// //         </div>
// //       </div>

// //       <div className="dashboard-actions">
// //         <h2>Quick Actions</h2>
// //         <div className="action-cards">
// //           <Link to="/upload" className="action-card">
// //             <div className="action-icon">📹</div>
// //             <h3>Upload Video</h3>
// //             <p>Upload a new video for analysis</p>
// //           </Link>
          
// //           <Link to="/graph" className="action-card">
// //             <div className="action-icon">📊</div>
// //             <h3>Graph Analysis</h3>
// //             <p>Analyze object counts per frame</p>
// //           </Link>
          
// //           <Link to="/unique" className="action-card">
// //             <div className="action-icon">🔢</div>
// //             <h3>Unique Counts</h3>
// //             <p>Count unique objects in videos</p>
// //           </Link>
          
// //           <Link to="/bbox" className="action-card">
// //             <div className="action-icon">⬜</div>
// //             <h3>BBox Video</h3>
// //             <p>Generate bounding box overlays</p>
// //           </Link>
// //         </div>
// //       </div>

// //       <div className="dashboard-content">
// //         <div className="dashboard-section">
// //           <div className="section-header">
// //             <h2>Recent Videos</h2>
// //             <Link to="/videos" className="view-all-link">View All</Link>
// //           </div>
          
// //           {videos.length > 0 ? (
// //             <div className="video-grid">
// //               {videos.map((video) => (
// //                 <div key={video._id} className="video-card">
// //                   <div className="video-info">
// //                     <h4>Video {video._id.slice(-6)}</h4>
// //                     <p className="video-meta">
// //                       {formatFileSize(video.bytes)} • {video.format?.toUpperCase()}
// //                     </p>
// //                     <p className="video-meta">
// //                       {video.width}x{video.height}
// //                     </p>
// //                     <p className="video-date">{formatDate(video.createdAt)}</p>
// //                   </div>
// //                   <div className="video-actions">
// //                     <a 
// //                       href={video.url} 
// //                       target="_blank" 
// //                       rel="noopener noreferrer"
// //                       className="btn btn-sm btn-outline"
// //                     >
// //                       View
// //                     </a>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="empty-state">
// //               <p>No videos uploaded yet.</p>
// //               <Link to="/upload" className="btn btn-primary">Upload Your First Video</Link>
// //             </div>
// //           )}
// //         </div>

// //         <div className="dashboard-section">
// //           <div className="section-header">
// //             <h2>Recent Analyses</h2>
// //             <Link to="/history" className="view-all-link">View All</Link>
// //           </div>
          
// //           {recentHistory.length > 0 ? (
// //             <div className="history-list">
// //               {recentHistory.map((item) => (
// //                 <div key={item._id} className="history-item">
// //                   <div className="history-info">
// //                     <h4>{item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Analysis'}</h4>
// //                     <p>Video: {item.video?.slice(-6) || 'N/A'}</p>
// //                     <p className="history-date">{formatDate(item.createdAt)}</p>
// //                   </div>
// //                   <div className="history-status">
// //                     <span className="status-badge success">Completed</span>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="empty-state">
// //               <p>No analyses run yet.</p>
// //               <p>Upload a video and try one of the analysis features!</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //     </>
// //   );
// // };

// // export default Dashboard;
// import { Link } from "react-router-dom";

// function FeatureCard({ title, desc, to, tag }) {
//   return (
//     <Link
//       to={to}
//       className="group rounded-2xl border p-5 hover:shadow-sm transition bg-white"
//     >
//       <div className="flex items-start justify-between">
//         <h3 className="text-base font-semibold">{title}</h3>
//         {tag ? (
//           <span className="text-[10px] px-2 py-0.5 rounded-full border ml-2">
//             {tag}
//           </span>
//         ) : null}
//       </div>
//       <p className="mt-2 text-sm text-gray-600">{desc}</p>
//       <div className="mt-3 text-sm text-gray-500 group-hover:text-gray-800">
//         Explore →
//       </div>
//     </Link>
//   );
// }

// function Step({ n, title, desc }) {
//   return (
//     <div className="rounded-2xl border p-5 bg-white">
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
//           {n}
//         </div>
//         <h4 className="font-medium">{title}</h4>
//       </div>
//       <p className="text-sm text-gray-600 mt-2">{desc}</p>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-[rgb(250,250,250)]">
//       {/* HERO */}
//       <header className="px-4 lg:px-8 pt-10 pb-8 border-b bg-white">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//           <div>
//             <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
//               Visionary Count
//             </h1>
//             <p className="mt-3 text-gray-600">
//               Upload a video and get computer-vision insights: unique object
//               counts, bounding-box overlays, and per-frame graphs — all in one
//               place.
//             </p>
//             <div className="mt-5 flex items-center gap-3">
//               <Link
//                 to="/upload"
//                 className="px-4 py-2 rounded-xl bg-black text-white text-sm"
//               >
//                 Upload Video
//               </Link>
//               <Link
//                 to="/about"
//                 className="px-4 py-2 rounded-xl border text-sm"
//               >
//                 Learn More
//               </Link>
//             </div>
//             <div className="mt-3 text-xs text-gray-500">
//               Uses YOLOv4 under the hood. Your videos stay in your account.
//             </div>
//           </div>

//           <div className="rounded-2xl border p-4 bg-white">
//             {/* Placeholder hero visual — replace with your app preview or thumbnail */}
//             <div className="aspect-video rounded-xl bg-gray-100 border flex items-center justify-center">
//               <span className="text-xs text-gray-500">Preview</span>
//             </div>
//             <div className="grid grid-cols-3 gap-3 mt-3">
//               <div className="h-16 rounded-xl bg-gray-100 border" />
//               <div className="h-16 rounded-xl bg-gray-100 border" />
//               <div className="h-16 rounded-xl bg-gray-100 border" />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 px-4 lg:px-8 py-8">
//         <div className="max-w-6xl mx-auto space-y-10">
//           {/* FEATURES */}
//           <section>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold">Features</h2>
//               <Link to="/upload" className="text-sm underline">
//                 Start with an upload
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <FeatureCard
//                 title="Unique Count"
//                 desc="Track how many unique objects appear across the video (class-wise)."
//                 to="/unique"
//               />
//               <FeatureCard
//                 title="BBox Overlay"
//                 desc="Generate a processed video with detection boxes drawn on each frame."
//                 to="/bbox"
//               />
//               <FeatureCard
//                 title="Graph (All Frames)"
//                 desc="Build per-frame time-series counts for chosen classes and visualize trends."
//                 to="/graph"
//                 tag="New"
//               />
//             </div>
//           </section>

//           {/* HOW IT WORKS */}
//           <section>
//             <h2 className="text-xl font-bold mb-4">How it works</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Step
//                 n={1}
//                 title="Upload"
//                 desc="Add a video to your library. We store it on Cloudinary and index it under your account."
//               />
//               <Step
//                 n={2}
//                 title="Run"
//                 desc="Pick a feature (Unique Count, BBox, Graph), choose parameters, and run the pipeline."
//               />
//               <Step
//                 n={3}
//                 title="Review"
//                 desc="Open your history cards to review outputs, charts, and artifacts — and export if needed."
//               />
//             </div>
//           </section>

//           {/* QUICK LINKS */}
//           <section>
//             <h2 className="text-xl font-bold mb-4">Quick Links</h2>
//             <div className="flex flex-wrap gap-3">
//               <Link to="/upload" className="px-3 py-2 rounded-xl border text-sm">
//                 Upload Video
//               </Link>
//               <Link to="/unique" className="px-3 py-2 rounded-xl border text-sm">
//                 Unique Count
//               </Link>
//               <Link to="/bbox" className="px-3 py-2 rounded-xl border text-sm">
//                 BBox Overlay
//               </Link>
//               <Link to="/graph" className="px-3 py-2 rounded-xl border text-sm">
//                 Graph
//               </Link>
//               <Link to="/profile" className="px-3 py-2 rounded-xl border text-sm">
//                 Profile
//               </Link>
//               <Link to="/about" className="px-3 py-2 rounded-xl border text-sm">
//                 About
//               </Link>
//               <Link to="/login" className="px-3 py-2 rounded-xl border text-sm">
//                 Login
//               </Link>
//             </div>
//           </section>

//           {/* CONTACT US (bottom of Home page) */}
//           <section id="contact" className="rounded-2xl border p-5 bg-white">
//             <h2 className="text-xl font-bold">Contact Us</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Questions or feedback? We’d love to hear from you.
//             </p>
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <a
//                 href="mailto:support@visionarycount.app"
//                 className="rounded-xl border p-4 hover:shadow-sm transition"
//               >
//                 <div className="text-sm text-gray-500">Email</div>
//                 <div className="font-medium">support@visionarycount.app</div>
//               </a>
//               <div className="rounded-xl border p-4">
//                 <div className="text-sm text-gray-500">Response time</div>
//                 <div className="font-medium">Typically within 24 hours</div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* FOOTER NAV */}
//       <footer className="mt-10 border-t bg-white">
//         <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
//           <nav className="flex flex-wrap gap-4 text-sm">
//             <Link to="/" className="hover:underline">Home</Link>
//             <a href="#features" className="hover:underline">Features</a>
//             <Link to="/upload" className="hover:underline">Upload Video</Link>
//             <Link to="/about" className="hover:underline">About</Link>
//             <Link to="/profile" className="hover:underline">Profile/Login</Link>
//             <a href="#contact" className="hover:underline ml-auto">Contact Us</a>
//           </nav>
//           <div className="text-xs text-gray-500 mt-3">
//             © {new Date().getFullYear()} Visionary Count. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import React from 'react';

import { useState, useEffect } from "react";

// Mock Link component for demonstration - replace with your actual react-router-dom Link
const Link = ({ to, className, children, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

function FeatureCard({ title, desc, to, tag, icon }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className="group relative rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-md">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {tag && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium mt-1">
                  {tag}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
        <div className={`flex items-center text-sm font-medium transition-colors ${
          isHovered ? 'text-blue-600' : 'text-gray-500'
        }`}>
          Explore
          <svg className={`ml-2 w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function Step({ n, title, desc, delay }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`rounded-2xl border p-6 bg-white shadow-sm hover:shadow-md transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-800 to-gray-600 text-white flex items-center justify-center font-semibold shadow-md">
          {n}
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function AnimatedCounter({ end, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev < end) {
          return Math.min(prev + Math.ceil(end / 50), end);
        }
        clearInterval(timer);
        return end;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">{count}+</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

export default function Home() {
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVideoLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* HERO */}
      <header className="px-4 lg:px-8 pt-12 pb-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              Powered by YOLOv4 AI
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
              Visionary Count
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Upload a video and get computer-vision insights: unique object counts, 
              bounding-box overlays, and per-frame graphs — all powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Video
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              🔒 Your videos stay secure in your account. Processing happens on our servers.
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="rounded-2xl border bg-white shadow-xl overflow-hidden">
              {/* Main preview */}
              <div className={`aspect-video rounded-t-xl bg-gradient-to-br from-blue-100 to-purple-100 border-b flex items-center justify-center transition-all duration-700 ${
                heroVideoLoaded ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">AI Video Analysis</span>
                </div>
              </div>
              
              {/* Stats grid */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <AnimatedCounter end={47} label="Objects" />
                  </div>
                  <div className="h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <AnimatedCounter end={12} label="Classes" />
                  </div>
                  <div className="h-16 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <AnimatedCounter end={1024} label="Frames" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* FEATURES */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful AI Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from three advanced computer vision features to analyze your videos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon="🎯"
                title="Unique Count"
                desc="Track how many unique objects appear across the video with class-wise breakdown and detailed analytics."
                to="/unique"
              />
              <FeatureCard
                icon="📊"
                title="BBox Overlay"
                desc="Generate a processed video with detection boxes drawn on each frame for visual object tracking."
                to="/bbox"
              />
              <FeatureCard
                icon="📈"
                title="Graph Analyzer"
                desc="Build per-frame time-series counts for chosen classes and visualize trends over time."
                to="/graph"
                tag="Popular"
              />
            </div>
            
            <div className="text-center mt-8">
              <Link to="/upload" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Get started with your first upload
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple three-step process to get insights from your videos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Step
                n={1}
                title="Upload Your Video"
                desc="Securely upload your video file. We store it on Cloudinary with advanced deduplication to save space."
                delay={100}
              />
              <Step
                n={2}
                title="Choose & Configure"
                desc="Select from Unique Count, BBox Overlay, or Graph Analysis. Set your parameters and start processing."
                delay={200}
              />
              <Step
                n={3}
                title="Analyze Results"
                desc="Review detailed outputs, interactive charts, and downloadable artifacts. Export data as needed."
                delay={300}
              />
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <p className="text-gray-600">
                Jump directly to the tools you need
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/upload", label: "Upload Video", primary: true },
                { to: "/unique", label: "Unique Count" },
                { to: "/bbox", label: "BBox Overlay" },
                { to: "/graph", label: "Graph Analysis" },
                { to: "/profile", label: "My Profile" },
                { to: "/about", label: "About Us" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    link.primary
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 mt-2">
                Questions or feedback? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <a
                href="mailto:support@visionarycount.app"
                className="group bg-white rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email Support</div>
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      support@visionarycount.app
                    </div>
                  </div>
                </div>
              </a>
              
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Response Time</div>
                    <div className="font-semibold text-gray-900">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Visionary Count</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced computer vision analysis for your videos. 
                Upload, analyze, and get insights with AI-powered object detection.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
              <nav className="space-y-2">
                <Link to="/unique" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Unique Count</Link>
                <Link to="/bbox" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">BBox Overlay</Link>
                <Link to="/graph" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Graph Analysis</Link>
              </nav>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Account</h4>
              <nav className="space-y-2">
                <Link to="/upload" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Upload Video</Link>
                <Link to="/profile" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">Profile</Link>
                <Link to="/about" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              </nav>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Visionary Count. All rights reserved.
            </div>
            <div className="text-xs text-gray-500">
              Powered by YOLOv4 • Secure Cloud Processing
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}