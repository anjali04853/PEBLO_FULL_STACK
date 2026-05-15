import Note from '../models/Note.js';
import { asyncHandler, httpError } from '../middleware/errorHandler.js';

/**
 * GET /shared/:shareId — public, unauthenticated read of a shared note.
 * Returns only display-safe fields; never exposes owner or internal ids.
 */
export const getSharedNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    shareId: req.params.shareId,
    isPublic: true,
  }).populate('owner', 'name');

  if (!note) {
    throw httpError(404, 'This note is private or no longer shared');
  }

  res.json({
    note: {
      title: note.title,
      content: note.content,
      tags: note.tags,
      category: note.category,
      author: note.owner?.name || 'Anonymous',
      summary: note.ai?.summary || '',
      actionItems: note.ai?.actionItems || [],
      updatedAt: note.updatedAt,
    },
  });
});
