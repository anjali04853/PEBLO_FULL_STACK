import mongoose from 'mongoose';

/**
 * Connects to MongoDB. The process exits on failure so the app never
 * runs in a half-broken state where requests silently fail.
 */
export async function connectDB() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('✗ DATABASE_URL is not set. Copy .env.example to .env.');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
