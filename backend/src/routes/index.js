import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { requireAuth } from '../middleware/auth.js';
import { signup, login, me } from '../controllers/authController.js';
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  unshareNote,
} from '../controllers/noteController.js';
import { generateSummary } from '../controllers/aiController.js';
import { getSharedNote } from '../controllers/shareController.js';
import { getInsights } from '../controllers/insightsController.js';

const router = Router();

// Tighter limit on auth endpoints to slow brute-force attempts.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
// AI endpoint is more expensive — cap usage per user window.
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 15 });

// --- Auth ---
router.post('/auth/signup', authLimiter, signup);
router.post('/auth/login', authLimiter, login);
router.get('/auth/me', requireAuth, me);

// --- Notes (all protected) ---
router.get('/notes', requireAuth, listNotes);
router.post('/notes', requireAuth, createNote);
router.get('/notes/:id', requireAuth, getNote);
router.patch('/notes/:id', requireAuth, updateNote);
router.delete('/notes/:id', requireAuth, deleteNote);

// --- Sharing controls (protected) ---
router.post('/notes/:id/share', requireAuth, shareNote);
router.delete('/notes/:id/share', requireAuth, unshareNote);

// --- AI ---
router.post('/notes/:id/generate-summary', requireAuth, aiLimiter, generateSummary);

// --- Insights ---
router.get('/insights', requireAuth, getInsights);

// --- Public share page (no auth) ---
router.get('/shared/:shareId', getSharedNote);

export default router;
