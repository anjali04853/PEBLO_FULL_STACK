import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Never selected by default — must be explicitly requested for login.
    passwordHash: { type: String, required: true, select: false },
    // Lightweight counter used by the Productivity Insights dashboard.
    aiUsageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/** Hashes a plaintext password before storing. */
userSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 10);
};

/** Compares a candidate password against the stored hash. */
userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

/** Public-safe representation — strips the password hash. */
userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    aiUsageCount: this.aiUsageCount,
  };
};

export default mongoose.model('User', userSchema);
