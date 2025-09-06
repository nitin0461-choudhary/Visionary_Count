import React from "react";

import { Routes, Route } from "react-router-dom";

// shared layout
import NavBar from "../components/NavBar.jsx";        // or ./Navbar if you rename
import ProtectedRoute from "../components/ProtectedRoute.jsx"; // or ./ProtectedRoute if you rename

// pages
import Home from "../pages/Home.jsx";
//import Home from "../pages/Home1.jsx/index.js"
import About from "../pages/About.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import UploadVideo from "../pages/UploadVideo.jsx";

// Feature pages
import BboxFeaturePage from "../pages/bbox/BboxFeaturePage.jsx";
import BboxHistoryDetailPage from "../pages/bbox/BboxHistoryDetailPage.jsx";
import GraphFeaturePage from "../pages/graph/GraphFeaturePage.jsx";
import GraphHistoryDetailPage from "../pages/graph/GraphHistoryDetailPage.jsx";
import UniqueFeaturePage from "../pages/unique/UniqueFeaturePage.jsx";
import UniqueHistoryDetailPage from "../pages/unique/UniqueHistoryDetailPage.jsx";

// auth
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";

// fallback
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <>
      <NavBar />
      <div className="px-4 lg:px-8 py-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected group */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            {<Route path="/upload" element={<UploadVideo />} /> }

            {/* BBox */}
            <Route path="/bbox" element={<BboxFeaturePage />} />
            <Route path="/bbox/:id" element={<BboxHistoryDetailPage />} />

            {/* Graph */}
            <Route path="/graph" element={<GraphFeaturePage />} />
            <Route path="/graph/:id" element={<GraphHistoryDetailPage />} />

            {/* Unique */}
            <Route path="/unique" element={<UniqueFeaturePage />} />
            <Route path="/unique/:id" element={<UniqueHistoryDetailPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
