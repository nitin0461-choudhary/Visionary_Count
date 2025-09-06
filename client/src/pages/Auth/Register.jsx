// // import { useState } from "react";
// // import { useAuth } from "../../context/AuthContext";

// // export default function Register() {
// //   const { register } = useAuth();
// //   const [form, setForm] = useState({ username: "", email: "", fullName: "", password: "" });
// //   const [avatar, setAvatar] = useState(null);
// //   const [msg, setMsg] = useState("");

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     const fd = new FormData();
// //     fd.append("username", form.username);
// //     fd.append("email", form.email);
// //     fd.append("fullName", form.fullName);
// //     fd.append("password", form.password);
// //     if (avatar) fd.append("avatar", avatar);
// //     try {
// //       await register(fd);
// //       setMsg("Registered! You can login now.");
// //     } catch (e) {
// //       setMsg(e?.response?.data?.message || "Error");
// //     }
// //   };

// //   return (
// //     <form onSubmit={submit} className="p-4 max-w-xl">
// //       <h2 className="text-xl font-semibold mb-2">Register</h2>
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Username" onChange={e=>setForm(f=>({...f,username:e.target.value}))} />
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Email" onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Full name" onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} />
// //       <input className="border px-2 py-1 rounded w-full mb-2" placeholder="Password" type="password" onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
// //       <input className="block mb-2" type="file" accept="image/*" onChange={e=>setAvatar(e.target.files?.[0]||null)} />
// //       <button className="border px-3 py-1 rounded">Register</button>
// //       <div className="mt-2">{msg}</div>
// //     </form>
// //   );
// // }
// // client/src/pages/Auth/Register.jsx
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     fullName: '',
//   });
//   const [avatar, setAvatar] = useState(null);
//   const [error, setError] = useState('');

//   const { register, loading } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         setError('Avatar file size must be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         setError('Avatar must be an image file');
//         return;
//       }
//       setAvatar(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Validation
//     if (!formData.username || !formData.email || !formData.password) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     // Create FormData for multipart upload
//     const submitData = new FormData();
//     submitData.append('username', formData.username);
//     submitData.append('email', formData.email);
//     submitData.append('password', formData.password);
//     if (formData.fullName) {
//       submitData.append('fullName', formData.fullName);
//     }
//     if (avatar) {
//       submitData.append('avatar', avatar);
//     }

//     const result = await register(submitData);
    
//     if (result.success) {
//       navigate('/dashboard');
//     } else {
//       setError(result.error || 'Registration failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h1>Visionary Count</h1>
//           <h2>Create Account</h2>
//           <p>Join us to start analyzing your videos with AI.</p>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="username">Username *</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Choose a username"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email *</label>
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
//             <label htmlFor="fullName">Full Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Enter your full name (optional)"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="avatar">Avatar</label>
//             <input
//               type="file"
//               id="avatar"
//               accept="image/*"
//               onChange={handleAvatarChange}
//             />
//             <small className="form-hint">Optional. Max 5MB. JPG, PNG, GIF supported.</small>
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password *</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Create a password (min 6 chars)"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password *</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm your password"
//               required
//             />
//           </div>

//           <button type="submit" disabled={loading} className="btn btn-primary">
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>
//             Already have an account?{' '}
//             <Link to="/login" className="auth-link">
//               Sign in here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React from 'react';

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:"", username:"", email:"", password:"" });
  const [avatar, setAvatar] = useState(null);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      await api.post("users/register", fd, { headers: { "Content-Type":"multipart/form-data" }});
      navigate("/login");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Register</h1>
      {err && <div className="mt-3 rounded bg-red-50 text-red-700 p-2 text-sm">{err}</div>}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Full name"
          value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})}/>
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Username"
          value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input type="password" className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files?.[0])} className="text-sm" />
        <button className="px-4 py-2 rounded-xl bg-black text-white text-sm" type="submit">Create account</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        Already have an account? <Link className="underline" to="/login">Login</Link>
      </p>
    </div>
  );
}
