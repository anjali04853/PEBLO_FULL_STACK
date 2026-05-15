# Demo Video Script (5–8 minutes)

A suggested walkthrough order for the submission video. Record at 1080p; have
both servers running and the demo account seeded beforehand.

## 0. Setup (off-camera, before recording)
```bash
cd backend && npm install && cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, LLM_API_KEY
npm run seed && npm run dev
cd ../frontend && npm install && npm run dev
```

## 1. Intro (~30s)
- "This is Peblo Notes — a collaborative AI notes workspace."
- Show the project structure briefly: `backend/` + `frontend/`.

## 2. Authentication (~45s)
- Open `http://localhost:5173` → redirected to **Login** (protected routes).
- Click **Try the demo account** → land in the workspace.
- Refresh the page → still logged in (persistent JWT session).

## 3. Notes workflow (~90s)
- Click **＋ New note**. Type a title and a few paragraphs of content.
- Point out the **"Saving… / All changes saved"** indicator — debounced auto-save.
- Add two tags and a category.
- Toggle **Preview** (or `Ctrl/Cmd+E`) to show markdown rendering.
- Go back, **Archive** a note, show it under the **Archived** tab, restore it.

## 4. AI summary generation (~75s)
- Open a content-rich note (e.g. *Sprint Planning Notes*).
- Click **Generate summary & action items** in the AI panel.
- Show the summary, the extracted action items, and the suggested title.
- Click **Apply this title** → the note title updates.
- Mention the graceful fallback: works even without an API key.

## 5. Search & filtering (~45s)
- On the Notes page, type a keyword → live results.
- Use the **tag** filter and the **sort** dropdown.

## 6. Public sharing (~60s)
- In a note, click **Share → Create public link**, copy it.
- Open the link in an **incognito window** — note renders without login.
- Show the AI summary appears on the public page too.
- Back in the app, **Stop sharing** → reload the public page → now unavailable.

## 7. Productivity insights (~45s)
- Open the **Insights** page.
- Walk through: total notes, AI generations, most-used tags, the 7-day activity chart.

## 8. Wrap-up (~20s)
- Toggle **dark mode**.
- Mention the architecture: React + Express + MongoDB + Gemini, owner-scoped APIs,
  activity logging for insights.
