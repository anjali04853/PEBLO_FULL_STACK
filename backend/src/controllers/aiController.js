import Note from '../models/Note.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateNoteInsights } from '../services/aiService.js';
import { asyncHandler, httpError } from '../middleware/errorHandler.js';

/**
 * POST /notes/:id/generate-summary
 * Runs the AI pipeline on a note, persists the result on the note,
 * increments the user's AI usage counter and logs the activity.
 */
export const generateSummary = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
  if (!note) throw httpError(404, 'Note not found');

  const insights = await generateNoteInsights(note.content);

  note.ai = {
    summary: insights.summary,
    actionItems: insights.actionItems,
    suggestedTitle: insights.suggestedTitle,
    generatedAt: new Date(),
  };
  await note.save();

  await User.updateOne({ _id: req.user._id }, { $inc: { aiUsageCount: 1 } });
  await ActivityLog.create({
    user: req.user._id,
    action: 'ai_generated',
    note: note._id,
  });

  res.json({
    summary: insights.summary,
    action_items: insights.actionItems,
    suggested_title: insights.suggestedTitle,
    provider: insights.provider,
  });
});
