// // import { Navigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export default function Protected({ children }) {
// //   const { user, booted } = useAuth();
// //   if (!booted) return null;        // place for a splash loader if you like
// //   if (!user) return <Navigate to="/login" replace />;
// //   return children;
// // }
// // client/src/components/Protected.jsx
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Protected = ({ children }) => {
//   const { isAuthenticated, booted } = useAuth();
//   const location = useLocation();

//   // Show loading while checking authentication
//   if (!booted) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default Protected;
import React from 'react';

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return <div className="p-4">Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
