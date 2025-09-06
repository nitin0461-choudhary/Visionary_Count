# 🎥 Visionary Count

Visionary Count is a full-stack **MERN + Python** application that lets users upload videos, run AI-powered computer vision analysis, and explore results with bounding boxes, unique object counts, and frame-wise graphs.

---

## ✨ Features

- **Authentication**  
  - Register, Login, Logout (JWT-based with access + refresh tokens)  
  - Avatar upload with Multer + Cloudinary  
  - Profile management  

- **Video Management**  
  - Upload videos (stored on Cloudinary)  
  - Prevent duplicates with SHA-256 checksum:contentReference[oaicite:0]{index=0}  
  - View all uploaded videos  
  - Delete videos (preserves history references)  

- **Computer Vision Tools**  
  - **Unique Counts** → Count distinct objects per class in a video  
  - **BBox Explore** → Generate a video overlay with bounding boxes  
  - **Graph Analyzer** → Create per-frame object count charts  

- **History Tracking**  
  - Each feature run is saved in MongoDB with metadata  
  - Users can revisit results any time  

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- TailwindCSS
- Context API (Auth state)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Multer for file handling
- Cloudinary SDK:contentReference[oaicite:1]{index=1}

**Python (CV Pipelines)**
- YOLOv4 + OpenCV
- Matplotlib for graphs

---

## 📂 Project Structure

client/ # React frontend
├─ src/
│ ├─ pages/ # Home, About, Profile, Upload, Features
│ ├─ components # Navbar, Footer, ProtectedRoute
│ ├─ context/ # AuthContext
│ └─ api/ # Axios setup
├─ index.css # Tailwind entry
├─ vite.config.js
├─ postcss.config.js
└─ tailwind.config.js

server/ # Express backend
├─ routes/ # user.routes.js, video.routes.js, history routesuser.routes
├─ controllers/ # user, video, feature controllers
├─ models/ # Video, User, History schemas
├─ utils/ # ApiError, ApiResponse, asyncHandlerApiErrorApiResponseasyncHandler
└─ python/ # YOLO + analysis scripts

yaml
Copy code

---

## ⚡ Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/your-username/visionary-count.git
cd visionary-count
2. Install dependencies
Backend:

bash
Copy code
cd server
npm install
Frontend:

bash
Copy code
cd client
npm install
3. Configure environment
Create .env in server/:

env
Copy code
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
PYTHON_BIN=python3
4. Run
Start backend:

bash
Copy code
cd server
npm run dev
Start frontend:

bash
Copy code
cd client
npm run dev
🔐 Authentication API
POST /api/v1/users/register → Register new user

POST /api/v1/users/login → Login

GET /api/v1/users/current-user → Get logged-in useruser.routes

POST /api/v1/users/logout → Logout

🚀 Future Improvements
Add role-based access (admin vs user)

Support more CV models (YOLOv8, Detectron2)

Batch video processing

Export results as CSV/JSON

📜 License
MIT © 2025 Visionary Count
