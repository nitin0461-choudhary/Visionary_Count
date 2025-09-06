import React from 'react';

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function SectionHeader({ title, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div>{right}</div>
    </div>
  );
}

function EmptyState({ title, subtitle, action }) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center">
      <p className="text-base font-medium">{title}</p>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function ChoiceRow({ video, onRun, running }) {
  const [classesInput, setClassesInput] = useState("");
  const [showAdv, setShowAdv] = useState(false);
  const [sampleRate, setSampleRate] = useState(1);
  const [conf, setConf] = useState(0.5);
  const [nms, setNms] = useState(0.4);

  function parseClasses(value) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-xs text-gray-500">Video</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{video?.title || "Untitled video"}</p>
          <p className="text-xs text-gray-500">
            Uploaded {new Date(video?.createdAt || Date.now()).toLocaleString()}
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <input
              value={classesInput}
              onChange={(e) => setClassesInput(e.target.value)}
              placeholder="Enter classes (comma-separated) e.g. person, car, bicycle"
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
            />
            <button
              disabled={running}
              onClick={() =>
                onRun(video, {
                  classes: parseClasses(classesInput),
                  sampleRate: Number(sampleRate) || 1,
                  conf: Number(conf),
                  nms: Number(nms),
                })
              }
              className="px-3 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-60"
            >
              {running ? "Running…" : "Run Graph"}
            </button>
          </div>

          <button
            className="mt-2 text-xs underline text-gray-600"
            onClick={() => setShowAdv((s) => !s)}
          >
            {showAdv ? "Hide advanced" : "Show advanced (sampleRate, conf, nms)"}
          </button>

          {showAdv ? (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="text-xs text-gray-600">
                Sample Rate (frames)
                <input
                  type="number"
                  min={1}
                  value={sampleRate}
                  onChange={(e) => setSampleRate(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-xs text-gray-600">
                Conf
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={conf}
                  onChange={(e) => setConf(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-xs text-gray-600">
                NMS
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={nms}
                  onChange={(e) => setNms(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-2 py-1.5 text-sm"
                />
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item }) {
  return (
    <Link
      to={`/graph/${item?._id}`}
      className="block rounded-2xl border p-4 hover:shadow-sm transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-xs text-gray-500">Graph</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{item?.video?.title || "Processed"}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Ran on {new Date(item?.createdAt || Date.now()).toLocaleString()}
          </p>
          {Array.isArray(item?.inputParams?.classes) && item.inputParams.classes.length ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Classes: {item.inputParams.classes.join(", ")}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-0.5">All classes</p>
          )}
        </div>
        <div className="text-sm text-gray-400">View</div>
      </div>
    </Link>
  );
}

export default function GraphFeaturePage() {
  const navigate = useNavigate();
  const [choices, setChoices] = useState([]);
  const [cards, setCards] = useState([]);
  const [loadingChoices, setLoadingChoices] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [error, setError] = useState("");
  const [runningOn, setRunningOn] = useState(null);

  async function fetchChoices() {
    setLoadingChoices(true);
    setError("");
    try {
      const res = await api.get("/historyGraph/choices/list");
      setChoices(res?.data?.data || res?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load choices");
    } finally {
      setLoadingChoices(false);
    }
  }

  async function fetchCards() {
    setLoadingCards(true);
    setError("");
    try {
      const res = await api.get("/historyGraph/cards");
      setCards(res?.data?.data || res?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load history");
    } finally {
      setLoadingCards(false);
    }
  }

  useEffect(() => {
    fetchChoices();
    fetchCards();
  }, []);

  async function run(video, params) {
    try {
      setRunningOn(video?._id);
      setError("");
      const res = await api.post(`/historyGraph/run/${video?._id}`, params);
      const created = res?.data?.data || res?.data;
      if (created?._id) {
        navigate(`/graph/${created._id}`);
      } else {
        await fetchCards();v1
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Run failed");
    } finally {
      setRunningOn(null);
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl lg:text-2xl font-bold">Graph (Per-Frame Counts)</h1>
        <button
          onClick={() => {
            fetchChoices();
            fetchCards();
          }}
          className="px-3 py-1.5 rounded-xl border text-sm"
        >
          Refresh
        </button>
      </div>

      {error ? <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Choices */}
        <section className="space-y-3">
          <SectionHeader
            title="Choices (select a video, enter classes)"
            right={<span className="text-xs text-gray-500">
              {loadingChoices ? "Loading..." : `${choices.length} available`}
            </span>}
          />
          {loadingChoices ? (
            <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
              Fetching choices…
            </div>
          ) : choices.length === 0 ? (
            <EmptyState
              title="No videos available"
              subtitle="Upload a video to run the graph pipeline."
              action={<Link to="/upload" className="underline">Go to Upload</Link>}
            />
          ) : (
            <div className="space-y-3">
              {choices.map((v) => (
                <ChoiceRow key={v._id} video={v} onRun={run} running={runningOn === v._id} />
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="space-y-3">
          <SectionHeader
            title="History"
            right={<span className="text-xs text-gray-500">
              {loadingCards ? "Loading..." : `${cards.length} runs`}
            </span>}
          />
          {loadingCards ? (
            <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
              Fetching history…
            </div>
          ) : cards.length === 0 ? (
            <EmptyState title="No history yet" subtitle="Run a graph to see results here." />
          ) : (
            <div className="space-y-3">
              {cards.map((h) => <HistoryCard key={h._id} item={h} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
