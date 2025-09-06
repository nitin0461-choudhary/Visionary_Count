// // import { createContext, useContext, useEffect, useState } from "react";
// // import api, { unwrap } from "../api/axios";

// // const AuthContext = createContext(null);

// // export default function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [booted, setBooted] = useState(false);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const res = await api.get("/users/current-user");
// //         const data = unwrap(res);
// //         setUser(data?.user ?? data);
// //       } catch {
// //         setUser(null);
// //       } finally {
// //         setBooted(true);
// //       }
// //     })();
// //   }, []);

// //   const login = async ({ email, username, password }) => {
// //     const res = await api.post("/users/login", { email, username, password });
// //     const data = unwrap(res);
// //     setUser(data?.user ?? data);
// //     return data;
// //   };

// //   const register = async (formData) => {
// //     const res = await api.post("/users/register", formData, {
// //       headers: { "Content-Type": "multipart/form-data" },
// //     });
// //     const data = unwrap(res);
// //     setUser(data?.user ?? data);
// //     return data;
// //   };

// //   const logout = async () => {
// //     await api.post("/users/logout");
// //     setUser(null);
// //   };

// //   const value = { user, booted, login, register, logout };
// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // export const useAuth = () => {
// //   const ctx = useContext(AuthContext);
// //   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
// //   return ctx;
// // };
// // client/src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../api/axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [booted, setBooted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Bootstrap: check if user is already logged in
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await api.get('/users/current-user');
//         setUser(response.data.user);
//       } catch (error) {
//         // User not authenticated, that's fine
//         setUser(null);
//       } finally {
//         setBooted(true);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (credentials) => {
//     setLoading(true);
//     try {
//       const response = await api.post('/users/login', credentials);
//       setUser(response.data.user);
//       return { success: true, user: response.data.user };
//     } catch (error) {
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (formData) => {
//     setLoading(true);
//     try {
//       const response = await api.post('/users/register', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setUser(response.data.user);
//       return { success: true, user: response.data.user };
//     } catch (error) {
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post('/users/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//     }
//   };

//   const updateUser = (userData) => {
//     setUser(prev => ({ ...prev, ...userData }));
//   };

//   const value = {
//     user,
//     booted,
//     loading,
//     login,
//     register,
//     logout,
//     updateUser,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React from "react";
import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  async function loadMe() {
    try {
      const res = await api.get("/users/current-user");
      setUser(res?.data?.data || res?.data || null);
    } catch {
      setUser(null);
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => { loadMe(); }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, booting, reload: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}
