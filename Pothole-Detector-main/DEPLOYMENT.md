# 🚀 Deploying Pothole Radar to Vercel

This repository and backend are fully configured for **Vercel Deployment**.

---

## 1️⃣ Deploy Backend (Express Serverless API)

1. Go to your [Vercel Dashboard](https://vercel.com/new).
2. Import the `backend` folder repository (`Pothole Detector/backend`).
3. Set Framework Preset to **Other** (or Node.js).
4. Add the following **Environment Variables** in Vercel settings:
   - `DATABASE_URL`: Your PostgreSQL (Supabase/Neon/Railway) connection string.
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name
   - `CLOUDINARY_API_KEY`: Cloudinary API Key
   - `CLOUDINARY_API_SECRET`: Cloudinary API Secret
   - `FIREBASE_PROJECT_ID`: Firebase Project ID
   - `FIREBASE_CLIENT_EMAIL`: Firebase Admin Service Account Client Email
   - `FIREBASE_PRIVATE_KEY`: Firebase Admin Service Account Private Key
5. Click **Deploy**. Copy your deployed API URL (e.g. `https://pothole-backend.vercel.app`).

---

## 2️⃣ Deploy Frontend (React + Vite SPA)

1. Import the `Pothole-Detector-main` repository in Vercel.
2. Set Framework Preset to **Vite**.
3. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://pothole-backend.vercel.app/api` (your deployed backend API URL).
4. Click **Deploy**.

---

## 🛠️ Included Vercel Config Highlights:
- **Frontend SPA Rewrites (`vercel.json`)**: Configured to route all client-side navigation paths to `index.html`.
- **Backend Serverless Handler (`api/index.ts`)**: Built with `@vercel/node` to run Express as an automated serverless function.
- **Dynamic API Environment Binding (`src/lib/api.ts`)**: Supports `VITE_API_URL` and `VITE_API_BASE_URL` with localhost fallbacks.
