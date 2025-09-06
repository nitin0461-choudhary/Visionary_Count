// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../../context/AuthContext";

// // export default function Login() {
// //   const { login } = useAuth();
// //   const nav = useNavigate();
// //   const [form, setForm] = useState({ email: "", username: "", password: "" });
// //   const [msg, setMsg] = useState("");

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await login(form);
// //       nav("/dashboard");
// //     } catch (e) {
// //       setMsg(e?.response?.data?.message || "Login failed");
// //     }
// //   };

// //   return (
// //     <form onSubmit={submit} className="p-4 max-w-xl">
// //       <h2 className="text-xl font-semibold mb-2">Login</h2>
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Email (or leave empty)" onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Username (or leave empty)" onChange={e=>setForm(f=>({...f,username:e.target.value}))} />
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Password" type="password" onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
// //       <button className="border px-3 py-1 rounded">Login</button>
// //       <div className="mt-2 text-red-500">{msg}</div>
// //     </form>
// //   );
// // }
// // client/src/pages/Auth/Login.jsx
// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');

//   const { login, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const from = location.state?.from?.pathname || '/dashboard';

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     const result = await login(formData);
    
//     if (result.success) {
//       navigate(from, { replace: true });
//     } else {
//       setError(result.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h1>Visionary Count</h1>
//           <h2>Sign In</h2>
//           <p>Welcome back! Please sign in to your account.</p>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button type="submit" disabled={loading} className="btn btn-primary">
//             {loading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>
//             Don't have an account?{' '}
//             <Link to="/register" className="auth-link">
//               Sign up here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React from 'react';

import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { reload } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      console.log("form password=",form.password);
      console.log("form.email=",form.email);
      console.log("form.username=",form.username);
      console.log("inside loging")
      const gotit=await api.post("/users/login", form);
      console.log("we got this=",gotit);
      console.log("in frontend ")
      await reload();
      navigate(state?.from?.pathname || "/");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>
      {err && <div className="mt-3 rounded bg-red-50 text-red-700 p-2 text-sm">{err}</div>}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Email (or leave empty if using username)"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Username (or leave empty if using email)"
          value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
        <input type="password" className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <button className="px-4 py-2 rounded-xl bg-black text-white text-sm" type="submit">Login</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        No account? <Link className="underline" to="/register">Register</Link>
      </p>
    </div>
  );
}
