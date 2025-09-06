// // // // // import { useState } from "react";
// // // // // import api, { unwrap } from "../api/axios";

// // // // // export default function UploadVideo() {
// // // // //   const [video, setVideo] = useState(null);
// // // // //   const [result, setResult] = useState(null);
// // // // //   const [msg, setMsg] = useState("");

// // // // //   const submit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!video) return;
// // // // //     const fd = new FormData();
// // // // //     fd.append("video", video);
// // // // //     try {
// // // // //       const res = await api.post("/videos/upload", fd, {
// // // // //         headers: { "Content-Type": "multipart/form-data" },
// // // // //       });
// // // // //       setResult(unwrap(res));
// // // // //       setMsg("Uploaded!");
// // // // //     } catch (e) {
// // // // //       setMsg(e?.response?.data?.message || "Upload error");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <form onSubmit={submit} className="p-4">
// // // // //       <h2 className="text-xl font-semibold mb-3">Upload Video</h2>
// // // // //       <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files?.[0]||null)} />
// // // // //       <button className="ml-2 border px-3 py-1 rounded">Upload</button>
// // // // //       <div className="mt-2">{msg}</div>
// // // // //       {result && (
// // // // //         <pre className="bg-zinc-900 p-3 mt-3 rounded text-xs overflow-auto">
// // // // // {JSON.stringify(result, null, 2)}
// // // // //         </pre>
// // // // //       )}
// // // // //     </form>
// // // // //   );
// // // // // }
// // // // // client/src/pages/UploadVideo.jsx
// // // // import { useState } from 'react';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import { apiMultipart } from '../api/axios';

// // // // const UploadVideo = () => {
// // // //   const [selectedFile, setSelectedFile] = useState(null);
// // // //   const [dragActive, setDragActive] = useState(false);
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [uploadProgress, setUploadProgress] = useState(0);
// // // //   const [error, setError] = useState('');
// // // //   const [success, setSuccess] = useState('');

// // // //   const navigate = useNavigate();

// // // //   const handleFileSelect = (file) => {
// // // //     setError('');
// // // //     setSuccess('');
    
// // // //     if (!file) return;
    
// // // //     // Validate file type
// // // //     if (!file.type.startsWith('video/')) {
// // // //       setError('Please select a valid video file');
// // // //       return;
// // // //     }
    
// // // //     // Validate file size (100MB limit)
// // // //     const maxSize = 100 * 1024 * 1024; // 100MB
// // // //     if (file.size > maxSize) {
// // // //       setError('File size must be less than 100MB');
// // // //       return;
// // // //     }
    
// // // //     setSelectedFile(file);
// // // //   };

// // // //   const handleFileInput = (e) => {
// // // //     const file = e.target.files[0];
// // // //     handleFileSelect(file);
// // // //   };

// // // //   const handleDrag = (e) =>
// // // // client/src/pages/UploadVideo.jsx
// // // import { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { apiMultipart } from '../api/axios';

// // // const UploadVideo = () => {
// // //   const [selectedFile, setSelectedFile] = useState(null);
// // //   const [dragActive, setDragActive] = useState(false);
// // //   const [uploading, setUploading] = useState(false);
// // //   const [uploadProgress, setUploadProgress] = useState(0);
// // //   const [error, setError] = useState('');
// // //   const [success, setSuccess] = useState('');

// // //   const navigate = useNavigate();

// // //   const handleFileSelect = (file) => {
// // //     setError('');
// // //     setSuccess('');
    
// // //     if (!file) return;
    
// // //     // Validate file type
// // //     if (!file.type.startsWith('video/')) {
// // //       setError('Please select a valid video file');
// // //       return;
// // //     }
    
// // //     // Validate file size (100MB limit)
// // //     const maxSize = 100 * 1024 * 1024; // 100MB
// // //     if (file.size > maxSize) {
// // //       setError('File size must be less than 100MB');
// // //       return;
// // //     }
    
// // //     setSelectedFile(file);
// // //   };

// // //   const handleFileInput = (e) => {
// // //     const file = e.target.files[0];
// // //     handleFileSelect(file);
// // //   };

// // //   const handleDrag = (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     if (e.type === 'dragenter' || e.type === 'dragover') {
// // //       setDragActive(true);
// // //     } else if (e.type === 'dragleave') {
// // //       setDragActive(false);
// // //     }
// // //   };

// // //   const handleDrop = (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     setDragActive(false);

