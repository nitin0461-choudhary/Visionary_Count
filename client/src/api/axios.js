// File: src/api/axios.js
// Axios instance + domain API wrappers (users, videos, unique, bbox, graph)
// Cookie-based auth, automatic refresh/retry, and small helpers.

import axios from "axios";

// ---------------- Base client ----------------
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1",
  withCredentials: true,
  //timeout: 30000,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ---------------- Refresh flow ----------------
let refreshing = null;            // holds the in-flight refresh promise
let queued = [];                  // requests waiting for refresh

function queueUntilRefreshed(cb) {
  return new Promise((resolve, reject) => {
    queued.push({ resolve, reject, cb });
  });
}

function flushQueue(error) {
  const q = queued; queued = [];
  if (error) q.forEach(({ reject }) => reject(error));
  else q.forEach(({ resolve, cb }) => resolve(cb()));
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      try {
        if (!refreshing) {
          refreshing = api.post("/users/refresh-token");
          await refreshing;
          refreshing = null;
          flushQueue(null);
        } else {
          // wait until the first refresh finishes
          return queueUntilRefreshed(() => api(original));
        }
      } catch (e) {
        const err = e || new Error("Refresh failed");
        refreshing = null;
        flushQueue(err);
        return Promise.reject(error);
      }

      // replay original after refresh
      return api(original);
    }

    return Promise.reject(error);
  }
);

// ---------------- Error helper ----------------
export function normalizeError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  return {
    status,
    message: data?.message || data?.error || err?.message || "Request failed",
    data,
  };
}

// ---------------- Domain wrappers ----------------

export const usersApi = {
  async register(payload) { return api.post("/users/register", payload).then(r => r.data); },
  async login(payload) { return api.post("/users/login", payload).then(r => r.data); },
 async logout() { return api.post("/users/logout").then(r => r.data); },
  async me() { return api.get("/users/me").then(r => r.data); },
 async refresh() { return api.post("/users/refresh-token").then(r => r.data); },
  async updateProfile(payload) { return api.patch("/users/profile", payload).then(r => r.data); },
};

export const videosApi = {
 async upload({ file, title, description }) {
    const form = new FormData();
    form.append("video", file);
    if (title) form.append("title", title);
    if (description) form.append("description", description);
    return api.post("/videos/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }).then(r => r.data);
  },
 async listMyVideos(params = {}) { return api.get("videos/list", { params }).then(r => r.data); },
  async get(videoId) { return api.get(`/videos/${videoId}`).then(r => r.data); },
  async delete(videoId) { return api.delete(`/videos/${videoId}`).then(r => r.data); },
 async history(videoId) { return api.get(`/videos/${videoId}/history`).then(r => r.data); },
};

export const uniqueApi = {
 async run(videoId, inputParams = {}) {
    // POST /api/v1/videos/:videoId/unique-counts
    return api.post(`/historyUniqueCount/run/${videoId}`, inputParams).then(r => r.data);
  },
  async listHistory(params = {}) { return api.get("/historyUniqueCount/cards", { params }).then(r => r.data); },
  async getHistory(id) { return api.get(`/historyUniqueCount/${id}`).then(r => r.data); },
};

export const bboxApi = {
  async run(videoId, inputParams = {}) {
    // POST /api/v1/videos/:videoId/bbox
    return api.post(`/historyBbox/run/${videoId}`, inputParams).then(r => r.data);
  },
 async listHistory(params = {}) { return api.get("/historyBbox/cards", { params }).then(r => r.data); },
  async getHistory(id) { return api.get(`/historyBbox/${id}`).then(r => r.data); },
};

export const graphApi = {
  async run(videoId, inputParams = {}) {
    // POST /api/v1/videos/:videoId/graph
    return api.post(`/historyGraph/run/${videoId}`, inputParams).then(r => r.data);
  },
  async listHistory(params = {}) { return api.get("/historyGraph/cards", { params }).then(r => r.data); },
  async getHistory(id) { return api.get(`/historyGraph/${id}`).then(r => r.data); },
};

export default api;
