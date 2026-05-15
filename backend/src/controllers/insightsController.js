import Note from '../models/Note.js';
import ActivityLog from '../models/ActivityLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { isAIConfigured } from '../services/aiService.js';

/**
 * GET /insights — productivity dashboard data for the current user:
 *  - total / archived note counts
 *  - recently edited notes
 *  - most-used tags
 *  - AI usage statistics
 *  - a 7-day activity summary
 */
export const getInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalNotes, archivedNotes, recentNotes] = await Promise.all([
    Note.countDocuments({ owner: userId, isArchived: false }),
    Note.countDocuments({ owner: userId, isArchived: true }),
    Note.find({ owner: userId, isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt tags'),
  ]);

  // Most-used tags via aggregation.
  const tagAgg = await Note.aggregate([
    { $match: { owner: userId } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);
  const topTags = tagAgg.map((t) => ({ tag: t._id, count: t.count }));

  // AI usage: how many notes carry a generated summary.
  const notesWithAI = await Note.countDocuments({
    owner: userId,
    'ai.generatedAt': { $exists: true },
  });

  // 7-day activity summary, bucketed by day.
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activityAgg = await ActivityLog.aggregate([
    { $match: { user: userId, createdAt: { $gte: weekAgo } } },
    {
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.day': 1 } },
  ]);

  // Build a continuous 7-day series so the chart has no gaps.
  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = activityAgg.find((a) => a._id.day === key);
    weeklyActivity.push({ date: key, count: found ? found.count : 0 });
  }

  const weeklyTotal = weeklyActivity.reduce((s, d) => s + d.count, 0);

  res.json({
    totalNotes,
    archivedNotes,
    recentNotes,
    topTags,
    ai: {
      totalGenerations: req.user.aiUsageCount,
      notesWithSummary: notesWithAI,
      provider: isAIConfigured() ? 'gemini' : 'mock',
    },
    weeklyActivity,
    weeklyTotal,
  });
});
