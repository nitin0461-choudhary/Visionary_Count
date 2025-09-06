// // // import { NavLink, useNavigate } from "react-router-dom";
// // // import { useAuth } from "../context/AuthContext";

// // // const link = "px-3 py-2 rounded hover:bg-zinc-800";
// // // const active = ({ isActive }) => (isActive ? "bg-zinc-800 text-white" : "text-zinc-300");

// // // export default function NavBar() {
// // //   const { user, logout } = useAuth();
// // //   const nav = useNavigate();

// // //   const out = async () => {
// // //     try { await logout(); nav("/login"); } catch {}
// // //   };

// // //   return (
// // //     <nav className="p-3 border-b border-zinc-800 flex items-center gap-3 justify-between">
// // //       <div className="flex items-center gap-2">
// // //         <NavLink to="/home" className={({ isActive }) => `${link} ${active({ isActive })}`}>Home</NavLink>
// // //         <NavLink to="/upload" className={({ isActive }) => `${link} ${active({ isActive })}`}>Upload</NavLink>
// // //         <NavLink to="/graph" className={({ isActive }) => `${link} ${active({ isActive })}`}>Graph</NavLink>
// // //         <NavLink to="/unique" className={({ isActive }) => `${link} ${active({ isActive })}`}>Unique</NavLink>
// // //         <NavLink to="/bbox" className={({ isActive }) => `${link} ${active({ isActive })}`}>BBox</NavLink>
// // //         <NavLink to="/history" className={({ isActive }) => `${link} ${active({ isActive })}`}>History</NavLink>
// // //       </div>
// // //       <div className="text-sm text-zinc-300">
// // //         {user ? (
// // //           <>
// // //             <span className="mr-2">{user.fullName || user.username}</span>
// // //             <button onClick={out} className="underline">Logout</button>
// // //           </>
// // //         ) : (
// // //           <NavLink to="/login" className="underline">Login</NavLink>
// // //         )}
// // //       </div>
// // //     </nav>
// // //   );
// // // }
// // // client/src/components/NavBar.jsx
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';

// // const NavBar = () => {
// //   const { user, logout, isAuthenticated } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogout = async () => {
// //     await logout();
// //     navigate('/login');
// //   };

// //   if (!isAuthenticated) {
// //     return null; // Don't show nav on auth pages
// //   }

// //   return (
// //     <nav className="navbar">
// //       <div className="nav-container">
// //         <Link to="/home" className="nav-logo">
// //           <h2>Visionary Count</h2>
// //         </Link>
        
// //         <div className="nav-menu">
// //           <Link to="/home" className="nav-link">Home</Link>
// //           <Link to="/upload" className="nav-link">Feature</Link>
// //           <Link to="/graph" className="nav-link">Upload Video</Link>
// //           <Link to="/unique" className="nav-link">About</Link>

// //         </div>

// //         <div className="nav-user">
// //           <div className="user-info">
// //             {user?.avatar?.url && (
// //               <img 
// //                 src={user.avatar.url} 
// //                 alt="Avatar" 
// //                 className="user-avatar"
// //               />
// //             )}
// //             <span className="username">Hi, {user?.fullName || user?.username}</span>
// //           </div>
// //           <button onClick={handleLogout} className="btn btn-outline">
// //             Logout
// //           </button>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default NavBar;
// import { Link } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// export default function Navbar() {
//   const { user } = useAuth();
//   return (
//     <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
//       <div className="max-w-6xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
//         <Link to="/" className="font-bold">Visionary Count</Link>
//         <div className="flex items-center gap-4 text-sm">
//           <Link to="/">Home</Link>
//           <Link to="/upload">Upload</Link>
//           <Link to="/unique">Unique</Link>
//           <Link to="/bbox">BBox</Link>
//           <Link to="/graph">Graph</Link>
//           {user ? (
//             <Link to="/profile" className="rounded-xl border px-3 py-1">Profile</Link>
//           ) : (
//             <Link to="/login" className="rounded-xl border px-3 py-1">Login/Register</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
import React from 'react';

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links configuration
  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/features", label: "Features", icon: "⚡" },
    { to: "/upload", label: "Upload Video", icon: "📹" },
    { to: "/about", label: "About", icon: "ℹ️" },
  ];

  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              <span className="text-2xl">🎯</span>
              <span className="hidden sm:inline">Visionary Count</span>
              <span className="sm:hidden">VC</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                    isActiveLink(link.to)
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Avatar & Name */}
                  <div className="flex items-center space-x-2">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      Hi, {user.fullName || user.username}
                    </span>
                  </div>
                  
                  {/* Profile & Logout Buttons */}
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActiveLink(link.to)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-2 space-y-3">
                {/* User Info */}
                <div className="flex items-center px-3 py-2">
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.fullName || user.username}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                
                {/* Mobile Profile & Logout */}
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full px-3 py-2 rounded-lg text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Login / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
