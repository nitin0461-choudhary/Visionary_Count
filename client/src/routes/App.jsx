// // // // // import NavBar from "./components/NavBar";
// // // // // import AppRoutes from "./routes/AppRoutes";

// // // // // export default function App() {
// // // // //   return (
// // // // //     <>
// // // // //       <NavBar />
// // // // //       <AppRoutes />
// // // // //     </>
// // // // //   );
// // // // // }
// // // // import React, { useState, useEffect, createContext, useContext } from 'react';
// // // // import { Camera, Upload, BarChart3, Hash, Video, History, User, LogOut, Menu, X, Play, Download, Trash2, Eye, Settings, Lock } from 'lucide-react';

// // // // // API Configuration
// // // // const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

// // // // // API Helper Functions
// // // // async function api(path, init) {
// // // //   const res = await fetch(`${API_BASE}${path}`, {
// // // //     ...init,
// // // //     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
// // // //     credentials: "include",
// // // //   });
// // // //   const json = await res.json().catch(() => ({}));
// // // //   if (!res.ok || json?.success === false) {
// // // //     throw new Error(json?.message || `HTTP ${res.status}`);
// // // //   }
// // // //   return json?.data ?? json;
// // // // }

// // // // async function uploadFile(path, formData) {
// // // //   const res = await fetch(`${API_BASE}${path}`, {
// // // //     method: "POST",
// // // //     body: formData,
// // // //     credentials: "include",
// // // //   });
// // // //   const json = await res.json();
// // // //   if (!res.ok || json?.success === false) {
// // // //     throw new Error(json?.message || `HTTP ${res.status}`);
// // // //   }
// // // //   return json?.data ?? json;
// // // // }

// // // // // Auth Context
// // // // const AuthContext = createContext();

// // // // function AuthProvider({ children }) {
// // // //   const [user, setUser] = useState(null);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     checkAuth();
// // // //   }, []);

// // // //   const checkAuth = async () => {
// // // //     try {
// // // //       const userData = await api('/api/users/current-user');
// // // //       setUser(userData.user);
// // // //     } catch (error) {
// // // //       setUser(null);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const login = async (email, password) => {
// // // //     const response = await api('/api/users/login', {
// // // //       method: 'POST',
// // // //       body: JSON.stringify({ email, password }),
// // // //     });
// // // //     setUser(response.user);
// // // //     return response;
// // // //   };

// // // //   const register = async (formData) => {
// // // //     const response = await uploadFile('/api/users/register', formData);
// // // //     setUser(response.user);
// // // //     return response;
// // // //   };

// // // //   const logout = async () => {
// // // //     await api('/api/users/logout', { method: 'POST' });
// // // //     setUser(null);
// // // //   };

// // // //   const updateUser = (userData) => {
// // // //     setUser(userData);
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser, checkAuth }}>
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // }

// // // // function useAuth() {
// // // //   const context = useContext(AuthContext);
// // // //   if (!context) {
// // // //     throw new Error('useAuth must be used within an AuthProvider');
// // // //   }
// // // //   return context;
// // // // }

// // // // // Router Implementation
// // // // function Router() {
// // // //   const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
// // // //   const { user, loading } = useAuth();

// // // //   useEffect(() => {
// // // //     const handlePopState = () => setCurrentRoute(window.location.pathname);
// // // //     window.addEventListener('popstate', handlePopState);
// // // //     return () => window.removeEventListener('popstate', handlePopState);
// // // //   }, []);

// // // //   const navigate = (path) => {
// // // //     window.history.pushState({}, '', path);
// // // //     setCurrentRoute(path);
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-900">
// // // //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (!user && !['/login', '/register'].includes(currentRoute)) {
// // // //     return <Login navigate={navigate} />;
// // // //   }

// // // //   if (user && ['/login', '/register'].includes(currentRoute)) {
// // // //     navigate('/dashboard');
// // // //   }

// // // //   const routeComponents = {
// // // //     '/dashboard': <Dashboard navigate={navigate} />,
// // // //     '/upload': <Upload navigate={navigate} />,
// // // //     '/graph': <GraphAnalysis navigate={navigate} />,
// // // //     '/unique': <UniqueCounts navigate={navigate} />,
// // // //     '/bbox': <BBoxVideo navigate={navigate} />,
// // // //     '/history': <FeatureHistory navigate={navigate} />,
// // // //     '/profile': <Profile navigate={navigate} />,
// // // //     '/login': <Login navigate={navigate} />,
// // // //     '/register': <Register navigate={navigate} />,
// // // //   };

// // // //   const Component = routeComponents[currentRoute] || <Dashboard navigate={navigate} />;

// // // //   if (!user) {
// // // //     return Component;
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-900">
// // // //       <Navbar navigate={navigate} />
// // // //       <main className="pt-16">
// // // //         {Component}
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Navbar Component
// // // // function Navbar({ navigate }) {
// // // //   const [isOpen, setIsOpen] = useState(false);
// // // //   const { user, logout } = useAuth();

// // // //   const handleLogout = async () => {
// // // //     try {
// // // //       await logout();
// // // //       navigate('/login');
// // // //     } catch (error) {
// // // //       console.error('Logout failed:', error);
// // // //     }
// // // //   };

// // // //   const navItems = [
// // // //     { path: '/dashboard', icon: Camera, label: 'Dashboard' },
// // // //     { path: '/upload', icon: Upload, label: 'Upload' },
// // // //     { path: '/graph', icon: BarChart3, label: 'Graph Analysis' },
// // // //     { path: '/unique', icon: Hash, label: 'Unique Counts' },
// // // //     { path: '/bbox', icon: Video, label: 'BBox Video' },
// // // //     { path: '/history', icon: History, label: 'History' },
// // // //   ];

// // // //   return (
// // // //     <nav className="fixed top-0 w-full bg-gray-800 shadow-lg z-50">
// // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // // //         <div className="flex justify-between h-16">
// // // //           <div className="flex items-center">
// // // //             <Camera className="h-8 w-8 text-blue-500 mr-2" />
// // // //             <span className="text-xl font-bold text-white">Object Counter</span>
// // // //           </div>

// // // //           {/* Desktop Navigation */}
// // // //           <div className="hidden md:flex items-center space-x-4">
// // // //             {navItems.map(({ path, icon: Icon, label }) => (
// // // //               <button
// // // //                 key={path}
// // // //                 onClick={() => navigate(path)}
// // // //                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
// // // //               >
// // // //                 <Icon className="h-4 w-4 mr-1" />
// // // //                 {label}
// // // //               </button>
// // // //             ))}
            
// // // //             <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-600">
// // // //               <button
// // // //                 onClick={() => navigate('/profile')}
// // // //                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
// // // //               >
// // // //                 <User className="h-4 w-4 mr-1" />
// // // //                 {user?.username}
// // // //               </button>
// // // //               <button
// // // //                 onClick={handleLogout}
// // // //                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white"
// // // //               >
// // // //                 <LogOut className="h-4 w-4" />
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Mobile menu button */}
// // // //           <div className="md:hidden flex items-center">
// // // //             <button
// // // //               onClick={() => setIsOpen(!isOpen)}
// // // //               className="text-gray-400 hover:text-white p-2"
// // // //             >
// // // //               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Mobile Navigation */}
// // // //         {isOpen && (
// // // //           <div className="md:hidden">
// // // //             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
// // // //               {navItems.map(({ path, icon: Icon, label }) => (
// // // //                 <button
// // // //                   key={path}
// // // //                   onClick={() => {
// // // //                     navigate(path);
// // // //                     setIsOpen(false);
// // // //                   }}
// // // //                   className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white w-full text-left"
// // // //                 >
// // // //                   <Icon className="h-5 w-5 mr-2" />
// // // //                   {label}
// // // //                 </button>
// // // //               ))}
// // // //               <div className="border-t border-gray-600 pt-2 mt-2">
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     navigate('/profile');
// // // //                     setIsOpen(false);
// // // //                   }}
// // // //                   className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white w-full text-left"
// // // //                 >
// // // //                   <User className="h-5 w-5 mr-2" />
// // // //                   Profile
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={handleLogout}
// // // //                   className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-600 hover:text-white w-full text-left"
// // // //                 >
// // // //                   <LogOut className="h-5 w-5 mr-2" />
// // // //                   Logout
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </nav>
// // // //   );
// // // // }

// // // // // Login Component
// // // // function Login({ navigate }) {
// // // //   const [email, setEmail] = useState('');
// // // //   const [password, setPassword] = useState('');
// // // //   const [error, setError] = useState('');
// // // //   const [loading, setLoading] = useState(false);
// // // //   const { login } = useAuth();

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setError('');
// // // //     setLoading(true);

// // // //     try {
// // // //       await login(email, password);
// // // //       navigate('/dashboard');
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
// // // //       <div className="max-w-md w-full space-y-8">
// // // //         <div>
// // // //           <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-500">
// // // //             <Camera className="h-8 w-8 text-white" />
// // // //           </div>
// // // //           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
// // // //             Sign in to your account
// // // //           </h2>
// // // //         </div>
// // // //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// // // //           {error && (
// // // //             <div className="bg-red-500 text-white p-3 rounded-md text-sm">
// // // //               {error}
// // // //             </div>
// // // //           )}
// // // //           <div className="space-y-4">
// // // //             <input
// // // //               type="email"
// // // //               required
// // // //               value={email}
// // // //               onChange={(e) => setEmail(e.target.value)}
// // // //               className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// // // //               placeholder="Email address"
// // // //             />
// // // //             <input
// // // //               type="password"
// // // //               required
// // // //               value={password}
// // // //               onChange={(e) => setPassword(e.target.value)}
// // // //               className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// // // //               placeholder="Password"
// // // //             />
// // // //           </div>

// // // //           <div>
// // // //             <button
// // // //               type="submit"
// // // //               disabled={loading}
// // // //               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
// // // //             >
// // // //               {loading ? 'Signing in...' : 'Sign in'}
// // // //             </button>
// // // //           </div>