// // //     const files = e.dataTransfer.files;
// // //     if (files && files[0]) {
// // //       handleFileSelect(files[0]);
// // //     }
// // //   };

// // //   const handleUpload = async () => {
// // //     if (!selectedFile) {
// // //       setError('Please select a video file');
// // //       return;
// // //     }

// // //     setUploading(true);
// // //     setUploadProgress(0);
// // //     setError('');

// // //     const formData = new FormData();
// // //     formData.append('video', selectedFile);

// // //     try {
// // //       const response = await apiMultipart.post('/videos', formData, {
// // //         onUploadProgress: (progressEvent) => {
// // //           const progress = Math.round(
// // //             (progressEvent.loaded * 100) / progressEvent.total
// // //           );
// // //           setUploadProgress(progress);
// // //         },
// // //       });

// // //       setSuccess('Video uploaded successfully!');
      
// // //       // Show success for 2 seconds then redirect
// // //       setTimeout(() => {
// // //         navigate('/dashboard');
// // //       }, 2000);

// // //     } catch (error) {
// // //       setError(error.message || 'Upload failed. Please try again.');
// // //       setUploadProgress(0);
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   const resetUpload = () => {
// // //     setSelectedFile(null);
// // //     setError('');
// // //     setSuccess('');
// // //     setUploadProgress(0);
// // //     document.getElementById('video-input').value = '';
// // //   };

// // //   const formatFileSize = (bytes) => {
// // //     if (bytes === 0) return '0 Bytes';
// // //     const k = 1024;
// // //     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// // //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// // //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // //   };

// // //   return (
// // //     <div className="upload-container">
// // //       <div className="upload-header">
// // //         <h1>Upload Video</h1>
// // //         <p>Upload your video for AI-powered object detection analysis</p>
// // //       </div>

// // //       {error && <div className="error-message">{error}</div>}
// // //       {success && <div className="success-message">{success}</div>}

// // //       <div className="upload-content">
// // //         {!selectedFile ? (
// // //           <div
// // //             className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
// // //             onDragEnter={handleDrag}
// // //             onDragLeave={handleDrag}
// // //             onDragOver={handleDrag}
// // //             onDrop={handleDrop}
// // //             onClick={() => document.getElementById('video-input').click()}
// // //           >
// // //             <div className="drop-zone-content">
// // //               <div className="upload-icon">📹</div>
// // //               <h3>Drag & drop your video here</h3>
// // //               <p>or click to browse files</p>
// // //               <div className="upload-requirements">
// // //                 <p>• Supported formats: MP4, AVI, MOV, MKV</p>
// // //                 <p>• Maximum file size: 100MB</p>
// // //                 <p>• Recommended resolution: 720p or higher</p>
// // //               </div>
// // //             </div>
// // //             <input
// // //               id="video-input"
// // //               type="file"
// // //               accept="video/*"
// // //               onChange={handleFileInput}
// // //               style={{ display: 'none' }}
// // //             />
// // //           </div>
// // //         ) : (
// // //           <div className="file-selected">
// // //             <div className="file-info">
// // //               <div className="file-icon">🎬</div>
// // //               <div className="file-details">
// // //                 <h3>{selectedFile.name}</h3>
// // //                 <p>Size: {formatFileSize(selectedFile.size)}</p>
// // //                 <p>Type: {selectedFile.type}</p>
// // //               </div>
// // //             </div>

// // //             {uploading && (
// // //               <div className="upload-progress">
// // //                 <div className="progress-bar">
// // //                   <div 
// // //                     className="progress-fill" 
// // //                     style={{ width: `${uploadProgress}%` }}
// // //                   ></div>
// // //                 </div>
// // //                 <p>{uploadProgress}% uploaded</p>
// // //               </div>
// // //             )}

// // //             <div className="upload-actions">
// // //               <button 
// // //                 onClick={resetUpload} 
// // //                 disabled={uploading}
// // //                 className="btn btn-outline"
// // //               >
// // //                 Choose Different File
// // //               </button>
// // //               <button 
// // //                 onClick={handleUpload} 
// // //                 disabled={uploading}
// // //                 className="btn btn-primary"
// // //               >
// // //                 {uploading ? 'Uploading...' : 'Upload Video'}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="upload-tips">
// // //         <h3>Tips for Best Results:</h3>
// // //         <ul>
// // //           <li>Use clear, well-lit videos for better object detection</li>
// // //           <li>Avoid excessive camera movement or blur</li>
// // //           <li>Higher resolution videos provide more accurate results</li>
// // //           <li>Shorter videos (under 2 minutes) process faster</li>
// // //         </ul>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default UploadVideo;
// // // src/controllers/video.controller.js
// // import fs from "fs";
// // import path from "path";
// // import mongoose from "mongoose";
// // import { ApiError } from "../utils/ApiError.js";
// // import { ApiResponse } from "../utils/ApiResponse.js";
// // import { asyncHandler } from "../utils/asyncHandler.js";
// // import { uploadOnCloudinary, destroyOnCloudinary } from "../utils/cloudinary.js";
// // import { fileChecksum } from "../utils/checksum.js";
// // // import your Video model:
// // import { Video } from "../models/video.model.js"; // <-- ensure this exists

// // /* 
// // Video model assumed shape (adjust as needed):
// // {
// //   owner: ObjectId,
// //   title: String,
// //   description: String,
// //   checksum: String, // sha256
// //   asset: {
// //     url: String,
// //     public_id: String,
// //     resource_type: String,
// //     bytes: Number,
// //     width: Number,
// //     height: Number,
// //     format: String,
// //     original_filename: String,
// //   },
// //   duration: Number,        // optional if you parse it
// //   sizeMB: Number,          // derived from bytes
// //   thumbnail: { url: String }, // optional, if you generate one
// //   deleted: { type: Boolean, default: false }
// // }, { timestamps: true }
// // */

// // export const checkChecksumCtrl = asyncHandler(async (req, res) => {
// //   const owner = req.user._id;
// //   const checksum = String(req.query.checksum || "").trim().toLowerCase();
// //   if (!checksum) throw new ApiError(400, "checksum is required");

// //   const exists = await Video.findOne({ owner, checksum, deleted: false })
// //     .select("_id")
// //     .lean();

// //   return res
// //     .status(200)
// //     .json(new ApiResponse(200, { exists: !!exists, videoId: exists?._id || null }));
// // });

// // export const listMyVideosCtrl = asyncHandler(async (req, res) => {
// //   const owner = req.user._id;
// //   const page = Math.max(1, parseInt(req.query.page || "1", 10));
// //   const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "12", 10)));
// //   const q = (req.query.q || "").trim();

// //   const filter = { owner, deleted: false };
// //   if (q) filter.title = { $regex: q, $options: "i" };

// //   const [items, total] = await Promise.all([
// //     Video.find(filter)
// //       .sort({ createdAt: -1 })
// //       .skip((page - 1) * limit)
// //       .limit(limit)
// //       .lean(),
// //     Video.countDocuments(filter),
// //   ]);

// //   return res.status(200).json(new ApiResponse(200, { items, total }));
// // });

// // export const uploadVideoCtrl = asyncHandler(async (req, res) => {
// //   const owner = req.user._id;

// //   // fields
// //   const title = (req.body.title || "").trim();
// //   const description = (req.body.description || "").trim();
// //   const clientChecksum = (req.body.checksum || "").trim().toLowerCase();

// //   // file from multer
// //   const file = req.file; // { path, originalname, mimetype, size, ... }
// //   if (!file?.path) throw new ApiError(400, "video file is required");

// //   // compute server-side checksum for trust
// //   const serverChecksum = await fileChecksum(file.path);
// //   if (clientChecksum && clientChecksum !== serverChecksum) {
// //     // Not fatal, but useful to detect tampering or drag-drop reorder
// //     // You could choose to hard-fail instead:
// //     // throw new ApiError(400, "checksum mismatch");
// //   }

// //   // de-dup: if checksum already exists for this owner, skip upload & return existing
// //   const dup = await Video.findOne({ owner, checksum: serverChecksum, deleted: false });
// //   if (dup) {
// //     // remove temp file to avoid leaks
// //     try { fs.unlinkSync(file.path); } catch {}
// //     return res
// //       .status(200)
// //       .json(new ApiResponse(200, { duplicate: true, videoId: dup._id }, "Already uploaded"));
// //   }

// //   // upload to Cloudinary
// //   const uploaded = await uploadOnCloudinary(file.path, "video", "visionary-count/videos");
// //   if (!uploaded?.url) {
// //     // remove temp if not already removed by util
// //     try { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); } catch {}
// //     throw new ApiError(500, "cloud upload failed");
// //   }

// //   const doc = await Video.create({
// //     owner,
// //     title: title || file.originalname,
// //     description,
// //     checksum: serverChecksum,
// //     asset: uploaded,
// //     sizeMB: uploaded.bytes ? uploaded.bytes / (1024 * 1024) : undefined,
// //     deleted: false,
// //   });

// //   return res.status(201).json(new ApiResponse(201, doc, "Video uploaded"));
// // });

// // export const deleteVideoCtrl = asyncHandler(async (req, res) => {
// //   const owner = req.user._id;
// //   const id = req.params.id;
// //   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "invalid video id");

// //   const video = await Video.findOne({ _id: id, owner, deleted: false });
// //   if (!video) throw new ApiError(404, "video not found");

// //   // SOFT delete
// //   video.deleted = true;
// //   await video.save();

// //   // (optional) actively delete from Cloudinary to save storage
// //   // await destroyOnCloudinary(video.asset?.public_id, "video");

// //   return res.status(200).json(new ApiResponse(200, { deleted: true }));
// // });



// import { useEffect, useMemo, useRef, useState } from "react";
// import api from "../api/axios";
// import { bytesToHuman, timeAgo } from "../utils/format";
// import VideoCard from "../components/VideoCard";

// export default function UploadPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [dragOver, setDragOver] = useState(false);

//   const [progress, setProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [q, setQ] = useState("");
//   const [sort, setSort] = useState("newest");

//   const inputRef = useRef();

//   // --- fetch my videos ---
//   const fetchVideos = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/videos/list");
//       // expect data = { statusCode, data: [video,...], message }
//       const list = data?.data || [];
//       // keep newest first by default
//       setVideos(
//         list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       );
//     } catch (e) {
//       console.error(e);
//       alert("Failed to load your videos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // --- upload handler ---
//   const handleUpload = async (e) => {
//     e?.preventDefault?.();
//     if (!file) {
//       alert("Please choose a video file.");
//       return;
//     }
//     if (!title.trim()) {
//       alert("Please enter a title.");
//       return;
//     }

//     const form = new FormData();
//     form.append("video", file);         // field name must be "video" (multer.single)
//     form.append("title", title.trim());
//     form.append("description", description.trim());

//     setUploading(true);
//     setProgress(0);

//     try {
//       const { data } = await api.post("/videos/upload", form, {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: (evt) => {
//           if (!evt.total) return;
//           const pct = Math.round((evt.loaded * 100) / evt.total);
//           setProgress(pct);
//         },
//         // In case server streams late — give it time
//         timeout: 0,
//       });

//       // success path
//       const created = data?.data;
//       if (created?._id) {
//         setVideos((curr) => [created, ...curr]);
//         resetForm();
//         alert("Video uploaded successfully!");
//         return;
//       }

//       // if backend uses ApiResponse with message for duplicate, handle it:
//       const msg = (data?.message || "").toLowerCase();
//       if (msg.includes("already") && msg.includes("upload")) {
//         alert("This video is already uploaded. Not adding a duplicate.");
//         return;
//       }

//       // fallback
//       alert(data?.message || "Upload complete.");
//     } catch (err) {
//       // handle duplicate via status or message
//       const status = err?.response?.status;
//       const msg = (err?.response?.data?.message || err?.message || "")
//         .toLowerCase();

//       if (status === 409 || msg.includes("already") || msg.includes("exists")) {
//         alert("This video is already uploaded. Not adding a duplicate.");
//       } else if (status === 413) {
//         alert("File too large. Try a smaller video.");
//       } else if (status === 400) {
//         alert("Bad request. Check your inputs.");
//       } else {
//         alert("Upload failed. Please try again.");
//       }
//     } finally {
//       setUploading(false);
//       setProgress(0);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setFile(null);
//     if (inputRef.current) inputRef.current.value = "";
//   };

//   // --- delete handler ---
//   const deleteVideo = async (id) => {
//     if (!id) return;
//     const confirm = window.confirm("Delete this video? This cannot be undone.");
//     if (!confirm) return;
//     try {
//       await api.delete(`/videos/${id}`);
//       setVideos((curr) => curr.filter((v) => v._id !== id));
//     } catch (e) {
//       console.error(e);
//       alert("Failed to delete the video.");
//     }
//   };

//   // --- open handler (inline player in a dialog) ---
//   const openVideo = (url) => {
//     if (!url) return;
//     // simplest: new tab. (You can replace with a nice modal)
//     window.open(url, "_blank", "noopener,noreferrer");
//   };

//   // --- drag and drop ---
//   const onDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const f = e.dataTransfer.files?.[0];
//     if (f) setFile(f);
//   };

//   const filtered = useMemo(() => {
//     let arr = [...videos];
//     if (q.trim()) {
//       const qq = q.toLowerCase();
//       arr = arr.filter((v) =>
//         [v.title, v.description].some((s) => (s || "").toLowerCase().includes(qq))
//       );
//     }
//     if (sort === "newest") {
//       arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     } else if (sort === "oldest") {
//       arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//     } else if (sort === "title") {
//       arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
//     }
//     return arr;
//   }, [videos, q, sort]);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Upload Video</h1>
//           <p className="text-gray-600">
//             Add a new video (title + description). If it’s a duplicate, we’ll let you know.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search my videos…"
//             className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
//           />
//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="px-3 py-2 rounded-xl border border-gray-300 bg-white"
//           >
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="title">Title A–Z</option>
//           </select>
//         </div>
//       </div>

//       {/* Uploader */}
//       <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-6 mb-10">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Title *</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
//               placeholder="e.g., Street view sample"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
//               placeholder="What is in this video?"
//             />
//           </div>

//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setDragOver(true);
//             }}
//             onDragLeave={() => setDragOver(false)}
//             onDrop={onDrop}
//             className={`rounded-2xl border-2 border-dashed p-5 ${
//               dragOver ? "border-black bg-gray-50" : "border-gray-300"
//             }`}
//           >
//             <p className="text-sm text-gray-600 mb-3">
//               Drag & drop your video here, or choose a file
//             </p>

//             <input
//               ref={inputRef}
//               type="file"
//               accept="video/*"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="block w-full text-sm text-gray-600
//                          file:mr-4 file:py-2 file:px-4
//                          file:rounded-xl file:border-0
//                          file:text-sm file:font-semibold
//                          file:bg-black file:text-white
//                          hover:file:opacity-90"
//             />

//             {file && (
//               <div className="mt-3 text-sm text-gray-700">
//                 Selected: <span className="font-medium">{file.name}</span>{" "}
//                 <span className="text-gray-500">({bytesToHuman(file.size)})</span>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-3 pt-2">
//             <button
//               type="submit"
//               disabled={uploading}
//               className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-60"
//             >
//               {uploading ? "Uploading…" : "Upload"}
//             </button>
//             <button
//               type="button"
//               onClick={resetForm}
//               disabled={uploading}
//               className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60"
//             >
//               Reset
//             </button>
//             {uploading && (
//               <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-black transition-all"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tips / Note */}
//         <div className="rounded-2xl border border-gray-200 p-5 bg-white">
//           <h4 className="font-semibold mb-2">Notes</h4>
//           <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
//             <li>Field name must be <code>video</code> for the file.</li>
//             <li>Duplicates are rejected (server computes checksum).</li>
//             <li>After upload, the video appears in your list below.</li>
//           </ul>

//           <div className="mt-4 text-xs text-gray-500">
//             Last refreshed: {timeAgo(new Date().toISOString())}
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 fetchVideos();
//               }}
//               className="ml-2 underline hover:no-underline"
//             >
//               Refresh list
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Video list */}
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-lg font-semibold">My Videos</h2>
//         {!loading && (
//           <span className="text-sm text-gray-500">
//             {filtered.length} item{filtered.length !== 1 ? "s" : ""}
//           </span>
//         )}
//       </div>

