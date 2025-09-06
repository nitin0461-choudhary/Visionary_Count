import React from 'react';

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/** 33ms per frame => 0.033s */
const FRAME_DT_SEC = 0.033;

/** moving average smoothing */
function smoothSeries(data, keys, windowSize) {
  if (!windowSize || windowSize <= 1) return data;
  const half = Math.floor(windowSize / 2);
  const out = data.map((row, i) => {
    const acc = {};
    keys.forEach((k) => {
      let sum = 0, n = 0;
      for (let j = i - half; j <= i + half; j++) {
        if (j >= 0 && j < data.length && typeof data[j][k] === "number") {
          sum += data[j][k];
          n++;
        }
      }
      acc[k] = n ? sum / n : row[k] ?? 0;
    });
    return { ...row, ...acc };
  });
  return out;
}

function downloadCSV(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify(r[h] ?? "", (_, v) => v).replace(/^"|"$/g, "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ChartSwitcher({ type, setType }) {
  return (
    <div className="flex items-center gap-2">
      {["line", "bar", "area"].map((t) => (
        <button
          key={t}
          onClick={() => setType(t)}
          className={`px-2.5 py-1.5 rounded-lg border text-xs ${type === t ? "bg-black text-white" : ""}`}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ClassPills({ all, selected, setSelected }) {
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((c) => {
        const active = selected.includes(c);
        return (
          <button
            key={c}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
              )
            }
            className={`px-2.5 py-1.5 rounded-full text-xs border ${
              active ? "bg-black text-white" : "bg-white"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

export default function GraphHistoryDetailPage() {
  const { id } = useParams(); // history_id
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  const [chartType, setChartType] = useState("line");
  const [smoothWin, setSmoothWin] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get(`/historyGraph/${id}`);
        const d = res?.data?.data || res?.data;
        setDoc(d);
        // default select classes asked by user (or top few found)
        const inputCls = d?.inputParams?.classes || [];
        const foundCls = Object.values(d?.graphData?.countsByFrame || {}).reduce((set, row) => {
          Object.keys(row).forEach((k) => set.add(k));
          return set;
        }, new Set());
        const all = Array.from(new Set([...(inputCls || []), ...Array.from(foundCls)]));
        setSelectedClasses(all.slice(0, 5)); // pick first few for initial view
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const allClasses = useMemo(() => {
    if (!doc?.graphData?.countsByFrame) return [];
    const set = new Set();
    Object.values(doc.graphData.countsByFrame).forEach((row) => {
      Object.keys(row).forEach((k) => set.add(k));
    });
    return Array.from(set).sort();
  }, [doc]);

  const timeSeries = useMemo(() => {
    if (!doc?.graphData?.frames || !doc?.graphData?.countsByFrame) return [];
    const frames = doc.graphData.frames;
    const cbf = doc.graphData.countsByFrame; // keyed by frame index (string)
    // build rows in time order
    const rows = frames.map((frameIdx, i) => {
      const fKey = String(frameIdx ?? i);
      const row = cbf[fKey] || {};
      const t = (frameIdx ?? i) * FRAME_DT_SEC;
      return { idx: i, frame: frameIdx ?? i, tSec: Number(t.toFixed(3)), ...row };
    });
    const keys = selectedClasses.length ? selectedClasses : allClasses;
    // ensure numeric zeros for missing classes
    const filled = rows.map((r) => {
      const out = { ...r };
      keys.forEach((k) => {
        if (typeof out[k] !== "number") out[k] = 0;
      });
      return out;
    });
    return smoothSeries(filled, keys, Number(smoothWin) || 1);
  }, [doc, selectedClasses, smoothWin, allClasses]);

  const chartKeys = selectedClasses.length ? selectedClasses : allClasses;

  async function onDelete() {
    if (!confirm("Delete this graph history?")) return;
    try {
      setDeleting(true);
      await api.delete(`/historyGraph/${id}`);
      navigate("/graph");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  function exportCSV() {
    const keys = ["idx", "frame", "tSec", ...chartKeys];
    const rows = timeSeries.map((r) => {
      const o = {};
      keys.forEach((k) => (o[k] = r[k] ?? 0));
      return o;
    });
    const safeTitle = (doc?.video?.title || "graph").replace(/[^\w\-]+/g, "_");
    downloadCSV(`${safeTitle}_${id}.csv`, rows);
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Graph Result</h1>
          <p className="text-sm text-gray-500">
            {doc?.video?.title ? `Video: ${doc.video.title}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/graph" className="px-3 py-1.5 rounded-xl border text-sm">
            Back to Graph
          </Link>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-xl border text-sm"
            disabled={!timeSeries.length}
          >
            Export CSV
          </button>
          <button
            disabled={deleting}
            onClick={onDelete}
            className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{err}</div> : null}

      {loading ? (
        <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
          Loading result…
        </div>
      ) : !doc ? (
        <div className="rounded-2xl border p-8 text-sm">No data.</div>
      ) : (
        <>
          <div className="rounded-2xl border p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <ChartSwitcher type={chartType} setType={setChartType} />
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">
                  Smooth (window)
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={smoothWin}
                    onChange={(e) => setSmoothWin(e.target.value)}
                    className="ml-2 w-20 rounded-xl border px-2 py-1.5 text-sm"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Toggle classes</p>
              <ClassPills all={allClasses} selected={selectedClasses} setSelected={setSelectedClasses} />
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={timeSeries} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tSec" tickFormatter={(v) => v.toFixed(1)} label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {chartKeys.map((k) => (
                      <Line key={k} type="monotone" dataKey={k} dot={false} strokeWidth={2} />
                    ))}
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={timeSeries} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tSec" tickFormatter={(v) => v.toFixed(1)} label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {chartKeys.map((k, i) => (
                      <Bar key={k} dataKey={k} stackId="counts" />
                    ))}
                  </BarChart>
                ) : (
                  <AreaChart data={timeSeries} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tSec" tickFormatter={(v) => v.toFixed(1)} label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {chartKeys.map((k) => (
                      <Area key={k} type="monotone" dataKey={k} stackId="1" strokeWidth={1.5} />
                    ))}
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meta + Params */}
          <div className="rounded-2xl border p-4">
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-sm">
                <div className="text-gray-500">History ID</div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">{doc?._id}</code>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Created</div>
                <div>{new Date(doc?.createdAt || Date.now()).toLocaleString()}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Classes</div>
                <div>{(doc?.inputParams?.classes || []).join(", ") || "All"}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Params</div>
                <div className="text-xs">
                  sampleRate: {doc?.inputParams?.sampleRate ?? 1}, conf: {doc?.inputParams?.conf ?? 0.5}, nms: {doc?.inputParams?.nms ?? 0.4}
                </div>
              </div>
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-gray-600">Raw JSON</summary>
              <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-x-auto">
{JSON.stringify(doc?.graphData, null, 2)}
              </pre>
            </details>
          </div>
        </>
      )}
    </div>
  );
}