// // // //           <div className="text-center">
// // // //             <button
// // // //               type="button"
// // // //               onClick={() => navigate('/register')}
// // // //               className="font-medium text-blue-400 hover:text-blue-300"
// // // //             >
// // // //               Don't have an account? Sign up
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Register Component
// // // // function Register({ navigate }) {
// // // //   const [formData, setFormData] = useState({
// // // //     username: '',
// // // //     email: '',
// // // //     password: '',
// // // //     fullName: '',
// // // //   });
// // // //   const [avatar, setAvatar] = useState(null);
// // // //   const [error, setError] = useState('');
// // // //   const [loading, setLoading] = useState(false);
// // // //   const { register } = useAuth();

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setError('');
// // // //     setLoading(true);

// // // //     try {
// // // //       const fd = new FormData();
// // // //       Object.entries(formData).forEach(([key, value]) => {
// // // //         fd.append(key, value);
// // // //       });
// // // //       if (avatar) {
// // // //         fd.append('avatar', avatar);
// // // //       }

// // // //       await register(fd);
// // // //       navigate('/dashboard');
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
// // // //       <div className="max-w-md w-full space-y-8">
// // // //         <div>
// // // //           <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-500">
// // // //             <Camera className="h-8 w-8 text-white" />
// // // //           </div>
// // // //           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
// // // //             Create your account
// // // //           </h2>
// // // //         </div>
// // // //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// // // //           {error && (
// // // //             <div className="bg-red-500 text-white p-3 rounded-md text-sm">
// // // //               {error}
// // // //             </div>
// // // //           )}
// // // //           <div className="space-y-4">
// // // //             <input
// // // //               type="text"
// // // //               required
// // // //               value={formData.username}
// // // //               onChange={(e) => setFormData({...formData, username: e.target.value})}
// // // //               className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // // //               placeholder="Username"
// // // //             />
// // // //             <input
// // // //               type="email"
// // // //               required
// // // //               value={formData.email}
// // // //               onChange={(e) => setFormData({...formData, email: e.target.value})}
// // // //               className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // // //               placeholder="Email address"
// // // //             />
// // // //             <input
// // // //               type="text"
// // // //               value={formData.fullName}
// // // //               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
// // // //               className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // // //               placeholder="Full Name (optional)"
// // // //             />
// // // //             <input
// // // //               type="password"
// // // //               required
// // // //               value={formData.password}
// // // //               onChange={(e) => setFormData({...formData, password: e.target.value})}
// // // //               className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // // //               placeholder="Password"
// // // //             />
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                 Avatar (optional)
// // // //               </label>
// // // //               <input
// // // //                 type="file"
// // // //                 accept="image/*"
// // // //                 onChange={(e) => setAvatar(e.target.files[0])}
// // // //                 className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           <div>
// // // //             <button
// // // //               type="submit"
// // // //               disabled={loading}
// // // //               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
// // // //             >
// // // //               {loading ? 'Creating account...' : 'Sign up'}
// // // //             </button>
// // // //           </div>

// // // //           <div className="text-center">
// // // //             <button
// // // //               type="button"
// // // //               onClick={() => navigate('/login')}
// // // //               className="font-medium text-blue-400 hover:text-blue-300"
// // // //             >
// // // //               Already have an account? Sign in
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Dashboard Component
// // // // function Dashboard({ navigate }) {
// // // //   const [videos, setVideos] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState('');

// // // //   useEffect(() => {
// // // //     loadVideos();
// // // //   }, []);

// // // //   const loadVideos = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const response = await api('/api/videos');
// // // //       setVideos(response.items || []);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const deleteVideo = async (videoId) => {
// // // //     if (!confirm('Are you sure you want to delete this video?')) return;
    
// // // //     try {
// // // //       await api(`/api/videos/${videoId}`, { method: 'DELETE' });
// // // //       setVideos(videos.filter(v => v._id !== videoId));
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
// // // //       <div className="px-4 py-6 sm:px-0">
// // // //         <div className="flex justify-between items-center mb-6">
// // // //           <h1 className="text-3xl font-bold text-white">Dashboard</h1>
// // // //           <button
// // // //             onClick={() => navigate('/upload')}
// // // //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
// // // //           >
// // // //             <Upload className="h-4 w-4 mr-2" />
// // // //             Upload Video
// // // //           </button>
// // // //         </div>

// // // //         {error && (
// // // //           <div className="bg-red-500 text-white p-3 rounded-md mb-6">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         {loading ? (
// // // //           <div className="flex justify-center py-12">
// // // //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
// // // //           </div>
// // // //         ) : videos.length === 0 ? (
// // // //           <div className="text-center py-12 bg-gray-800 rounded-lg">
// // // //             <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // // //             <h3 className="text-lg font-medium text-white mb-2">No videos uploaded yet</h3>
// // // //             <p className="text-gray-400 mb-4">Get started by uploading your first video</p>
// // // //             <button
// // // //               onClick={() => navigate('/upload')}
// // // //               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
// // // //             >
// // // //               Upload Video
// // // //             </button>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // //             {videos.map((video) => (
// // // //               <VideoCard key={video._id} video={video} onDelete={deleteVideo} navigate={navigate} />
// // // //             ))}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Video Card Component
// // // // function VideoCard({ video, onDelete, navigate }) {
// // // //   return (
// // // //     <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
// // // //       <div className="relative">
// // // //         <video
// // // //           className="w-full h-48 object-cover"
// // // //           poster={video.url?.replace('.mp4', '.jpg')}
// // // //           muted
// // // //         >
// // // //           <source src={video.url} type="video/mp4" />
// // // //         </video>
// // // //         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
// // // //           <button
// // // //             onClick={() => window.open(video.url, '_blank')}
// // // //             className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full mr-2"
// // // //           >
// // // //             <Play className="h-5 w-5" />
// // // //           </button>
// // // //         </div>
// // // //       </div>
      
// // // //       <div className="p-4">
// // // //         <div className="flex justify-between items-start mb-2">
// // // //           <div className="text-sm text-gray-400">
// // // //             {new Date(video.createdAt).toLocaleDateString()}
// // // //           </div>
// // // //           <button
// // // //             onClick={() => onDelete(video._id)}
// // // //             className="text-red-400 hover:text-red-300"
// // // //           >
// // // //             <Trash2 className="h-4 w-4" />
// // // //           </button>
// // // //         </div>
        
// // // //         <div className="text-xs text-gray-500 mb-4">
// // // //           {video.width}×{video.height} • {(video.bytes / 1024 / 1024).toFixed(1)}MB
// // // //         </div>
        
// // // //         <div className="grid grid-cols-3 gap-2">
// // // //           <button
// // // //             onClick={() => navigate(`/graph?video=${video._id}`)}
// // // //             className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center"
// // // //           >
// // // //             <BarChart3 className="h-3 w-3 mr-1" />
// // // //             Graph
// // // //           </button>
// // // //           <button
// // // //             onClick={() => navigate(`/unique?video=${video._id}`)}
// // // //             className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center"
// // // //           >
// // // //             <Hash className="h-3 w-3 mr-1" />
// // // //             Unique
// // // //           </button>
// // // //           <button
// // // //             onClick={() => navigate(`/bbox?video=${video._id}`)}
// // // //             className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center"
// // // //           >
// // // //             <Video className="h-3 w-3 mr-1" />
// // // //             BBox
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // Upload Component
// // // // function Upload({ navigate }) {
// // // //   const [file, setFile] = useState(null);
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [error, setError] = useState('');
// // // //   const [dragActive, setDragActive] = useState(false);

// // // //   const handleDrag = (e) => {
// // // //     e.preventDefault();
// // // //     e.stopPropagation();
// // // //     if (e.type === "dragenter" || e.type === "dragover") {
// // // //       setDragActive(true);
// // // //     } else if (e.type === "dragleave") {
// // // //       setDragActive(false);
// // // //     }
// // // //   };

// // // //   const handleDrop = (e) => {
// // // //     e.preventDefault();
// // // //     e.stopPropagation();
// // // //     setDragActive(false);
    
// // // //     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// // // //       const droppedFile = e.dataTransfer.files[0];
// // // //       if (droppedFile.type.startsWith('video/')) {
// // // //         setFile(droppedFile);
// // // //       } else {
// // // //         setError('Please select a video file');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleFileChange = (e) => {
// // // //     if (e.target.files && e.target.files[0]) {
// // // //       setFile(e.target.files[0]);
// // // //     }
// // // //   };

// // // //   const handleUpload = async () => {
// // // //     if (!file) return;
    
// // // //     setUploading(true);
// // // //     setError('');
    
// // // //     try {
// // // //       const formData = new FormData();
// // // //       formData.append('video', file);
      
// // // //       await uploadFile('/api/videos', formData);
// // // //       navigate('/dashboard');
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setUploading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
// // // //       <div className="px-4 py-6 sm:px-0">
// // // //         <h1 className="text-3xl font-bold text-white mb-6">Upload Video</h1>

// // // //         {error && (
// // // //           <div className="bg-red-500 text-white p-3 rounded-md mb-6">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         <div
// // // //           className={`border-2 border-dashed rounded-lg p-8 text-center ${
// // // //             dragActive 
// // // //               ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
// // // //               : 'border-gray-600 hover:border-gray-500'
// // // //           }`}
// // // //           onDragEnter={handleDrag}
// // // //           onDragLeave={handleDrag}
// // // //           onDragOver={handleDrag}
// // // //           onDrop={handleDrop}
// // // //         >
// // // //           <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
// // // //           {file ? (
// // // //             <div className="space-y-4">
// // // //               <p className="text-lg text-white">{file.name}</p>
// // // //               <p className="text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
// // // //               <div className="flex justify-center space-x-4">
// // // //                 <button
// // // //                   onClick={handleUpload}
// // // //                   disabled={uploading}
// // // //                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
// // // //                 >
// // // //                   {uploading ? 'Uploading...' : 'Upload Video'}
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={() => setFile(null)}
// // // //                   className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           ) : (
// // // //             <div>
// // // //               <p className="text-lg text-white mb-2">
// // // //                 Drag and drop your video here, or click to select
// // // //               </p>
// // // //               <p className="text-gray-400 mb-4">Supports MP4, AVI, MOV, and other video formats</p>
// // // //               <input
// // // //                 type="file"
// // // //                 accept="video/*"
// // // //                 onChange={handleFileChange}
// // // //                 className="hidden"
// // // //                 id="video-upload"
// // // //               />
// // // //               <label
// // // //                 htmlFor="video-upload"
// // // //                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer inline-block"
// // // //               >
// // // //                 Select Video
// // // //               </label>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Feature Analysis Base Component
// // // // function FeatureAnalysis({ title, icon: Icon, endpoint, navigate, renderResult, defaultParams }) {
// // // //   const [videos, setVideos] = useState([]);
// // // //   const [selectedVideo, setSelectedVideo] = useState('');
// // // //   const [params, setParams] = useState(defaultParams);
// // // //   const [result, setResult] = useState(null);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState('');