//       {loading ? (
//         <div className="grid place-items-center py-20 text-gray-500">Loading…</div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
//           No videos yet. Upload your first one above!
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {filtered.map((v) => (
//             <VideoCard
//               key={v._id}
//               video={v}
//               onDelete={deleteVideo}
//               onOpen={openVideo}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React from 'react';

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import { bytesToHuman, timeAgo } from "../utils/format";
import VideoCard from "../components/VideoCard";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");

  const inputRef = useRef();

  // --- fetch my videos ---
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/videos/list");
      const list = data?.data || [];
      setVideos(
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to load your videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // --- upload handler ---
  const handleUpload = async (e) => {
    e?.preventDefault?.();
    if (!file) {
      alert("Please choose a video file.");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    const form = new FormData();
    form.append("video", file);
    form.append("title", title.trim());
    form.append("description", description.trim());

    setUploading(true);
    setProgress(0);

    try {
      const { data } = await api.post("/videos/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        },
        timeout: 0,
      });

      const created = data?.data;
      if (created?._id) {
        setVideos((curr) => [created, ...curr]);
        resetForm();
        alert("Video uploaded successfully!");
        return;
      }

      const msg = (data?.message || "").toLowerCase();
      if (msg.includes("already") && msg.includes("upload")) {
        alert("This video is already uploaded. Not adding a duplicate.");
        return;
      }

      alert(data?.message || "Upload complete.");
    } catch (err) {
      const status = err?.response?.status;
      const msg = (err?.response?.data?.message || err?.message || "").toLowerCase();

      if (status === 409 || msg.includes("already") || msg.includes("exists")) {
        alert("This video is already uploaded. Not adding a duplicate.");
      } else if (status === 413) {
        alert("File too large. Try a smaller video.");
      } else if (status === 400) {
        alert("Bad request. Check your inputs.");
      } else {
        alert("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // --- delete handler ---
  const deleteVideo = async (id) => {
    if (!id) return;
    const confirm = window.confirm("Delete this video? This cannot be undone.");
    if (!confirm) return;
    try {
      await api.delete(`/videos/${id}`);
      setVideos((curr) => curr.filter((v) => v._id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete the video.");
    }
  };

  // --- open handler ---
  const openVideo = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // --- drag and drop ---
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const filtered = useMemo(() => {
    let arr = [...videos];
    if (q.trim()) {
      const qq = q.toLowerCase();
      arr = arr.filter((v) =>
        [v.title, v.description].some((s) => (s || "").toLowerCase().includes(qq))
      );
    }
    if (sort === "newest") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "title") {
      arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return arr;
  }, [videos, q, sort]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <span className="text-4xl">📹</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Upload Your Videos
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload videos to analyze with our AI-powered computer vision features. 
              Get insights with object detection, bounding boxes, and detailed analytics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Upload Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 rounded-full p-2">
              <span className="text-blue-400 text-xl">⬆️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upload New Video</h2>
              <p className="text-gray-400">Add title, description, and select your video file</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <span className="text-red-400">*</span>
                  <span>Video Title</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="e.g., Street Traffic Analysis"
                  disabled={uploading}
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <span>📝</span>
                  <span>Description (Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
                  placeholder="Describe what's in this video, where it was recorded, or any other details..."
                  disabled={uploading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={uploading || !file || !title.trim()}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>📤</span>
                      Upload Video
                    </span>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-gray-200 font-semibold hover:bg-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Upload Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - File Upload */}
            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <span className="text-red-400">*</span>
                  <span>Video File</span>
                </label>
                
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
                    dragOver 
                      ? "border-blue-400 bg-blue-500/10 scale-[1.02]" 
                      : "border-gray-600 bg-gray-700/50"
                  } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400 hover:bg-blue-500/10"}`}
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="bg-blue-500/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <span className="text-2xl">🎬</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-200">
                        Drop your video here
                      </p>
                      <p className="text-sm text-gray-400">
                        or click to browse files
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports: MP4, AVI, MOV, WebM
                      </p>
                    </div>

                    <input
                      ref={inputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Selected File Info */}
                {file && (
                  <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500/20 rounded-full p-2">
                        <span className="text-green-400">✅</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-300">File Selected</p>
                        <p className="text-sm text-green-200 font-medium">{file.name}</p>
                        <p className="text-xs text-green-400">Size: {bytesToHuman(file.size)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Tips */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 rounded-full p-2 flex-shrink-0">
                    <span className="text-blue-400">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-200 mb-2">Upload Tips</h4>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>• Duplicate videos are automatically detected</li>
                      <li>• Supported formats: MP4, AVI, MOV, WebM</li>
                      <li>• Higher quality videos give better AI analysis</li>
                      <li>• Files are securely stored in the cloud</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* My Videos Section */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
          {/* Header with Search and Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 rounded-full p-2">
                <span className="text-purple-400 text-xl">🎞️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">My Videos</h2>
                {!loading && (
                  <p className="text-gray-400">
                    {filtered.length} video{filtered.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">🔍</span>
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>
              
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">📅 Newest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="title">🔤 Title A–Z</option>
              </select>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  fetchVideos();
                }}
                className="px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                title="Refresh video list"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="grid place-items-center py-20">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-gray-600 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your videos...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-700 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl text-gray-500">📹</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                {q.trim() ? "No videos found" : "No videos yet"}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {q.trim() 
                  ? "Try adjusting your search terms or filters" 
                  : "Upload your first video to get started with AI-powered analysis!"
                }
              </p>
              {q.trim() && (
                <button
                  onClick={() => setQ("")}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((v) => (
                <VideoCard
                  key={v._id}
                  video={v}
                  onDelete={deleteVideo}
                  onOpen={openVideo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}