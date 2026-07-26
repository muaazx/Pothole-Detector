# 🛣️ Pothole Detector

<p align="center">
  <img src="https://img.shields.io/badge/Pothole%20Detector-Professional%20Road%20Safety%20Platform-ef4444?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Pothole Detector" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <b>A polished, community-driven pothole reporting and road safety platform built with a premium dark UI, live map intelligence, and an admin command center.</b>
</p>

<p align="center">
  <a href="https://pothole-detector-g61s.vercel.app">Live Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-features">Features</a> •
  <a href="#-setup">Setup</a>
</p>

---

## ✨ Overview

**Pothole Detector** is a modern road hazard reporting system designed to help citizens, engineers, and municipal teams identify, prioritize, and resolve potholes faster.

It combines a beautiful web experience with:
- a **real-time map-based reporting flow**
- **community voting** for hazard severity
- **news and facts** to raise awareness
- a **secure admin control panel**
- **backend services** for reports, users, and notifications

The interface uses a dramatic dark aesthetic with strong visual hierarchy, glassy surfaces, and vibrant accents to deliver a premium public-safety product feel.

---

## 🎯 Purpose

The goal of this project is to make road issue reporting:
- quick for citizens
- actionable for city workers
- transparent for the community
- visually engaging and easy to use

Instead of letting pothole reports disappear into a black hole, Pothole Detector turns them into a structured workflow with visible progress and accountability.

---

## 🌟 Key Features

### ����️ Live Telemetry Map
View active potholes on an interactive map with marker-based status and location context.

### ⚡ Frictionless Reporting
Submit a pothole report in just a few steps with location, photo proof, and classification.

### 🔥 Community Voting
Let users upvote hazards so high-impact issues naturally rise in priority.

### 🛡️ Admin Command Center
A secure admin experience for reviewing, triaging, and updating pothole reports.

### 📰 News & Alerts Feed
Surface local roadwork alerts, civic updates, and infrastructure-related news.

### 📚 Facts & Impact Pages
Educate users with verified insights on pothole damage, safety concerns, and urban infrastructure impact.

---

## 🎨 Beautiful UI Direction

This repo embraces a **premium “aggressive dark” design language**:

- deep black and charcoal surfaces
- vivid red accent color for urgency
- subtle glassmorphism borders
- smooth motion and page transitions
- modern typography
- highly readable information hierarchy

It feels like a **high-end civic-tech dashboard** rather than a plain reporting tool.

---

## 🎨 Tech Stack

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Lucide_Icons-111827?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Cron-8B5CF6?style=for-the-badge&logo=clockify&logoColor=white" alt="Cron" />
</p>

### Utilities & Integrations
<p align="left">
  <img src="https://img.shields.io/badge/CORS-0F172A?style=for-the-badge&logo=cloudflare&logoColor=white" alt="CORS" />
  <img src="https://img.shields.io/badge/Dotenv-8E44AD?style=for-the-badge&logo=dotenv&logoColor=white" alt="Dotenv" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Multer-22C55E?style=for-the-badge&logo=filezilla&logoColor=white" alt="Multer" />
  <img src="https://img.shields.io/badge/JSON%20Web%20Token-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## 🧩 Repository Structure

```text
Pothole-Detector/
├── Pothole-Detector-main/   # Frontend app and UI
├── Pothole Detector/        # PRD and supporting docs
├── backend/                 # Express API and server logic
└── PRD/                     # Product planning and design docs
```

---

## 🚀 Features in Detail

### 1) Citizen Reporting
- Drop a pin or use GPS-based location detection
- Add description and photo proof
- Submit road issues in a streamlined flow

### 2) Map Intelligence
- View potholes on a live map
- Cluster dense areas for readability
- Visualize severity with color-coded markers

### 3) Community Prioritization
- Upvote existing potholes
- Surface the most urgent hazards
- Improve repair prioritization through public signal

### 4) Admin Workflows
- Secure Firebase-authenticated admin access
- Review and manage reports
- Track road issue states from reported to repaired

### 5) Awareness Pages
- Facts page with verified pothole-related statistics
- Impact page showing public safety consequences
- News feed for local road and infrastructure updates

---

## 🛠️ Setup

### Frontend
```powershell
cd Pothole-Detector-main
npm install
npm run dev
```

### Backend
```powershell
cd backend
npm install
npm run dev
```

If your project structure differs locally, run the commands from the folder that contains the relevant `package.json`.

---

## 🔌 API Overview

Available backend routes include:
- `GET /health` — health check
- `GET /api/health` — API health check
- `GET /api/reports` — report-related routes
- `GET /api/news` — news and alerts routes
- `GET /api/users` — user-related routes

> Additional routes and handlers may exist inside the route modules.

---

## 🧠 Architecture Snapshot

### Frontend
- React + TypeScript
- Tailwind CSS styling
- Framer Motion transitions
- Leaflet-based map interface
- Google/Firebase-based authentication flow

### Backend
- Express + Node.js API
- Firebase admin integration
- PostgreSQL support
- cron-based news updates
- file/image handling with Multer and Cloudinary

---

## 📱 User Journey

1. Open the live map
2. Explore active pothole reports
3. Submit a new issue or upvote an existing one
4. Review facts and impact pages for awareness
5. Access the admin panel for triage and updates

---

## 🌍 Live Demo

Try it here:

**https://pothole-detector-g61s.vercel.app**

---

## ⚠️ Notes

- The admin panel is restricted to authorized admin accounts.
- The app is optimized for a premium, dark, high-contrast visual style.
- Some backend features may depend on environment variables and external services.

---

## 👥 Credits

Built with care for civic transparency, road safety, and community action.

---

<p align="center">
  <b>Pothole Detector — making roads safer through beautiful, actionable civic technology.</b>
</p>
