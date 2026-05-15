import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

/**
 * Embedded AI output. Stored on the note so summaries persist and the
 * dashboard can report AI usage without re-calling the provider.
 */
const aiResultSchema = new mongoose.Schema(
  {
    summary: { type: String, default: '' },
    actionItems: { type: [String], default: [] },
    suggestedTitle: { type: String, default: '' },
    generatedAt: { type: Date },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, default: 'Untitled note', trim: true },
    content: { type: String, default: '' },
    // Free-form labels used for organising + filtering.
    tags: { type: [String], default: [], index: true },
    category: { type: String, default: 'General', trim: true },
    isArchived: { type: Boolean, default: false, index: true },

    // Public sharing. shareId is only present once a note is shared.
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },

    ai: { type: aiResultSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Full-text index powers keyword search across title + content.
noteSchema.index({ title: 'text', content: 'text' });

/** Generates a fresh public share id. */
noteSchema.methods.enablePublicShare = function () {
  if (!this.shareId) this.shareId = nanoid(12);
  this.isPublic = true;
};

export default mongoose.model('Note', noteSchema);
