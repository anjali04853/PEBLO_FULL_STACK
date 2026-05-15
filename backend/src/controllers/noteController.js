import Note from '../models/Note.js';
import ActivityLog from '../models/ActivityLog.js';
import { asyncHandler, httpError } from '../middleware/errorHandler.js';

/** Loads a note owned by the current user, or throws 404. */
async function ownedNote(noteId, userId) {
  const note = await Note.findOne({ _id: noteId, owner: userId });
  if (!note) throw httpError(404, 'Note not found');
  return note;
}

/**
 * GET /notes — list the current user's notes with search / filter / sort.
 * Query params:
 *   q        keyword search (title + content)
 *   tag      filter by a single tag
 *   category filter by category
 *   archived "true" | "false" (default false)
 *   sort     "updated" (default) | "created" | "title"
 */
export const listNotes = asyncHandler(async (req, res) => {
  const { q, tag, category, archived = 'false', sort = 'updated' } = req.query;

  const filter = {
    owner: req.user._id,
    isArchived: archived === 'true',
  };
  if (tag) filter.tags = tag;
  if (category) filter.category = category;
  if (q && q.trim()) filter.$text = { $search: q.trim() };

  const sortMap = {
    updated: { updatedAt: -1 },
    created: { createdAt: -1 },
    title: { title: 1 },
  };

  const notes = await Note.find(filter).sort(sortMap[sort] || sortMap.updated);
  res.json({ notes });
});

/** GET /notes/:id — fetch a single owned note. */
export const getNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  res.json({ note });
});

/** POST /notes — create a new note. */
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, category } = req.body;

  const note = await Note.create({
    owner: req.user._id,
    title: title?.trim() || 'Untitled note',
    content: content || '',
    tags: Array.isArray(tags) ? tags : [],
    category: category?.trim() || 'General',
  });

  await ActivityLog.create({
    user: req.user._id,
    action: 'note_created',
    note: note._id,
  });

  res.status(201).json({ note });
});

/** PATCH /notes/:id — partial update; powers auto-save. */
export const updateNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  const { title, content, tags, category, isArchived } = req.body;

  if (title !== undefined) note.title = title.trim() || 'Untitled note';
  if (content !== undefined) note.content = content;
  if (tags !== undefined) note.tags = Array.isArray(tags) ? tags : [];
  if (category !== undefined) note.category = category.trim() || 'General';
  if (isArchived !== undefined) note.isArchived = Boolean(isArchived);

  await note.save();
  await ActivityLog.create({
    user: req.user._id,
    action: 'note_updated',
    note: note._id,
  });

  res.json({ note });
});

/** DELETE /notes/:id — permanently remove a note. */
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  await note.deleteOne();
  res.json({ ok: true });
});

/** POST /notes/:id/share — enable public sharing, return the share link. */
export const shareNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  note.enablePublicShare();
  await note.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'note_shared',
    note: note._id,
  });

  res.json({ shareId: note.shareId, isPublic: true });
});

/** DELETE /notes/:id/share — revoke public sharing. */
export const unshareNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  note.isPublic = false;
  await note.save();
  res.json({ isPublic: false });
});
