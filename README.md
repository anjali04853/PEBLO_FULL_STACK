# ✦ Peblo Notes — Collaborative AI Notes Workspace

A lightweight, full-stack, AI-powered notes workspace built for the **Peblo Full Stack Developer Challenge**.

Create and organise notes, generate AI summaries & action items, search and filter, share notes publicly, and track your productivity — all in one cohesive product.

> **Author:** Anjali Verma
> **Stack:** React (Vite) · Express · MongoDB · Google Gemini
> **Repository:** https://github.com/anjali04853/PEBLO_FULL_STACK

---

## ✨ Features

| # | Capability | What it does |
|---|------------|--------------|
| 1 | **Authentication** | JWT-based signup/login, bcrypt-hashed passwords, protected routes, persistent sessions. |
| 2 | **Notes Workspace** | Create / edit notes, **debounced auto-save**, tags + categories, archive/restore. |
| 3 | **AI Integration** | Generates a **summary**, extracts **action items**, and suggests a **title** from note content (Google Gemini, with a graceful offline fallback). |
| 4 | **Search & Filtering** | Live keyword search (MongoDB text index), filter by tag, sort by updated / created / title. |
| 5 | **Public Sharing** | One-click public share link; shared notes are readable without login at `/share/:shareId`. |
| 6 | **Productivity Insights** | Dashboard: total notes, recent notes, most-used tags, AI usage stats, and a 7-day activity chart. |

**Nice-to-haves included:** Markdown preview · optimistic UI updates · keyboard shortcuts (`Ctrl/Cmd+S`, `Ctrl/Cmd+E`) · dark mode · responsive layout · API rate limiting · seed script.

---

## 🏗️ Architecture

```
peblo/
├── backend/                  Express REST API
│   └── src/
│       ├── config/db.js          MongoDB connection
│       ├── models/               Mongoose schemas (User, Note, ActivityLog)
│       ├── middleware/           auth (JWT), error handling
│       ├── controllers/          request handlers per domain
│       ├── services/aiService.js Gemini integration + offline fallback
│       ├── routes/index.js       route table
│       ├── utils/                token signing, demo seed
│       └── server.js             app entrypoint
│
├── frontend/                 React + Vite SPA
│   └── src/
│       ├── api/client.js         typed fetch wrapper
│       ├── context/              Auth & Theme providers
│       ├── components/           Sidebar, NoteCard, AIPanel, ShareModal, Markdown…
│       ├── pages/                Login, Signup, NotesList, NoteEditor, Insights, SharedNote
│       └── hooks/                useDebouncedCallback (auto-save / search)
│
└── docs/                     Sample API responses & schema
```

### How the layers fit together

- **Routing** — `/` is a public marketing **landing page**; `/login` & `/signup` are public auth; `/share/:shareId` is the public note page; the authenticated workspace lives under `/app` (`/app`, `/app/archived`, `/app/insights`, `/app/notes/:id`).
- **Frontend ↔ Backend** — The React app talks to the API through a single `api/client.js` wrapper. In dev, Vite proxies `/api` to the Express server, so the same relative URLs work in dev and production.
- **Auth** — On login the API returns a JWT; the client stores it in `localStorage` and sends it as a `Bearer` token. `AuthContext` restores the session on refresh via `/auth/me`. Protected pages are gated by `<ProtectedRoute>`.
- **Notes & auto-save** — The editor keeps optimistic local state and persists changes with a **debounced `PATCH /notes/:id`**, showing a live save-status indicator.
- **AI workflow** — `POST /notes/:id/generate-summary` calls `aiService`, which prompts Gemini for **strict JSON** (`summary`, `action_items`, `suggested_title`). The result is **persisted on the note** and the user's AI usage counter is incremented. If no API key is set — or if the provider call fails — the service **degrades gracefully to a deterministic local summariser**, so the app is always demoable.
- **Insights** — Every meaningful action writes an `ActivityLog` row. The dashboard uses MongoDB aggregation for top tags and a bucketed 7-day activity series. Logs are decoupled from notes so stats survive deletions.
- **Sharing** — Sharing assigns a random `shareId` (nanoid). `GET /shared/:shareId` is public and returns only display-safe fields — never the owner id or internals.

### Data model

