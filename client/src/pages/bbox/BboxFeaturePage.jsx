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

function VideoChoiceCard({ item, onRun, running }) {
  return (
    <div className="rounded-2xl border p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {/* If you store a thumbnail, swap in <img src=... /> here */}
          <span className="text-xs text-gray-500">Video</span>
        </div>
        <div className="flex-1">
          <p className="font-medium line-clamp-1">{item?.title || "Untitled video"}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Uploaded {new Date(item?.createdAt || item?.uploadedAt || Date.now()).toLocaleString()}
          </p>
        </div>
        <button
          disabled={running}
          onClick={() => onRun(item)}
          className="px-3 py-1.5 rounded-xl bg-black text-white text-sm disabled:opacity-60"
        >
          {running ? "Running..." : "Run BBox"}
        </button>
      </div>
    </div>
  );
}

function HistoryCard({ hist }) {
  const created = useMemo(
    () => new Date(hist?.createdAt || Date.now()).toLocaleString(),
    [hist?.createdAt]
  );
  return (
    <Link
      to={`/bbox/${hist?._id}`}
      className="block rounded-2xl border p-4 hover:shadow-sm transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {/* If you store overlay thumb, place <img src=hist?.overlayVideo?.thumbnail /> */}
          <span className="text-xs text-gray-500">BBox</span>
        </div>
        <div className="flex-1">
          <p className="font-medium line-clamp-1">
            {hist?.video?.title || "Processed Video"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Ran on {created}</p>
          {hist?.artifacts?.length ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Artifacts: {hist.artifacts.length}
            </p>
          ) : null}
        </div>
        <div className="text-sm text-gray-400">View</div>
      </div>
    </Link>
  );
}

export default function BboxFeaturePage() {
  const navigate = useNavigate();

  const [choices, setChoices] = useState([]);
  const [cards, setCards] = useState([]);
  const [loadingChoices, setLoadingChoices] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [runningOn, setRunningOn] = useState(null);
  const [error, setError] = useState("");

  async function fetchChoices() {
    setLoadingChoices(true);
    setError("");
    try {
      const res = await api.get("/historyBbox/choices/list");
      // Expecting something like { data: [ { _id, title, createdAt, ... } ] }
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
      const res = await api.get("/historyBbox/cards");
      // Expecting { data: [ historyDoc, ... ] }
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

  async function runBbox(item) {
    try {
      setRunningOn(item?._id);
      setError("");
      // POST /run/:videoId
      const res = await api.post(`/historyBbox/run/${item?._id}`);
      // The controller should return the created history (recommended).
      const created = res?.data?.data || res?.data;
      if (created?._id) {
        // navigate directly to the detail page
        navigate(`/bbox/${created._id}`);
      } else {
        // fallback: refresh cards and stay here
        await fetchCards();
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
        <h1 className="text-xl lg:text-2xl font-bold">BBox Overlay</h1>
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

      {error ? (
        <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Choices */}
        <section className="space-y-3">
          <SectionHeader
            title="Choices (select a video to run)"
            right={
              <span className="text-xs text-gray-500">
                {loadingChoices ? "Loading..." : `${choices.length} available`}
              </span>
            }
          />
          {loadingChoices ? (
            <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
              Fetching choices…
            </div>
          ) : choices.length === 0 ? (
            <EmptyState
              title="No videos found"
              subtitle="Upload a video first, then run the BBox overlay."
              action={<Link to="/upload" className="underline">Go to Upload</Link>}
            />
          ) : (
            <div className="space-y-3">
              {choices.map((c) => (
                <VideoChoiceCard
                  key={c._id}
                  item={c}
                  onRun={runBbox}
                  running={runningOn === c._id}
                />
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="space-y-3">
          <SectionHeader
            title="History"
            right={
              <span className="text-xs text-gray-500">
                {loadingCards ? "Loading..." : `${cards.length} runs`}
              </span>
            }
          />
          {loadingCards ? (
            <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
              Fetching history…
            </div>
          ) : cards.length === 0 ? (
            <EmptyState
              title="No history yet"
              subtitle="Run BBox on a video to see results here."
            />
          ) : (
            <div className="space-y-3">
              {cards.map((h) => (
                <HistoryCard key={h._id} hist={h} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
