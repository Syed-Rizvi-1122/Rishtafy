# 💍 Rishtafy: Redefining Desi Muslim Matrimony

[![React](https://img.shields.io/badge/Frontend-React%20%26%20Vite-blue?logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js-green?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-emerald?logo=supabase)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Testing-Playwright%20E2E-orange?logo=playwright)](https://playwright.dev/)

**Rishtafy** is a modern, privacy-first Matrimony platform designed specifically for the Desi Muslim community. By blending traditional values with modern technology, Rishtafy ensures a safe, verified, and respectful environment for finding life partners.

---

## ✨ Core Pillars

### 🛡️ Privacy First (Photo Blurring)
Rishtafy prioritizes user comfort with CSS-based photo blurring. Candidates choose when and to whom they reveal their photos, maintaining modesty and control throughout the discovery phase.

### 👴 Guardian-Led Oversight
A unique **Guardian/Parent role** allows family members to participate actively. Guardians have their own dashboards to review profiles, manage requests, and facilitate introductions, ensuring cultural alignment and peace of mind.

### 👤 Verified Profiles
Trust is our foundation. Every profile goes through a verification process to ensure authenticity, reducing the risk of bad actors and focus on genuine intentions.

### 🤝 Seamless Match Lifecycle
From initial search to guardian approval and candidate acceptance, Rishtafy manages the entire lifecycle of a connection. Integrated real-time chat allows for safe communication once a match is accepted.

---

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS v4, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js |
| **Database/Auth** | Supabase (PostgreSQL, Auth, Storage) |
| **Testing** | Playwright (E2E), Jest & Supertest (API) |
| **Deployment** | Vercel |

---

## 🛠️ Project Structure

```text
├── frontend/             # React application (Vite + Tailwind v4)
│   ├── src/app/          # Core application logic & routes
│   ├── src/pages/        # Candidate, Guardian, & Admin pages
│   └── tests/e2e/        # Playwright end-to-end tests
├── backend/              # Express API
│   ├── src/              # API routes & Supabase integration
│   ├── tests/            # API integration tests
│   └── schema.sql        # Database schema for Supabase
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Account & Project

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file:
   ```env
   PORT=3001
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. `npm run dev`

---

## 🏗️ Agile Team & Workflow

Rishtafy is developed using a **Mandatory Golden Loop** workflow:

- **@scrum-master**: Orchestrates velocity and removes blockers.
- **@product-owner**: Manages the Notion Backlog and translates vision to stories.
- **@ui-ux-designer**: Reviews Figma designs for consistency and usability.
- **@developer**: Implements logic across the full stack.
- **@qa-tester**: Gatekeeper of quality through TDD and E2E verification.

*No feature is considered "Done" without verified passing tests from the QA Gate.*

---

## 🔒 Security & Privacy
- **Row Level Security (RLS):** Supabase policies ensure users only access data they are authorized to see.
- **Modesty Controls:** Profile photos are blurred by default and only revealed through explicit interaction or status changes.

---

© 2026 Rishtafy Team. All rights reserved.