// // // //   useEffect(() => {
// // // //     loadVideos();
    
// // // //     // Check for video parameter in URL
// // // //     const urlParams = new URLSearchParams(window.location.search);
// // // //     const videoId = urlParams.get('video');
// // // //     if (videoId) {
// // // //       setSelectedVideo(videoId);
// // // //     }
// // // //   }, []);

// // // //   const loadVideos = async () => {
// // // //     try {
// // // //       const response = await api('/api/videos');
// // // //       setVideos(response.items || []);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     }
// // // //   };

// // // //   const runAnalysis = async () => {
// // // //     if (!selectedVideo) {
// // // //       setError('Please select a video');
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setError('');

// // // //     try {
// // // //       const response = await api(`/api/features/${endpoint}/run`, {
// // // //         method: 'POST',
// // // //         body: JSON.stringify({ videoId: selectedVideo, ...params }),
// // // //       });
// // // //       setResult(response);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
// // // //       <div className="px-4 py-6 sm:px-0">
// // // //         <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
// // // //           <Icon className="h-8 w-8 mr-3 text-blue-500" />
// // // //           {title}
// // // //         </h1>

// // // //         {error && (
// // // //           <div className="bg-red-500 text-white p-3 rounded-md mb-6">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // // //           {/* Configuration Panel */}
// // // //           <div className="lg:col-span-1">
// // // //             <div className="bg-gray-800 rounded-lg p-6">
// // // //               <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
              
// // // //               {/* Video Selection */}
// // // //               <div className="mb-4">
// // // //                 <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                   Select Video
// // // //                 </label>
// // // //                 <select
// // // //                   value={selectedVideo}
// // // //                   onChange={(e) => setSelectedVideo(e.target.value)}
// // // //                   className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                 >
// // // //                   <option value="">Choose a video...</option>
// // // //                   {videos.map((video) => (
// // // //                     <option key={video._id} value={video._id}>
// // // //                       {video.original_filename || `Video ${video._id.slice(-6)}`}
// // // //                     </option>
// // // //                   ))}
// // // //                 </select>
// // // //               </div>

// // // //               {/* Classes Filter */}
// // // //               <div className="mb-4">
// // // //                 <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                   Object Classes (comma-separated)
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={params.classes?.join(', ') || ''}
// // // //                   onChange={(e) => setParams({
// // // //                     ...params,
// // // //                     classes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
// // // //                   })}
// // // //                   placeholder="person, car, bicycle"
// // // //                   className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                 />
// // // //               </div>

// // // //               {/* Confidence Threshold */}
// // // //               <div className="mb-4">
// // // //                 <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                   Confidence Threshold: {params.conf}
// // // //                 </label>
// // // //                 <input
// // // //                   type="range"
// // // //                   min="0.1"
// // // //                   max="1"
// // // //                   step="0.1"
// // // //                   value={params.conf}
// // // //                   onChange={(e) => setParams({...params, conf: parseFloat(e.target.value)})}
// // // //                   className="w-full"
// // // //                 />
// // // //               </div>

// // // //               {/* NMS Threshold */}
// // // //               <div className="mb-4">
// // // //                 <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                   NMS Threshold: {params.nms}
// // // //                 </label>
// // // //                 <input
// // // //                   type="range"
// // // //                   min="0.1"
// // // //                   max="1"
// // // //                   step="0.1"
// // // //                   value={params.nms}
// // // //                   onChange={(e) => setParams({...params, nms: parseFloat(e.target.value)})}
// // // //                   className="w-full"
// // // //                 />
// // // //               </div>

// // // //               {/* Sample Rate */}
// // // //               <div className="mb-4">
// // // //                 <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                   Sample Rate (every Nth frame)
// // // //                 </label>
// // // //                 <input
// // // //                   type="number"
// // // //                   min="1"
// // // //                   max="10"
// // // //                   value={params.sample_rate}
// // // //                   onChange={(e) => setParams({...params, sample_rate: parseInt(e.target.value)})}
// // // //                   className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                 />
// // // //               </div>

// // // //               {params.limit !== undefined && (
// // // //                 <div className="mb-4">
// // // //                   <label className="block text-sm font-medium text-gray-300 mb-2">
// // // //                     Frame Limit
// // // //                   </label>
// // // //                   <input
// // // //                     type="number"
// // // //                     min="10"
// // // //                     max="1000"
// // // //                     value={params.limit}
// // // //                     onChange={(e) => setParams({...params, limit: parseInt(e.target.value)})}
// // // //                     className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                   />
// // // //                 </div>
// // // //               )}

// // // //               <button
// // // //                 onClick={runAnalysis}
// // // //                 disabled={loading || !selectedVideo}
// // // //                 className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
// // // //               >
// // // //                 {loading ? 'Processing...' : `Run ${title}`}
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Results Panel */}
// // // //           <div className="lg:col-span-2">
// // // //             {result ? renderResult(result) : (
// // // //               <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-96">
// // // //                 <div className="text-center">
// // // //                   <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // // //                   <p className="text-gray-400">
// // // //                     Select a video and click "Run {title}" to see results
// // // //                   </p>
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Graph Analysis Component
// // // // function GraphAnalysis({ navigate }) {
// // // //   const renderResult = (result) => (
// // // //     <div className="bg-gray-800 rounded-lg p-6">
// // // //       <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
      
