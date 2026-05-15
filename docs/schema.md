# Database Schema

MongoDB via Mongoose. Three collections.

## `users`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | primary key |
| `name` | String | required |
| `email` | String | required, **unique**, lowercased |
| `passwordHash` | String | bcrypt hash; `select: false` (never returned by default) |
| `aiUsageCount` | Number | incremented on each AI generation; powers Insights |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

## `notes`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | primary key |
| `owner` | ObjectId → `users` | **indexed**; every query is scoped to this |
| `title` | String | default `"Untitled note"` |
| `content` | String | raw note body (markdown supported) |
| `tags` | [String] | **indexed**; used for filtering |
| `category` | String | default `"General"` |
| `isArchived` | Boolean | **indexed**; default `false` |
| `isPublic` | Boolean | default `false` |
| `shareId` | String | **unique, sparse**; random nanoid, only set when shared |
| `ai` | Object | `{ summary, actionItems[], suggestedTitle, generatedAt }` — embedded AI result |
| `createdAt` / `updatedAt` | Date | auto |

**Text index:** `{ title: 'text', content: 'text' }` — powers keyword search.

## `activitylogs`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | primary key |
| `user` | ObjectId → `users` | indexed |
| `action` | String enum | `note_created` · `note_updated` · `ai_generated` · `note_shared` |
| `note` | ObjectId → `notes` | optional reference |
| `createdAt` | Date | auto |

**Compound index:** `{ user: 1, createdAt: -1 }` — fast weekly-activity aggregation.

## Design rationale

- **AI result is embedded on the note**, not a separate collection — it's always
  read together with the note and there's exactly one current result per note.
- **`activitylogs` is decoupled** from notes so the weekly activity summary and
  AI usage stats remain accurate even after a note is deleted.
- **`shareId` is sparse-unique** so unshared notes don't collide on a `null` value.
- All access is **owner-scoped at the query level** — there is no way to read
  another user's note through the authenticated API.