```
User                         Note                            ActivityLog
─────                        ─────                           ───────────
name                         owner          → User           user        → User
email (unique)               title                           action      (enum)
passwordHash (select:false)  content                         note        → Note
aiUsageCount                 tags[] / category               createdAt
                             isArchived
                             isPublic / shareId (sparse)
                             ai { summary, actionItems,
                                  suggestedTitle, generatedAt }
```

Indexes: `Note` text index on `title`+`content` (search), single-field indexes on `owner`, `tags`, `isArchived`; `ActivityLog` compound `{ user, createdAt }`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **MongoDB** — local (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- *(Optional)* a **Google Gemini API key** — [get one free](https://aistudio.google.com/app/apikey). Without it, AI features still work via a built-in offline fallback.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit .env (see below)
npm run seed                # optional: creates a demo account with sample notes
npm run dev                 # starts API on http://localhost:5000
```

**`backend/.env`**

```
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=mongodb://127.0.0.1:27017/peblo-notes
JWT_SECRET=<any-long-random-string>
JWT_EXPIRES_IN=7d
LLM_API_KEY=<your-gemini-key-or-leave-blank>
LLM_MODEL=gemini-1.5-flash
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # default works for local dev
npm run dev                 # starts the app on http://localhost:5173
```

Open **http://localhost:5173**.

### Demo account

After running `npm run seed`:

```
email:    demo@peblo.com
password: demo123
```

The login screen also has a **"Try the demo account"** button.

---

## 🧪 Testing the application

A quick manual smoke test covering all six features:

1. **Auth** — Sign up a new account, or click *Try the demo account*. Refresh the page — you stay logged in (persistent session). Open `/insights` in a logged-out tab — you're redirected to login (protected routes).
2. **Notes** — Create a note, type freely; watch the *"Saving… / All changes saved"* indicator (auto-save). Add tags and a category. Archive it, then find it under **Archived**.
3. **AI** — Open a note with content, click **Generate summary & action items** in the AI panel. You get a summary, action items, and a suggested title (click *Apply this title*).
4. **Search & filter** — Use the search box (live keyword search), the tag dropdown, and the sort selector on the Notes page.
5. **Sharing** — In a note, click **Share → Create public link**, copy it, open in an incognito window — the note renders without login.
6. **Insights** — Open the **Insights** page for totals, top tags, AI usage, and the weekly activity chart.

API responses can also be checked directly with `curl` — see [`docs/sample-outputs.md`](docs/sample-outputs.md).

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Create account, returns `{ token, user }` |
| POST | `/api/auth/login` | — | Log in, returns `{ token, user }` |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/notes` | ✓ | List notes — `?q=&tag=&category=&archived=&sort=` |
| POST | `/api/notes` | ✓ | Create note |
| GET | `/api/notes/:id` | ✓ | Get one note |
| PATCH | `/api/notes/:id` | ✓ | Update note (powers auto-save) |
| DELETE | `/api/notes/:id` | ✓ | Delete note |
| POST | `/api/notes/:id/generate-summary` | ✓ | Run AI: summary + action items + title |
| POST | `/api/notes/:id/share` | ✓ | Enable public sharing |
| DELETE | `/api/notes/:id/share` | ✓ | Revoke public sharing |
| GET | `/api/shared/:shareId` | — | Public read of a shared note |
| GET | `/api/insights` | ✓ | Productivity dashboard data |

---

## 🔐 Security notes

- Passwords are **bcrypt-hashed**; the hash uses `select: false` so it never leaves the DB by accident.
- All note routes scope queries to `owner: req.user._id` — users can only ever touch their own notes.
- Auth and AI endpoints are **rate-limited** (`express-rate-limit`).
- The public share endpoint returns a **whitelisted subset** of fields only.
- **No secrets are committed** — `.env` is git-ignored; `.env.example` documents the shape.

---

## 📦 Deliverables in this repo

- ✅ Frontend + backend source code
- ✅ This README (setup + architecture)
- ✅ `.env.example` for both apps
- ✅ Demo seed script (`npm run seed`)
- ✅ `docs/` — sample API responses, AI outputs, and DB schema

---

Built with care for the Peblo Full Stack Developer Challenge by **Anjali Verma**. ✦