// // // //       {result.graph?.image && (
// // // //         <div className="mb-6">
// // // //           <img
// // // //             src={result.graph.image.url}
// // // //             alt="Object count chart"
// // // //             className="w-full rounded-lg"
// // // //           />
// // // //           <div className="mt-2 flex justify-end">
// // // //             <a
// // // //               href={result.graph.image.url}
// // // //               download
// // // //               className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
// // // //             >
// // // //               <Download className="h-4 w-4 mr-1" />
// // // //               Download Chart
// // // //             </a>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {result.graph?.countsByFrame && (
// // // //         <div className="overflow-x-auto">
// // // //           <h3 className="text-lg font-medium text-white mb-2">Frame-by-Frame Counts</h3>
// // // //           <div className="max-h-64 overflow-y-auto">
// // // //             <table className="w-full text-sm">
// // // //               <thead className="bg-gray-700 sticky top-0">
// // // //                 <tr>
// // // //                   <th className="px-3 py-2 text-left text-gray-300">Frame</th>
// // // //                   {Object.keys(result.graph.countsByFrame[0]?.counts || {}).map(cls => (
// // // //                     <th key={cls} className="px-3 py-2 text-left text-gray-300 capitalize">
// // // //                       {cls}
// // // //                     </th>
// // // //                   ))}
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {result.graph.countsByFrame.slice(0, 50).map((frame, idx) => (
// // // //                   <tr key={idx} className="border-b border-gray-700">
// // // //                     <td className="px-3 py-2 text-gray-300">{frame.frame}</td>
// // // //                     {Object.keys(frame.counts).map(cls => (
// // // //                       <td key={cls} className="px-3 py-2 text-white">
// // // //                         {frame.counts[cls] || 0}
// // // //                       </td>
// // // //                     ))}
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <FeatureAnalysis
// // // //       title="Graph Analysis"
// // // //       icon={BarChart3}
// // // //       endpoint="graph"
// // // //       navigate={navigate}
// // // //       renderResult={renderResult}
// // // //       defaultParams={{
// // // //         classes: [],
// // // //         conf: 0.5,
// // // //         nms: 0.4,
// // // //         sample_rate: 1,
// // // //         limit: 200
// // // //       }}
// // // //     />
// // // //   );
// // // // }

// // // // // Unique Counts Component
// // // // function UniqueCounts({ navigate }) {
// // // //   const renderResult = (result) => (
// // // //     <div className="bg-gray-800 rounded-lg p-6">
// // // //       <h2 className="text-xl font-semibold text-white mb-4">Unique Object Counts</h2>
      
// // // //       {result.uniqueCounts && (
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // // //           {Object.entries(result.uniqueCounts).map(([className, count]) => (
// // // //             <div key={className} className="bg-gray-700 rounded-lg p-4 text-center">
// // // //               <h3 className="text-lg font-semibold text-white capitalize mb-2">
// // // //                 {className}
// // // //               </h3>
// // // //               <p className="text-3xl font-bold text-blue-400">{count}</p>
// // // //               <p className="text-sm text-gray-400">unique instances</p>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       )}

// // // //       {result.history && (
// // // //         <div className="mt-6 text-sm text-gray-400">
// // // //           <p>Analysis completed at: {new Date(result.history.createdAt).toLocaleString()}</p>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <FeatureAnalysis
// // // //       title="Unique Counts"
// // // //       icon={Hash}
// // // //       endpoint="unique"
// // // //       navigate={navigate}
// // // //       renderResult={renderResult}
// // // //       defaultParams={{
// // // //         classes: [],
// // // //         conf: 0.5,
// // // //         nms: 0.4,
// // // //         sample_rate: 1
// // // //       }}
// // // //     />
// // // //   );
// // // // }

// // // // // BBox Video Component
// // // // function BBoxVideo({ navigate }) {
// // // //   const renderResult = (result) => (
// // // //     <div className="bg-gray-800 rounded-lg p-6">
// // // //       <h2 className="text-xl font-semibold text-white mb-4">Bounding Box Video</h2>
      
// // // //       {result.overlayVideo && (
// // // //         <div>
// // // //           <video
// // // //             controls
// // // //             className="w-full rounded-lg mb-4"
// // // //             poster={result.overlayVideo.url?.replace('.mp4', '.jpg')}
// // // //           >
// // // //             <source src={result.overlayVideo.url} type="video/mp4" />
// // // //             Your browser does not support the video tag.
// // // //           </video>
          
// // // //           <div className="flex justify-between items-center text-sm text-gray-400">
// // // //             <div>
// // // //               <p>{result.overlayVideo.width}×{result.overlayVideo.height}</p>
// // // //               <p>{(result.overlayVideo.bytes / 1024 / 1024).toFixed(1)} MB</p>
// // // //             </div>
// // // //             <a
// // // //               href={result.overlayVideo.url}
// // // //               download
// // // //               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
// // // //             >
// // // //               <Download className="h-4 w-4 mr-2" />
// // // //               Download Video
// // // //             </a>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {result.history && (
// // // //         <div className="mt-6 text-sm text-gray-400">
// // // //           <p>Video processed at: {new Date(result.history.createdAt).toLocaleString()}</p>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <FeatureAnalysis
// // // //       title="BBox Video"
// // // //       icon={Video}
// // // //       endpoint="bbox"
// // // //       navigate={navigate}
// // // //       renderResult={renderResult}
// // // //       defaultParams={{
// // // //         classes: [],
// // // //         conf: 0.5,
// // // //         nms: 0.4,
// // // //         sample_rate: 1
// // // //       }}
// // // //     />
// // // //   );
// // // // }

// // // // // Feature History Component
// // // // function FeatureHistory({ navigate }) {
// // // //   const [histories, setHistories] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState('');
// // // //   const [filterType, setFilterType] = useState('');

// // // //   useEffect(() => {
// // // //     loadHistories();
// // // //   }, [filterType]);

// // // //   const loadHistories = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const query = filterType ? `?type=${filterType}` : '';
// // // //       const response = await api(`/api/features/history${query}`);
// // // //       setHistories(response.items || []);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const getHistoryIcon = (type) => {
// // // //     switch (type) {
// // // //       case 'graph': return BarChart3;
// // // //       case 'unique': return Hash;
// // // //       case 'bbox': return Video;
// // // //       default: return History;
// // // //     }
// // // //   };

// // // //   const getHistoryColor = (type) => {
// // // //     switch (type) {
// // // //       case 'graph': return 'bg-green-600';
// // // //       case 'unique': return 'bg-purple-600';
// // // //       case 'bbox': return 'bg-orange-600';
// // // //       default: return 'bg-gray-600';
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
// // // //       <div className="px-4 py-6 sm:px-0">
// // // //         <div className="flex justify-between items-center mb-6">
// // // //           <h1 className="text-3xl font-bold text-white">Feature History</h1>
          
// // // //           <select
// // // //             value={filterType}
// // // //             onChange={(e) => setFilterType(e.target.value)}
// // // //             className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //           >
// // // //             <option value="">All Types</option>
// // // //             <option value="graph">Graph Analysis</option>
// // // //             <option value="unique">Unique Counts</option>
// // // //             <option value="bbox">BBox Video</option>
// // // //           </select>
// // // //         </div>

// // // //         {error && (
// // // //           <div className="bg-red-500 text-white p-3 rounded-md mb-6">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         {loading ? (
// // // //           <div className="flex justify-center py-12">
// // // //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
// // // //           </div>
// // // //         ) : histories.length === 0 ? (
// // // //           <div className="text-center py-12 bg-gray-800 rounded-lg">
// // // //             <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // // //             <h3 className="text-lg font-medium text-white mb-2">No analysis history found</h3>
// // // //             <p className="text-gray-400">Run some analyses to see results here</p>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="space-y-4">
// // // //             {histories.map((history) => {
// // // //               const IconComponent = getHistoryIcon(history.type);
// // // //               const colorClass = getHistoryColor(history.type);
              
// // // //               return (
// // // //                 <div key={history._id} className="bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
// // // //                   <div className={`${colorClass} p-3 rounded-full`}>
// // // //                     <IconComponent className="h-6 w-6 text-white" />
// // // //                   </div>
                  
// // // //                   <div className="flex-1">
// // // //                     <div className="flex justify-between items-start">
// // // //                       <div>
// // // //                         <h3 className="text-lg font-semibold text-white capitalize">
// // // //                           {history.type} Analysis
// // // //                         </h3>
// // // //                         <p className="text-gray-400 text-sm">
// // // //                           {new Date(history.createdAt).toLocaleString()}
// // // //                         </p>
// // // //                         {history.inputParams?.classes?.length > 0 && (
// // // //                           <p className="text-gray-300 text-sm mt-1">
// // // //                             Classes: {history.inputParams.classes.join(', ')}
// // // //                           </p>
// // // //                         )}
// // // //                       </div>
                      
// // // //                       <div className="flex space-x-2">
// // // //                         <button
// // // //                           onClick={() => navigate(`/${history.type}?video=${history.video}`)}
// // // //                           className="text-blue-400 hover:text-blue-300 p-2"
// // // //                           title="View"
// // // //                         >
// // // //                           <Eye className="h-4 w-4" />
// // // //                         </button>
                        
// // // //                         {(history.artifacts?.length > 0 || history.overlayVideo) && (
// // // //                           <button
// // // //                             onClick={() => {
// // // //                               const url = history.overlayVideo?.url || history.artifacts?.[0]?.url;
// // // //                               if (url) window.open(url, '_blank');
// // // //                             }}
// // // //                             className="text-green-400 hover:text-green-300 p-2"
// // // //                             title="Download"
// // // //                           >
// // // //                             <Download className="h-4 w-4" />
// // // //                           </button>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               );
// // // //             })}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Profile Component
// // // // function Profile({ navigate }) {
// // // //   const { user, updateUser } = useAuth();
// // // //   const [editing, setEditing] = useState(false);
// // // //   const [formData, setFormData] = useState({
// // // //     username: user?.username || '',
// // // //     email: user?.email || '',
// // // //     fullName: user?.fullName || '',
// // // //   });
// // // //   const [avatar, setAvatar] = useState(null);
// // // //   const [passwordData, setPasswordData] = useState({
// // // //     oldPassword: '',
// // // //     newPassword: '',
// // // //     confirmPassword: '',
// // // //   });
// // // //   const [showPasswordForm, setShowPasswordForm] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState('');
// // // //   const [success, setSuccess] = useState('');

// // // //   const handleUpdateProfile = async (e) => {
// // // //     e.preventDefault();
// // // //     setLoading(true);
// // // //     setError('');
// // // //     setSuccess('');

// // // //     try {
// // // //       const response = await api('/api/users/update-account', {
// // // //         method: 'PATCH',
// // // //         body: JSON.stringify(formData),
// // // //       });
// // // //       updateUser(response.user);
// // // //       setSuccess('Profile updated successfully');
// // // //       setEditing(false);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleUpdateAvatar = async () => {
// // // //     if (!avatar) return;

// // // //     setLoading(true);
// // // //     setError('');

// // // //     try {
// // // //       const fd = new FormData();
// // // //       fd.append('avatar', avatar);
// // // //       const response = await uploadFile('/api/users/avatar', fd);
// // // //       updateUser({ ...user, avatar: response.avatar });
// // // //       setSuccess('Avatar updated successfully');
// // // //       setAvatar(null);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleChangePassword = async (e) => {
// // // //     e.preventDefault();
// // // //     if (passwordData.newPassword !== passwordData.confirmPassword) {
// // // //       setError('Passwords do not match');
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setError('');

// // // //     try {
// // // //       await api('/api/users/change-password', {
// // // //         method: 'POST',
// // // //         body: JSON.stringify({
// // // //           oldPassword: passwordData.oldPassword,
// // // //           newPassword: passwordData.newPassword,
// // // //         }),
// // // //       });
// // // //       setSuccess('Password changed successfully');
// // // //       setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
// // // //       setShowPasswordForm(false);
// // // //     } catch (error) {
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
// // // //       <div className="px-4 py-6 sm:px-0">
// // // //         <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>

// // // //         {error && (
// // // //           <div className="bg-red-500 text-white p-3 rounded-md mb-6">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         {success && (
// // // //           <div className="bg-green-500 text-white p-3 rounded-md mb-6">
// // // //             {success}
// // // //           </div>
// // // //         )}

// // // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // // //           {/* Profile Info */}
// // // //           <div className="lg:col-span-2">
// // // //             <div className="bg-gray-800 rounded-lg p-6">
// // // //               <div className="flex justify-between items-center mb-4">
// // // //                 <h2 className="text-xl font-semibold text-white">Profile Information</h2>
// // // //                 <button
// // // //                   onClick={() => setEditing(!editing)}
// // // //                   className="text-blue-400 hover:text-blue-300"
// // // //                 >
// // // //                   <Settings className="h-5 w-5" />
// // // //                 </button>
// // // //               </div>

// // // //               {editing ? (
// // // //                 <form onSubmit={handleUpdateProfile} className="space-y-4">
// // // //                   <div>
// // // //                     <label className="block text-sm font-medium text-gray-300 mb-1">
// // // //                       Username
// // // //                     </label>
// // // //                     <input
// // // //                       type="text"
// // // //                       value={formData.username}
// // // //                       onChange={(e) => setFormData({...formData, username: e.target.value})}
// // // //                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                     />
// // // //                   </div>
                  
// // // //                   <div>
// // // //                     <label className="block text-sm font-medium text-gray-300 mb-1">
// // // //                       Email
// // // //                     </label>
// // // //                     <input
// // // //                       type="email"
// // // //                       value={formData.email}
// // // //                       onChange={(e) => setFormData({...formData, email: e.target.value})}
// // // //                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                     />
// // // //                   </div>
                  
// // // //                   <div>
// // // //                     <label className="block text-sm font-medium text-gray-300 mb-1">
// // // //                       Full Name
// // // //                     </label>
// // // //                     <input
// // // //                       type="text"
// // // //                       value={formData.fullName}
// // // //                       onChange={(e) => setFormData({...formData, fullName: e.target.value})}
// // // //                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                     />
// // // //                   </div>

// // // //                   <div className="flex space-x-3">
// // // //                     <button
// // // //                       type="submit"
// // // //                       disabled={loading}
// // // //                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
// // // //                     >
// // // //                       Save Changes
// // // //                     </button>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={() => setEditing(false)}
// // // //                       className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
// // // //                     >
// // // //                       Cancel
// // // //                     </button>
// // // //                   </div>
// // // //                 </form>
// // // //               ) : (
// // // //                 <div className="space-y-4">
// // // //                   <div>
// // // //                     <label className="block text-sm font-medium text-gray-400">Username</label>
// // // //                     <p className="text-white">{user?.username}</p>
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className="block text-sm font-medium text-gray-400">Email</label>
// // // //                     <p className="text-white">{user?.email}</p>
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className="block text-sm font-medium text-gray-400">Full Name</label>
// // // //                     <p className="text-white">{user?.fullName || 'Not set'}</p>
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               {/* Password Change */}
// // // //               <div className="mt-8 pt-6 border-t border-gray-700">
// // // //                 <button
// // // //                   onClick={() => setShowPasswordForm(!showPasswordForm)}
// // // //                   className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
// // // //                 >
// // // //                   <Lock className="h-4 w-4 mr-2" />
// // // //                   Change Password
// // // //                 </button>

// // // //                 {showPasswordForm && (
// // // //                   <form onSubmit={handleChangePassword} className="space-y-4">
// // // //                     <input
// // // //                       type="password"
// // // //                       placeholder="Current Password"
// // // //                       value={passwordData.oldPassword}
// // // //                       onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
// // // //                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                       required
// // // //                     />
// // // //                     <input
// // // //                       type="password"
// // // //                       placeholder="New Password"
// // // //                       value={passwordData.newPassword}
// // // //                       onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
// // // //                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                       required
// // // //                     />
// // // //                     <input
// // // //                       type="password"
// // // //                       placeholder="Confirm New Password"
// // // //                       value={passwordData.confirmPassword}
// // // //                       onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
// // // //                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // // //                       required
// // // //                     />
// // // //                     <div className="flex space-x-3">
// // // //                       <button
// // // //                         type="submit"
// // // //                         disabled={loading}
// // // //                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
// // // //                       >
// // // //                         Change Password
// // // //                       </button>
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={() => setShowPasswordForm(false)}
// // // //                         className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
// // // //                       >
// // // //                         Cancel
// // // //                       </button>
// // // //                     </div>
// // // //                   </form>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Avatar */}
// // // //           <div>
// // // //             <div className="bg-gray-800 rounded-lg p-6">
// // // //               <h2 className="text-xl font-semibold text-white mb-4">Avatar</h2>
              
// // // //               <div className="text-center">
// // // //                 <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-gray-700 mb-4">
// // // //                   {user?.avatar?.url ? (
// // // //                     <img
// // // //                       src={user.avatar.url}
// // // //                       alt="Avatar"
// // // //                       className="h-full w-full object-cover"
// // // //                     />
// // // //                   ) : (
// // // //                     <div className="h-full w-full flex items-center justify-center">
// // // //                       <User className="h-12 w-12 text-gray-400" />
// // // //                     </div>
// // // //                   )}
// // // //                 </div>

// // // //                 <input
// // // //                   type="file"
// // // //                   accept="image/*"
// // // //                   onChange={(e) => setAvatar(e.target.files[0])}
// // // //                   className="hidden"
// // // //                   id="avatar-upload"
// // // //                 />
// // // //                 <label
// // // //                   htmlFor="avatar-upload"
// // // //                   className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block mb-2"
// // // //                 >
// // // //                   Choose New Avatar
// // // //                 </label>

// // // //                 {avatar && (
// // // //                   <div className="mt-4">
// // // //                     <p className="text-gray-300 text-sm mb-2">{avatar.name}</p>
// // // //                     <button
// // // //                       onClick={handleUpdateAvatar}
// // // //                       disabled={loading}
// // // //                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-full"
// // // //                     >
// // // //                       Upload Avatar
// // // //                     </button>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Main App Component
// // // // function App() {
// // // //   return (
// // // //     <AuthProvider>
// // // //       <Router />
// // // //     </AuthProvider>
// // // //   );
// // // // }

// // // // export default App;
// // // import React, { useState, useEffect, createContext, useContext } from "react";
// // // import {
// // //   Camera,
// // //   Upload as UploadIcon,
// // //   BarChart3,
// // //   Hash,
// // //   Video as VideoIcon,
// // //   History as HistoryIcon,
// // //   User as UserIcon,
// // //   LogOut,
// // //   Menu,
// // //   X,
// // //   Play,
// // //   Download,
// // //   Trash2,
// // //   Eye,
// // //   Settings,
// // //   Lock,
// // // } from "lucide-react";

// // // /***************************
// // //  * API CONFIG & HELPERS
// // //  ***************************/
// // // const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// // // async function api(path, init) {
// // //   const res = await fetch(`${API_BASE}${path}`, {
// // //     ...init,
// // //     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
// // //     credentials: "include",
// // //   });
// // //   const json = await res.json().catch(() => ({}));
// // //   if (!res.ok || json?.success === false) {
// // //     throw new Error(json?.message || `HTTP ${res.status}`);
// // //   }
// // //   return json?.data ?? json;
// // // }

// // // async function uploadFile(path, formData) {
// // //   const res = await fetch(`${API_BASE}${path}`, {
// // //     method: "POST",
// // //     body: formData,
// // //     credentials: "include",
// // //   });
// // //   const json = await res.json().catch(() => ({}));
// // //   if (!res.ok || json?.success === false) {
// // //     throw new Error(json?.message || `HTTP ${res.status}`);
// // //   }
// // //   return json?.data ?? json;
// // // }

// // // /***************************
// // //  * AUTH CONTEXT
// // //  ***************************/
// // // const AuthContext = createContext(null);

// // // function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     checkAuth();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   const checkAuth = async () => {
// // //     try {
// // //       const userData = await api("/api/users/current-user");
// // //       setUser(userData.user);
// // //     } catch (err) {
// // //       setUser(null);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const login = async (email, password) => {
// // //     const response = await api("/api/users/login", {
// // //       method: "POST",
// // //       body: JSON.stringify({ email, password }),
// // //     });
// // //     setUser(response.user);
// // //     return response;
// // //   };

// // //   const register = async (formData) => {
// // //     const response = await uploadFile("/api/users/register", formData);
// // //     setUser(response.user);
// // //     return response;
// // //   };

// // //   const logout = async () => {
// // //     await api("/api/users/logout", { method: "POST" });
// // //     setUser(null);
// // //   };

// // //   const updateUser = (userData) => setUser(userData);

// // //   return (
// // //     <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser, checkAuth }}>
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // }

// // // function useAuth() {
// // //   const ctx = useContext(AuthContext);
// // //   if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
// // //   return ctx;
// // // }

// // // /***************************
// // //  * SIMPLE CLIENT-SIDE ROUTER
// // //  ***************************/
// // // function Router() {
// // //   const [currentRoute, setCurrentRoute] = useState(window.location.pathname + window.location.search);
// // //   const { user, loading } = useAuth();

// // //   useEffect(() => {
// // //     const handlePopState = () => setCurrentRoute(window.location.pathname + window.location.search);
// // //     window.addEventListener("popstate", handlePopState);
// // //     return () => window.removeEventListener("popstate", handlePopState);
// // //   }, []);

// // //   const navigate = (path) => {
// // //     if (path === currentRoute) return;
// // //     window.history.pushState({}, "", path);
// // //     setCurrentRoute(path);
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-900">
// // //         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
// // //       </div>
// // //     );
// // //   }

// // //   const authFreeRoutes = ["/login", "/register"]; 
// // //   const pathOnly = currentRoute.split("?")[0];

// // //   if (!user && !authFreeRoutes.includes(pathOnly)) {
// // //     return <Login navigate={navigate} />;
// // //   }

// // //   if (user && authFreeRoutes.includes(pathOnly)) {
// // //     navigate("/dashboard");
// // //   }

// // //   const routes = {
// // //     "/dashboard": <Dashboard navigate={navigate} />,
// // //     "/upload": <UploadPage navigate={navigate} />,
// // //     "/graph": <GraphAnalysis navigate={navigate} />,
// // //     "/unique": <UniqueCounts navigate={navigate} />,
// // //     "/bbox": <BBoxVideo navigate={navigate} />,
// // //     "/history": <FeatureHistory navigate={navigate} />,
// // //     "/profile": <Profile navigate={navigate} />,
// // //     "/login": <Login navigate={navigate} />,
// // //     "/register": <Register navigate={navigate} />,
// // //   };

// // //   const Component = routes[pathOnly] || <Dashboard navigate={navigate} />;

// // //   if (!user) return Component; // show auth pages w/o navbar

// // //   return (
// // //     <div className="min-h-screen bg-gray-900">
// // //       <Navbar navigate={navigate} />
// // //       <main className="pt-16">{Component}</main>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * NAVBAR
// // //  ***************************/
// // // function Navbar({ navigate }) {
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const { user, logout } = useAuth();

// // //   const navItems = [
// // //     { path: "/dashboard", icon: Camera, label: "Dashboard" },
// // //     { path: "/upload", icon: UploadIcon, label: "Upload" },
// // //     { path: "/graph", icon: BarChart3, label: "Graph" },
// // //     { path: "/unique", icon: Hash, label: "Unique" },
// // //     { path: "/bbox", icon: VideoIcon, label: "BBox" },
// // //     { path: "/history", icon: HistoryIcon, label: "History" },
// // //   ];

// // //   const handleLogout = async () => {
// // //     try {
// // //       await logout();
// // //       navigate("/login");
// // //     } catch (err) {
// // //       console.error("Logout failed:", err);
// // //     }
// // //   };

// // //   return (
// // //     <nav className="fixed top-0 w-full bg-gray-800 shadow-lg z-50">
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //         <div className="flex justify-between h-16">
// // //           <div className="flex items-center">
// // //             <Camera className="h-7 w-7 text-blue-500 mr-2" />
// // //             <span className="text-lg font-bold text-white">Object Counter</span>
// // //           </div>

// // //           {/* Desktop nav */}
// // //           <div className="hidden md:flex items-center space-x-2">
// // //             {navItems.map(({ path, icon: Icon, label }) => (
// // //               <button
// // //                 key={path}
// // //                 onClick={() => navigate(path)}
// // //                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
// // //               >
// // //                 <Icon className="h-4 w-4 mr-1" />
// // //                 {label}
// // //               </button>
// // //             ))}
// // //             <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-600">
// // //               <button
// // //                 onClick={() => navigate("/profile")}
// // //                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
// // //               >
// // //                 <UserIcon className="h-4 w-4 mr-1" />
// // //                 {user?.username}
// // //               </button>
// // //               <button
// // //                 onClick={handleLogout}
// // //                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white"
// // //               >
// // //                 <LogOut className="h-4 w-4" />
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Mobile menu button */}
// // //           <div className="md:hidden flex items-center">
// // //             <button onClick={() => setIsOpen((v) => !v)} className="text-gray-400 hover:text-white p-2">
// // //               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Mobile drawer */}
// // //         {isOpen && (
// // //           <div className="md:hidden">
// // //             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
// // //               {navItems.map(({ path, icon: Icon, label }) => (
// // //                 <button
// // //                   key={path}
// // //                   onClick={() => {
// // //                     navigate(path);
// // //                     setIsOpen(false);
// // //                   }}
// // //                   className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white w-full text-left"
// // //                 >
// // //                   <Icon className="h-5 w-5 mr-2" />
// // //                   {label}
// // //                 </button>
// // //               ))}
// // //               <div className="border-t border-gray-600 pt-2 mt-2">
// // //                 <button
// // //                   onClick={() => {
// // //                     navigate("/profile");
// // //                     setIsOpen(false);
// // //                   }}
// // //                   className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white w-full text-left"
// // //                 >
// // //                   <UserIcon className="h-5 w-5 mr-2" />
// // //                   Profile
// // //                 </button>
// // //                 <button
// // //                   onClick={handleLogout}
// // //                   className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-600 hover:text-white w-full text-left"
// // //                 >
// // //                   <LogOut className="h-5 w-5 mr-2" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </nav>
// // //   );
// // // }

// // // /***************************
// // //  * LOGIN
// // //  ***************************/
// // // function Login({ navigate }) {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [error, setError] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const { login } = useAuth();

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setLoading(true);
// // //     try {
// // //       await login(email, password);
// // //       navigate("/dashboard");
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
// // //       <div className="max-w-md w-full space-y-8">
// // //         <div>
// // //           <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-500">
// // //             <Camera className="h-8 w-8 text-white" />
// // //           </div>
// // //           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign in</h2>
// // //         </div>
// // //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// // //           {error && <div className="bg-red-500 text-white p-3 rounded-md text-sm">{error}</div>}
// // //           <div className="space-y-4">
// // //             <input
// // //               type="email"
// // //               required
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               className="block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //               placeholder="Email address"
// // //             />
// // //             <input
// // //               type="password"
// // //               required
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               className="block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //               placeholder="Password"
// // //             />
// // //           </div>
// // //           <button
// // //             type="submit"
// // //             disabled={loading}
// // //             className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
// // //           >
// // //             {loading ? "Signing in..." : "Sign in"}
// // //           </button>
// // //           <div className="text-center">
// // //             <button type="button" onClick={() => navigate("/register")} className="text-blue-400 hover:text-blue-300">
// // //               Don't have an account? Sign up
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * REGISTER
// // //  ***************************/
// // // function Register({ navigate }) {
// // //   const [formData, setFormData] = useState({ username: "", email: "", password: "", fullName: "" });
// // //   const [avatar, setAvatar] = useState(null);
// // //   const [error, setError] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const { register } = useAuth();

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setLoading(true);
// // //     try {
// // //       const fd = new FormData();
// // //       Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
// // //       if (avatar) fd.append("avatar", avatar);
// // //       await register(fd);
// // //       navigate("/dashboard");
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
// // //       <div className="max-w-md w-full space-y-8">
// // //         <div>
// // //           <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-500">
// // //             <Camera className="h-8 w-8 text-white" />
// // //           </div>
// // //           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create your account</h2>
// // //         </div>
// // //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// // //           {error && <div className="bg-red-500 text-white p-3 rounded-md text-sm">{error}</div>}
// // //           <div className="space-y-4">
// // //             <input
// // //               type="text"
// // //               required
// // //               value={formData.username}
// // //               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
// // //               className="block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //               placeholder="Username"
// // //             />
// // //             <input
// // //               type="email"
// // //               required
// // //               value={formData.email}
// // //               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // //               className="block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //               placeholder="Email address"
// // //             />
// // //             <input
// // //               type="text"
// // //               value={formData.fullName}
// // //               onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
// // //               className="block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //               placeholder="Full Name (optional)"
// // //             />
// // //             <input
// // //               type="password"
// // //               required
// // //               value={formData.password}
// // //               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// // //               className="block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// // //               placeholder="Password"
// // //             />
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-300 mb-2">Avatar (optional)</label>
// // //               <input
// // //                 type="file"
// // //                 accept="image/*"
// // //                 onChange={(e) => setAvatar(e.target.files?.[0] || null)}
// // //                 className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
// // //               />
// // //             </div>
// // //           </div>
// // //           <button type="submit" disabled={loading} className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
// // //             {loading ? "Creating account..." : "Sign up"}
// // //           </button>
// // //           <div className="text-center">
// // //             <button type="button" onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300">
// // //               Already have an account? Sign in
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * DASHBOARD + VIDEO CARD
// // //  ***************************/
// // // function Dashboard({ navigate }) {
// // //   const [videos, setVideos] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState("");

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         setLoading(true);
// // //         const response = await api("/api/videos");
// // //         setVideos(response.items || []);
// // //       } catch (err) {
// // //         setError(err.message);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, []);

// // //   const deleteVideo = async (videoId) => {
// // //     if (!window.confirm("Delete this video?")) return;
// // //     try {
// // //       await api(`/api/videos/${videoId}`, { method: "DELETE" });
// // //       setVideos((prev) => prev.filter((v) => v._id !== videoId));
// // //     } catch (err) {
// // //       setError(err.message);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
// // //       <div className="px-4 py-6 sm:px-0">
// // //         <div className="flex justify-between items-center mb-6">
// // //           <h1 className="text-3xl font-bold text-white">Dashboard</h1>
// // //           <button onClick={() => navigate("/upload")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
// // //             <UploadIcon className="h-4 w-4 mr-2" /> Upload Video
// // //           </button>
// // //         </div>

// // //         {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}

// // //         {loading ? (
// // //           <div className="flex justify-center py-12">
// // //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
// // //           </div>
// // //         ) : videos.length === 0 ? (
// // //           <div className="text-center py-12 bg-gray-800 rounded-lg">
// // //             <VideoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // //             <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
// // //             <p className="text-gray-400 mb-4">Upload your first video</p>
// // //             <button onClick={() => navigate("/upload")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
// // //               Upload Video
// // //             </button>
// // //           </div>
// // //         ) : (
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {videos.map((v) => (
// // //               <VideoCard key={v._id} video={v} onDelete={deleteVideo} navigate={navigate} />
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function VideoCard({ video, onDelete, navigate }) {
// // //   return (
// // //     <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
// // //       <div className="relative">
// // //         <video className="w-full h-48 object-cover" poster={video.url?.replace(".mp4", ".jpg")} muted>
// // //           <source src={video.url} type="video/mp4" />
// // //         </video>
// // //         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
// // //           <button onClick={() => window.open(video.url, "_blank")} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full mr-2">
// // //             <Play className="h-5 w-5" />
// // //           </button>
// // //         </div>
// // //       </div>
// // //       <div className="p-4">
// // //         <div className="flex justify-between items-start mb-2">
// // //           <div className="text-sm text-gray-400">{new Date(video.createdAt).toLocaleDateString()}</div>
// // //           <button onClick={() => onDelete(video._id)} className="text-red-400 hover:text-red-300">
// // //             <Trash2 className="h-4 w-4" />
// // //           </button>
// // //         </div>
// // //         <div className="text-xs text-gray-500 mb-4">
// // //           {video.width}×{video.height} • {((video.bytes || 0) / 1024 / 1024).toFixed(1)}MB
// // //         </div>
// // //         <div className="grid grid-cols-3 gap-2">
// // //           <button onClick={() => navigate(`/graph?video=${video._id}`)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center">
// // //             <BarChart3 className="h-3 w-3 mr-1" /> Graph
// // //           </button>
// // //           <button onClick={() => navigate(`/unique?video=${video._id}`)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center">
// // //             <Hash className="h-3 w-3 mr-1" /> Unique
// // //           </button>
// // //           <button onClick={() => navigate(`/bbox?video=${video._id}`)} className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center">
// // //             <VideoIcon className="h-3 w-3 mr-1" /> BBox
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * UPLOAD PAGE
// // //  ***************************/
// // // function UploadPage({ navigate }) {
// // //   const [file, setFile] = useState(null);
// // //   const [uploading, setUploading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [dragActive, setDragActive] = useState(false);

// // //   const handleDrag = (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
// // //     if (e.type === "dragleave") setDragActive(false);
// // //   };

// // //   const handleDrop = (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     setDragActive(false);
// // //     const f = e.dataTransfer.files?.[0];
// // //     if (!f) return;
// // //     if (!f.type.startsWith("video/")) return setError("Please select a video file");
// // //     setFile(f);
// // //   };

// // //   const handleFileChange = (e) => {
// // //     const f = e.target.files?.[0];
// // //     if (f) setFile(f);
// // //   };

// // //   const handleUpload = async () => {
// // //     if (!file) return;
// // //     setUploading(true);
// // //     setError("");
// // //     try {
// // //       const fd = new FormData();
// // //       fd.append("video", file);
// // //       await uploadFile("/api/videos", fd);
// // //       navigate("/dashboard");
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
// // //       <div className="px-4 py-6 sm:px-0">
// // //         <h1 className="text-3xl font-bold text-white mb-6">Upload Video</h1>
// // //         {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}
// // //         <div
// // //           className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}`}
// // //           onDragEnter={handleDrag}
// // //           onDragLeave={handleDrag}
// // //           onDragOver={handleDrag}
// // //           onDrop={handleDrop}
// // //         >
// // //           <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // //           {file ? (
// // //             <div className="space-y-4">
// // //               <p className="text-lg text-white">{file.name}</p>
// // //               <p className="text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
// // //               <div className="flex justify-center space-x-4">
// // //                 <button onClick={handleUpload} disabled={uploading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
// // //                   {uploading ? "Uploading..." : "Upload Video"}
// // //                 </button>
// // //                 <button onClick={() => setFile(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
// // //                   Cancel
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <div>
// // //               <p className="text-lg text-white mb-2">Drag and drop your video here, or click to select</p>
// // //               <p className="text-gray-400 mb-4">Supports MP4, AVI, MOV and more</p>
// // //               <input type="file" accept="video/*" onChange={handleFileChange} id="video-upload" className="hidden" />
// // //               <label htmlFor="video-upload" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer inline-block">
// // //                 Select Video
// // //               </label>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * FEATURE ANALYSIS BASE
// // //  ***************************/
// // // function FeatureAnalysis({ title, icon: Icon, endpoint, renderResult, defaultParams }) {
// // //   const [videos, setVideos] = useState([]);
// // //   const [selectedVideo, setSelectedVideo] = useState("");
// // //   const [params, setParams] = useState(defaultParams);
// // //   const [result, setResult] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const res = await api("/api/videos");
// // //         setVideos(res.items || []);
// // //       } catch (err) {
// // //         setError(err.message);
// // //       }
// // //     })();

// // //     const urlParams = new URLSearchParams(window.location.search);
// // //     const videoId = urlParams.get("video");
// // //     if (videoId) setSelectedVideo(videoId);
// // //   }, []);

// // //   const runAnalysis = async () => {
// // //     if (!selectedVideo) return setError("Please select a video");
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api(`/api/features/${endpoint}/run`, {
// // //         method: "POST",
// // //         body: JSON.stringify({ videoId: selectedVideo, ...params }),
// // //       });
// // //       setResult(res);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
// // //       <div className="px-4 py-6 sm:px-0">
// // //         <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
// // //           <Icon className="h-8 w-8 mr-3 text-blue-500" /> {title}
// // //         </h1>

// // //         {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}

// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //           {/* Config */}
// // //           <div className="lg:col-span-1">
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>

// // //               {/* Video select */}
// // //               <div className="mb-4">
// // //                 <label className="block text-sm font-medium text-gray-300 mb-2">Select Video</label>
// // //                 <select value={selectedVideo} onChange={(e) => setSelectedVideo(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
// // //                   <option value="">Choose a video...</option>
// // //                   {videos.map((v) => (
// // //                     <option key={v._id} value={v._id}>
// // //                       {v.original_filename || `Video ${v._id.slice(-6)}`}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               {/* Classes */}
// // //               <div className="mb-4">
// // //                 <label className="block text-sm font-medium text-gray-300 mb-2">Object Classes (comma-separated)</label>
// // //                 <input
// // //                   type="text"
// // //                   value={params.classes?.join(", ") || ""}
// // //                   onChange={(e) =>
// // //                     setParams({ ...params, classes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
// // //                   }
// // //                   placeholder="person, car, bicycle"
// // //                   className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
// // //                 />
// // //               </div>

// // //               {/* Conf */}
// // //               <div className="mb-4">
// // //                 <label className="block text-sm font-medium text-gray-300 mb-2">Confidence Threshold: {params.conf}</label>
// // //                 <input type="range" min="0.1" max="1" step="0.1" value={params.conf} onChange={(e) => setParams({ ...params, conf: parseFloat(e.target.value) })} className="w-full" />
// // //               </div>

// // //               {/* NMS */}
// // //               <div className="mb-4">
// // //                 <label className="block text-sm font-medium text-gray-300 mb-2">NMS Threshold: {params.nms}</label>
// // //                 <input type="range" min="0.1" max="1" step="0.1" value={params.nms} onChange={(e) => setParams({ ...params, nms: parseFloat(e.target.value) })} className="w-full" />
// // //               </div>

// // //               {/* Sample Rate */}
// // //               <div className="mb-4">
// // //                 <label className="block text-sm font-medium text-gray-300 mb-2">Sample Rate (every Nth frame)</label>
// // //                 <input type="number" min="1" max="10" value={params.sample_rate} onChange={(e) => setParams({ ...params, sample_rate: parseInt(e.target.value || "1", 10) })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
// // //               </div>

// // //               {typeof params.limit !== "undefined" && (
// // //                 <div className="mb-4">
// // //                   <label className="block text-sm font-medium text-gray-300 mb-2">Frame Limit</label>
// // //                   <input type="number" min="10" max="1000" value={params.limit} onChange={(e) => setParams({ ...params, limit: parseInt(e.target.value || "0", 10) })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
// // //                 </div>
// // //               )}

// // //               <button onClick={runAnalysis} disabled={loading || !selectedVideo} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
// // //                 {loading ? "Processing..." : `Run ${title}`}
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Results */}
// // //           <div className="lg:col-span-2">
// // //             {result ? (
// // //               renderResult(result)
// // //             ) : (
// // //               <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-96">
// // //                 <div className="text-center">
// // //                   <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // //                   <p className="text-gray-400">Select a video and run analysis to see results</p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * GRAPH ANALYSIS PAGE
// // //  ***************************/
// // // function GraphAnalysis() {
// // //   const renderResult = (result) => (
// // //     <div className="bg-gray-800 rounded-lg p-6">
// // //       <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
// // //       {result.graph?.image && (
// // //         <div className="mb-6">
// // //           <img src={result.graph.image.url} alt="Object count chart" className="w-full rounded-lg" />
// // //           <div className="mt-2 flex justify-end">
// // //             <a href={result.graph.image.url} download className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
// // //               <Download className="h-4 w-4 mr-1" /> Download Chart
// // //             </a>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {result.graph?.countsByFrame && (
// // //         <div className="overflow-x-auto">
// // //           <h3 className="text-lg font-medium text-white mb-2">Frame-by-Frame Counts</h3>
// // //           <div className="max-h-64 overflow-y-auto">
// // //             <table className="w-full text-sm">
// // //               <thead className="bg-gray-700 sticky top-0">
// // //                 <tr>
// // //                   <th className="px-3 py-2 text-left text-gray-300">Frame</th>
// // //                   {Object.keys(result.graph.countsByFrame[0]?.counts || {}).map((cls) => (
// // //                     <th key={cls} className="px-3 py-2 text-left text-gray-300 capitalize">{cls}</th>
// // //                   ))}
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {result.graph.countsByFrame.slice(0, 200).map((frame, idx) => (
// // //                   <tr key={idx} className="border-b border-gray-700">
// // //                     <td className="px-3 py-2 text-gray-300">{frame.frame}</td>
// // //                     {Object.keys(frame.counts).map((cls) => (
// // //                       <td key={cls} className="px-3 py-2 text-white">{frame.counts[cls] || 0}</td>
// // //                     ))}
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <FeatureAnalysis
// // //       title="Graph Analysis"
// // //       icon={BarChart3}
// // //       endpoint="graph"
// // //       renderResult={renderResult}
// // //       defaultParams={{ classes: [], conf: 0.5, nms: 0.4, sample_rate: 1, limit: 200 }}
// // //     />
// // //   );
// // // }

// // // /***************************
// // //  * UNIQUE COUNTS PAGE
// // //  ***************************/
// // // function UniqueCounts() {
// // //   const renderResult = (result) => (
// // //     <div className="bg-gray-800 rounded-lg p-6">
// // //       <h2 className="text-xl font-semibold text-white mb-4">Unique Object Counts</h2>
// // //       {result.uniqueCounts && (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // //           {Object.entries(result.uniqueCounts).map(([name, count]) => (
// // //             <div key={name} className="bg-gray-700 rounded-lg p-4 text-center">
// // //               <h3 className="text-lg font-semibold text-white capitalize mb-2">{name}</h3>
// // //               <p className="text-3xl font-bold text-blue-400">{count}</p>
// // //               <p className="text-sm text-gray-400">unique instances</p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //       {result.history && (
// // //         <div className="mt-6 text-sm text-gray-400">Completed at: {new Date(result.history.createdAt).toLocaleString()}</div>
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <FeatureAnalysis
// // //       title="Unique Counts"
// // //       icon={Hash}
// // //       endpoint="unique"
// // //       renderResult={renderResult}
// // //       defaultParams={{ classes: [], conf: 0.5, nms: 0.4, sample_rate: 1 }}
// // //     />
// // //   );
// // // }

// // // /***************************
// // //  * BBOX VIDEO PAGE
// // //  ***************************/
// // // function BBoxVideo() {
// // //   const renderResult = (result) => (
// // //     <div className="bg-gray-800 rounded-lg p-6">
// // //       <h2 className="text-xl font-semibold text-white mb-4">Bounding Box Video</h2>
// // //       {result.overlayVideo && (
// // //         <div>
// // //           <video controls className="w-full rounded-lg mb-4" poster={result.overlayVideo.url?.replace(".mp4", ".jpg")}>
// // //             <source src={result.overlayVideo.url} type="video/mp4" />
// // //           </video>
// // //           <div className="flex justify-between items-center text-sm text-gray-400">
// // //             <div>
// // //               <p>
// // //                 {result.overlayVideo.width}×{result.overlayVideo.height}
// // //               </p>
// // //               <p>{((result.overlayVideo.bytes || 0) / 1024 / 1024).toFixed(1)} MB</p>
// // //             </div>
// // //             <a href={result.overlayVideo.url} download className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
// // //               <Download className="h-4 w-4 mr-2" /> Download Video
// // //             </a>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {result.history && (
// // //         <div className="mt-6 text-sm text-gray-400">Processed at: {new Date(result.history.createdAt).toLocaleString()}</div>
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <FeatureAnalysis
// // //       title="BBox Video"
// // //       icon={VideoIcon}
// // //       endpoint="bbox"
// // //       renderResult={renderResult}
// // //       defaultParams={{ classes: [], conf: 0.5, nms: 0.4, sample_rate: 1 }}
// // //     />
// // //   );
// // // }

// // // /***************************
// // //  * FEATURE HISTORY PAGE
// // //  ***************************/
// // // function FeatureHistory({ navigate }) {
// // //   const [histories, setHistories] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState("");
// // //   const [filterType, setFilterType] = useState("");

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         setLoading(true);
// // //         const query = filterType ? `?type=${filterType}` : "";
// // //         const res = await api(`/api/features/history${query}`);
// // //         setHistories(res.items || []);
// // //       } catch (err) {
// // //         setError(err.message);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, [filterType]);

// // //   const iconFor = (type) => (type === "graph" ? BarChart3 : type === "unique" ? Hash : type === "bbox" ? VideoIcon : HistoryIcon);
// // //   const colorFor = (type) => (type === "graph" ? "bg-green-600" : type === "unique" ? "bg-purple-600" : type === "bbox" ? "bg-orange-600" : "bg-gray-600");

// // //   return (
// // //     <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
// // //       <div className="px-4 py-6 sm:px-0">
// // //         <div className="flex justify-between items-center mb-6">
// // //           <h1 className="text-3xl font-bold text-white">Feature History</h1>
// // //           <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
// // //             <option value="">All Types</option>
// // //             <option value="graph">Graph Analysis</option>
// // //             <option value="unique">Unique Counts</option>
// // //             <option value="bbox">BBox Video</option>
// // //           </select>
// // //         </div>

// // //         {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}

// // //         {loading ? (
// // //           <div className="flex justify-center py-12">
// // //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
// // //           </div>
// // //         ) : histories.length === 0 ? (
// // //           <div className="text-center py-12 bg-gray-800 rounded-lg">
// // //             <HistoryIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// // //             <h3 className="text-lg font-medium text-white mb-2">No analysis history</h3>
// // //             <p className="text-gray-400">Run some analyses to see results here</p>
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-4">
// // //             {histories.map((h) => {
// // //               const Icon = iconFor(h.type);
// // //               const color = colorFor(h.type);
// // //               return (
// // //                 <div key={h._id} className="bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
// // //                   <div className={`${color} p-3 rounded-full`}>
// // //                     <Icon className="h-6 w-6 text-white" />
// // //                   </div>
// // //                   <div className="flex-1">
// // //                     <div className="flex justify-between items-start">
// // //                       <div>
// // //                         <h3 className="text-lg font-semibold text-white capitalize">{h.type} Analysis</h3>
// // //                         <p className="text-gray-400 text-sm">{new Date(h.createdAt).toLocaleString()}</p>
// // //                         {h.inputParams?.classes?.length > 0 && (
// // //                           <p className="text-gray-300 text-sm mt-1">Classes: {h.inputParams.classes.join(", ")}</p>
// // //                         )}
// // //                       </div>
// // //                       <div className="flex space-x-2">
// // //                         <button onClick={() => navigate(`/${h.type}?video=${h.video}`)} className="text-blue-400 hover:text-blue-300 p-2" title="View">
// // //                           <Eye className="h-4 w-4" />
// // //                         </button>
// // //                         {(h.artifacts?.length > 0 || h.overlayVideo) && (
// // //                           <button
// // //                             onClick={() => {
// // //                               const url = h.overlayVideo?.url || h.artifacts?.[0]?.url;
// // //                               if (url) window.open(url, "_blank");
// // //                             }}
// // //                             className="text-green-400 hover:text-green-300 p-2"
// // //                             title="Open"
// // //                           >
// // //                             <Download className="h-4 w-4" />
// // //                           </button>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               );
// // //             })}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * PROFILE PAGE
// // //  ***************************/
// // // function Profile() {
// // //   const { user, updateUser } = useAuth();
// // //   const [editing, setEditing] = useState(false);
// // //   const [formData, setFormData] = useState({ username: user?.username || "", email: user?.email || "", fullName: user?.fullName || "" });
// // //   const [avatar, setAvatar] = useState(null);
// // //   const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
// // //   const [showPasswordForm, setShowPasswordForm] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");

// // //   const handleUpdateProfile = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       const res = await api("/api/users/update-account", { method: "PATCH", body: JSON.stringify(formData) });
// // //       updateUser(res.user);
// // //       setSuccess("Profile updated successfully");
// // //       setEditing(false);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleUpdateAvatar = async () => {
// // //     if (!avatar) return;
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const fd = new FormData();
// // //       fd.append("avatar", avatar);
// // //       const res = await uploadFile("/api/users/avatar", fd);
// // //       updateUser({ ...user, avatar: res.avatar });
// // //       setSuccess("Avatar updated successfully");
// // //       setAvatar(null);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleChangePassword = async (e) => {
// // //     e.preventDefault();
// // //     if (passwordData.newPassword !== passwordData.confirmPassword) return setError("Passwords do not match");
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       await api("/api/users/change-password", {
// // //         method: "POST",
// // //         body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword }),
// // //       });
// // //       setSuccess("Password changed successfully");
// // //       setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
// // //       setShowPasswordForm(false);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
// // //       <div className="px-4 py-6 sm:px-0">
// // //         <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
// // //         {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}
// // //         {success && <div className="bg-green-500 text-white p-3 rounded-md mb-6">{success}</div>}
// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //           {/* Profile Info */}
// // //           <div className="lg:col-span-2">
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-4">
// // //                 <h2 className="text-xl font-semibold text-white">Profile Information</h2>
// // //                 <button onClick={() => setEditing((v) => !v)} className="text-blue-400 hover:text-blue-300">
// // //                   <Settings className="h-5 w-5" />
// // //                 </button>
// // //               </div>
// // //               {editing ? (
// // //                 <form onSubmit={handleUpdateProfile} className="space-y-4">
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
// // //                     <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
// // //                     <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
// // //                     <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
// // //                   </div>
// // //                   <div className="flex space-x-3">
// // //                     <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">Save Changes</button>
// // //                     <button type="button" onClick={() => setEditing(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</button>
// // //                   </div>
// // //                 </form>
// // //               ) : (
// // //                 <div className="space-y-4">
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-400">Username</label>
// // //                     <p className="text-white">{user?.username}</p>
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-400">Email</label>
// // //                     <p className="text-white">{user?.email}</p>
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-400">Full Name</label>
// // //                     <p className="text-white">{user?.fullName || "Not set"}</p>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Password Change */}
// // //               <div className="mt-8 pt-6 border-t border-gray-700">
// // //                 <button onClick={() => setShowPasswordForm((v) => !v)} className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
// // //                   <Lock className="h-4 w-4 mr-2" /> Change Password
// // //                 </button>
// // //                 {showPasswordForm && (
// // //                   <form onSubmit={handleChangePassword} className="space-y-4">
// // //                     <input type="password" placeholder="Current Password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" required />
// // //                     <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" required />
// // //                     <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" required />
// // //                     <div className="flex space-x-3">
// // //                       <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">Change Password</button>
// // //                       <button type="button" onClick={() => setShowPasswordForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</button>
// // //                     </div>
// // //                   </form>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Avatar */}
// // //           <div>
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <h2 className="text-xl font-semibold text-white mb-4">Avatar</h2>
// // //               <div className="text-center">
// // //                 <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-gray-700 mb-4">
// // //                   {user?.avatar?.url ? (
// // //                     <img src={user.avatar.url} alt="Avatar" className="h-full w-full object-cover" />
// // //                   ) : (
// // //                     <div className="h-full w-full flex items-center justify-center">
// // //                       <UserIcon className="h-12 w-12 text-gray-400" />
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //                 <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} id="avatar-upload" className="hidden" />
// // //                 <label htmlFor="avatar-upload" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block mb-2">
// // //                   Choose New Avatar
// // //                 </label>
// // //                 {avatar && (
// // //                   <div className="mt-4">
// // //                     <p className="text-gray-300 text-sm mb-2">{avatar.name}</p>
// // //                     <button onClick={handleUpdateAvatar} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-full">
// // //                       Upload Avatar
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /***************************
// // //  * APP ROOT
// // //  ***************************/
// // // export default function App() {
// // //   return (
// // //     <AuthProvider>
// // //       <Router />
// // //     </AuthProvider>
// // //   );
// // // }
// // import AppRoutes from "./AppRoutes";
// // import NavBar from "./components/NavBar";

// // export default function App() {
// //   return (
// //     <div className="min-h-screen bg-zinc-900 text-zinc-200">
// //       <NavBar />
// //       <AppRoutes />
// //     </div>
// //   );
// // }

// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar.jsx";
// import Footer from "./components/Footer.jsx";
// import PageContainer from "./components/PageContainer.jsx";

// // pages
// import Home from "./pages/Home.jsx";
// import About from "./pages/About.jsx";
// import UploadVideo from "./pages/UploadVideo.jsx";
// import ProfilePage from "./pages/ProfilePage.jsx";
// import NotFound from "./pages/NotFound.jsx";
// // auth
// import Login from "./pages/auth/Login.jsx";
// import Register from "./pages/auth/Register.jsx";
// // bbox
// import BboxFeaturePage from "./pages/bbox/BboxFeaturePage.jsx";
// import BboxHistoryDetailPage from "./pages/bbox/BboxHistoryDetailPage.jsx";
// // graph
// import GraphFeaturePage from "./pages/graph/GraphFeaturePage.jsx";
// import GraphHistoryDetailPage from "./pages/graph/GraphHistoryDetailPage.jsx";
// // unique (placeholders if not yet built)
// import UniqueFeaturePage from "./pages/unique/UniqueFeaturePage.jsx";
// import UniqueHistoryDetailPage from "./pages/unique/UniqueHistoryDetailPage.jsx";

// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// export default function App() {
//   return (
//     <div className="min-h-screen flex flex-col bg-[rgb(250,250,250)]">
//       <Navbar />
//       <PageContainer>
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected */}
//           <Route element={<ProtectedRoute />}>
//             <Route path="/upload" element={<UploadVideo />} />
//             <Route path="/profile" element={<ProfilePage />} />

//             {/* Features */}
//             <Route path="/bbox" element={<BboxFeaturePage />} />
//             <Route path="/bbox/:id" element={<BboxHistoryDetailPage />} />

//             <Route path="/graph" element={<GraphFeaturePage />} />
//             <Route path="/graph/:id" element={<GraphHistoryDetailPage />} />

//             <Route path="/unique" element={<UniqueFeaturePage />} />
//             <Route path="/unique/:id" element={<UniqueHistoryDetailPage />} />
//           </Route>

//           {/* 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </PageContainer>
//       <Footer />
//     </div>
//   );
// }
import React from "react";

import AppRoutes from "./AppRoutes.jsx";
//import '../style/index.css'
// or wherever your Tailwind imports are
export default function App() {
  return <AppRoutes />;
}

