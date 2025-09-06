// // import React from "react";
// // import ReactDOM from "react-dom/client";
// // import { BrowserRouter } from "react-router-dom";
// // import App from "./App.jsx";
// // import AuthProvider from "./context/AuthContext.jsx";
// // import "./styles.css";

// // ReactDOM.createRoot(document.getElementById("root")).render(
// //   <React.StrictMode>
// //     <BrowserRouter>
// //       <AuthProvider>
// //         <App />
// //       </AuthProvider>
// //     </BrowserRouter>
// //   </React.StrictMode>
// // );
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import "./styles.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./routes/App.jsx"; // or "./App.jsx" depending on your path
// import "./styles.css";              // keep using your current global css

// import { AuthProvider } from "./context/AuthContext.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './routes/App.jsx'
// import './index.css'
// import { AuthProvider } from './context/AuthContext.jsx'  // ✅ import your provider

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>   {/* ✅ wrap App with provider */}
//       <App />
//     </AuthProvider>
//   </React.StrictMode>,
// )
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App.jsx'
import './style/index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>    {/* ✅ Router added */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
