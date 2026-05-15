/**
 * Seeds a demo account with sample notes + activity.
 * Run with: npm run seed
 * Login afterwards with  demo@peblo.com / demo123
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Note from '../models/Note.js';
import ActivityLog from '../models/ActivityLog.js';

const SAMPLE_NOTES = [
  {
    title: 'Sprint Planning Notes',
    category: 'Work',
    tags: ['work', 'meeting', 'planning'],
    content:
      'Weekly project planning discussion. The team reviewed the current backlog and prioritised the notes workspace feature. Prepare UI mockups for the editor screen. Review API structure with the backend team. We also discussed moving to a two-week sprint cadence.',
  },
  {
    title: 'Reading List',
    category: 'Personal',
    tags: ['personal', 'books'],
    content:
      'Books to read this quarter: Designing Data-Intensive Applications, The Pragmatic Programmer, and Shape Up. Schedule one hour every evening for reading.',
  },
  {
    title: 'Product Ideas',
    category: 'Ideas',
    tags: ['work', 'ideas'],
    content:
      'Brainstorm for the next quarter. Build a markdown preview mode. Create keyboard shortcuts for power users. Follow up with design on the dark theme palette.',
  },
  {
    title: 'Grocery & Errands',
    category: 'Personal',
    tags: ['personal'],
    content:
      'Buy vegetables and milk. Send the electricity bill payment. Call the plumber about the kitchen sink.',
  },
];

async function run() {
  await connectDB();

  await Promise.all([
    User.deleteMany({ email: 'demo@peblo.com' }),
  ]);

  const passwordHash = await User.hashPassword('demo123');
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@peblo.com',
    passwordHash,
  });

  // Clear any orphaned demo data, then insert fresh notes.
  await Note.deleteMany({ owner: user._id });
  await ActivityLog.deleteMany({ user: user._id });

  for (const sample of SAMPLE_NOTES) {
    const note = await Note.create({ owner: user._id, ...sample });
    await ActivityLog.create({
      user: user._id,
      action: 'note_created',
      note: note._id,
    });
  }

  console.log('✓ Seeded demo account:');
  console.log('  email:    demo@peblo.com');
  console.log('  password: demo123');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
