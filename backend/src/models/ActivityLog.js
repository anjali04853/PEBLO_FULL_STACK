import mongoose from 'mongoose';

/**
 * One row per meaningful user action. Powers the weekly activity
 * summary on the Productivity Insights dashboard. Kept separate from
 * notes so insights stay accurate even after a note is deleted.
 */
const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['note_created', 'note_updated', 'ai_generated', 'note_shared'],
      required: true,
    },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
  },
  { timestamps: true }
);

activityLogSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
