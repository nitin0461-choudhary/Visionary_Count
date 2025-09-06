import React from 'react';

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

function Row({ label, children }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="w-32 shrink-0 text-sm text-gray-500">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function BboxHistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const created = useMemo(
    () => (data?.createdAt ? new Date(data.createdAt).toLocaleString() : ""),
    [data?.createdAt]
  );
  const updated = useMemo(
    () => (data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : ""),
    [data?.updatedAt]
  );

  async function fetchDetail() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`historyBbox/${id}`);
      // Expecting { data: { _id, video:{title}, overlayVideo:{url}, artifacts:[{url,name}], inputParams, ... } }
      setData(res?.data?.data || res?.data || null);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load detail");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onDelete() {
    if (!confirm("Delete this history? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await api.delete(`/historyBbox/${id}`);
      // navigate back to main BBox page; it will refresh lists there
      navigate("/bbox");
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">BBox Result</h1>
          <p className="text-sm text-gray-500">
            {data?.video?.title ? `Video: ${data.video.title}` : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/bbox" className="px-3 py-1.5 rounded-xl border text-sm">
            Back to BBox
          </Link>
          <button
            disabled={deleting}
            onClick={onDelete}
            className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
          Loading result…
        </div>
      ) : !data ? (
        <div className="rounded-2xl border p-8 text-sm">No data.</div>
      ) : (
        <>
          {/* Processed video */}
          <div className="rounded-2xl border overflow-hidden">
            {data?.overlayVideo?.url ? (
              <video
                className="w-full h-auto bg-black"
                src={data.overlayVideo.url}
                controls
                controlsList="nodownload"
              />
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No overlay video available.
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="rounded-2xl border p-4">
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <Row label="History ID">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{data?._id}</code>
            </Row>
            <Row label="Created">{created || "-"}</Row>
            <Row label="Updated">{updated || "-"}</Row>
            <Row label="Input Params">
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                {JSON.stringify(data?.inputParams || {}, null, 2)}
              </pre>
            </Row>
          </div>

          {/* Artifacts */}
          <div className="rounded-2xl border p-4">
            <h2 className="text-lg font-semibold mb-3">Artifacts</h2>
            {Array.isArray(data?.artifacts) && data.artifacts.length > 0 ? (
              <ul className="space-y-2">
                {data.artifacts.map((a, idx) => (
                  <li
                    key={a._id || a.url || idx}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {a?.name || a?.public_id || `artifact-${idx + 1}`}
                      </p>
                      {a?.format ? (
                        <p className="text-xs text-gray-500 mt-0.5">.{a.format}</p>
                      ) : null}
                    </div>
                    {a?.url ? (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                      >
                        Open
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No artifacts stored.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
