import React from 'react';

import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

function Card({ title, children, right }) {
  return (
    <div className="rounded-2xl border p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      {children}
      {hint ? <div className="text-xs text-gray-500 mt-1">{hint}</div> : null}
    </label>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        "px-3 py-2 rounded-xl text-sm border hover:shadow-sm transition disabled:opacity-60 " +
        className
      }
    >
      {children}
    </button>
  );
}

export default function ProfilePage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // account form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // password form
  const [currPwd, setCurrPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  // avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  async function fetchMe() {
    setLoading(true);
    setErr("");
    try {
      console.log("here");
      const res = await api.get("users/current-user");
      console.log("ok in frontend");
      const u = res?.data?.data || res?.data;
      setMe(u);
      setFullName(u?.fullName || "");
      setEmail(u?.email || "");
      setAvatarPreview(u?.avatar || "");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function onSaveAccount(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.patch("/users/update-account", { fullName, email });
      await fetchMe();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Update failed");
    }
  }

  async function onChangePassword(e) {
    e.preventDefault();
    setErr("");
    try {
      setChangingPwd(true);
      await api.post("/users/change-password", {
        password: currPwd,
        new_password: newPwd,
      });
      setCurrPwd("");
      setNewPwd("");
      alert("Password changed successfully.");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Change password failed");
    } finally {
      setChangingPwd(false);
    }
  }

  function onPickAvatar(file) {
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(me?.avatar || "");
    }
  }

  async function onUploadAvatar() {
    if (!avatarFile) return;
    setUpdatingAvatar(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      await api.patch("/users/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarFile(null);
      fileInputRef.current && (fileInputRef.current.value = "");
      await fetchMe();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Avatar update failed");
    } finally {
      setUpdatingAvatar(false);
    }
  }

  async function onLogout() {
    try {
      await api.post("/users/logout");
      // Hard redirect to login, or route to your login page
      window.location.href = "/login";
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Logout failed");
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl lg:text-2xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-sm underline">Home</Link>
          <Button onClick={onLogout} className="bg-red-600 text-white border-red-600">
            Logout
          </Button>
        </div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{err}</div> : null}

      {loading ? (
        <div className="rounded-2xl border p-8 animate-pulse text-sm text-gray-500">
          Loading profile…
        </div>
      ) : !me ? (
        <div className="rounded-2xl border p-8 text-sm">No profile found.</div>
      ) : (
        <>
          {/* Avatar */}
          <Card
            title="Avatar"
            right={
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickAvatar(e.target.files?.[0])}
                  className="text-xs"
                />
                <Button
                  onClick={onUploadAvatar}
                  disabled={!avatarFile || updatingAvatar}
                  className="bg-black text-white"
                >
                  {updatingAvatar ? "Uploading…" : "Update"}
                </Button>
              </div>
            }
          >
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview || "/avatar-fallback.png"}
                alt="avatar"
                className="w-20 h-20 rounded-2xl object-cover bg-gray-100 border"
              />
              <div className="text-sm text-gray-500">
                JPG/PNG recommended. Square images look best.
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card title="Account">
            <form onSubmit={onSaveAccount} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  required
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  required
                />
              </Field>
              <div className="md:col-span-2">
                <Button type="submit" className="bg-black text-white">Save changes</Button>
              </div>
            </form>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Username:</span> {me?.username}</div>
              <div><span className="text-gray-500">User ID:</span> <code className="text-xs">{me?._id}</code></div>
            </div>
          </Card>

          {/* Password */}
          <Card title="Change Password">
            <form onSubmit={onChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Current Password">
                <input
                  type="password"
                  value={currPwd}
                  onChange={(e) => setCurrPwd(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  required
                />
              </Field>
              <Field label="New Password" hint="At least 8 characters recommended">
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  required
                />
              </Field>
              <div className="md:col-span-2">
                <Button type="submit" disabled={changingPwd} className="bg-black text-white">
                  {changingPwd ? "Changing…" : "Change Password"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Danger zone */}
          <Card
            title="Danger Zone"
            right={<Button onClick={onLogout} className="bg-red-600 text-white border-red-600">Logout</Button>}
          >
            <p className="text-sm text-gray-600">
              Logging out will clear your session cookies on this browser.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
