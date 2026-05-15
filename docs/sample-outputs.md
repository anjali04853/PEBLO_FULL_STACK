# Sample Outputs

Real responses captured from a running instance (demo account, seeded data).

---

## 1. Auth — `POST /api/auth/login`

**Request**
```json
{ "email": "demo@peblo.com", "password": "demo123" }
```

**Response `200`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a079c7fd8a2f7e9d3f298ff",
    "name": "Demo User",
    "email": "demo@peblo.com",
    "aiUsageCount": 0
  }
}
```

**Wrong password → `401`**
```json
{ "error": "Invalid email or password" }
```

---

## 2. Notes — `GET /api/notes?q=mockups`

```json
{
  "notes": [
    {
      "_id": "6a079c7fd8a2f7e9d3f298ff",
      "owner": "6a079c7fd8a2f7e9d3f298fa",
      "title": "Sprint Planning Notes",
      "content": "Weekly project planning discussion...",
      "tags": ["work", "meeting", "planning"],
      "category": "Work",
      "isArchived": false,
      "isPublic": false,
      "ai": { "summary": "", "actionItems": [], "suggestedTitle": "" },
      "createdAt": "2026-05-16T09:12:04.001Z",
      "updatedAt": "2026-05-16T09:12:04.001Z"
    }
  ]
}
```

---

## 3. AI — `POST /api/notes/:id/generate-summary`

For the **"Sprint Planning Notes"** note:

```json
{
  "summary": "Weekly project planning discussion. The team reviewed the current backlog and prioritised the notes workspace feature.",
  "action_items": [
    "Prepare UI mockups for the editor screen",
    "Review API structure with the backend team"
  ],
  "suggested_title": "Sprint Planning & Backlog Review",
  "provider": "gemini"
}
```

> When no `LLM_API_KEY` is configured, the same endpoint returns `"provider": "mock"`
> using a deterministic local summariser — the response shape is identical, so the
> rest of the app never has to special-case it.

---

## 4. Sharing — `POST /api/notes/:id/share`

```json
{ "shareId": "I9CR_11itM6b", "isPublic": true }
```

**Public read — `GET /api/shared/I9CR_11itM6b` (no auth)**
```json
{
  "note": {
    "title": "Grocery & Errands",
    "content": "Buy vegetables and milk. Send the electricity bill payment...",
    "tags": ["personal"],
    "category": "Personal",
    "author": "Demo User",
    "summary": "Buy vegetables and milk. Send the electricity bill payment.",
    "actionItems": ["Send the electricity bill payment", "Call the plumber..."],
    "updatedAt": "2026-05-16T09:14:22.310Z"
  }
}
```

Note: the public response **omits** `owner`, `_id`, and visibility internals.

---

## 5. Insights — `GET /api/insights`

```json
{
  "totalNotes": 4,
  "archivedNotes": 0,
  "recentNotes": [
    { "_id": "6a07...", "title": "Sprint Planning Notes", "updatedAt": "2026-05-16T09:12:04.001Z", "tags": ["work","meeting","planning"] }
  ],
  "topTags": [
    { "tag": "work", "count": 2 },
    { "tag": "personal", "count": 2 },
    { "tag": "meeting", "count": 1 }
  ],
  "ai": { "totalGenerations": 1, "notesWithSummary": 1, "provider": "mock" },
  "weeklyActivity": [
    { "date": "2026-05-10", "count": 0 },
    { "date": "2026-05-11", "count": 0 },
    { "date": "2026-05-12", "count": 0 },
    { "date": "2026-05-13", "count": 0 },
    { "date": "2026-05-14", "count": 0 },
    { "date": "2026-05-15", "count": 0 },
    { "date": "2026-05-16", "count": 6 }
  ],
  "weeklyTotal": 6
}
```

---

## 6. Error handling

| Scenario | Status | Body |
|----------|--------|------|
| Missing/invalid token on a protected route | `401` | `{ "error": "Authentication required" }` |
| Note not found / not owned by user | `404` | `{ "error": "Note not found" }` |
| Duplicate email on signup | `409` | `{ "error": "That email is already registered" }` |
| Note too short for AI | `400` | `{ "error": "Note is too short to generate insights" }` |
| Shared note that is private | `404` | `{ "error": "This note is private or no longer shared" }` |
