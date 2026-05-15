import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { asyncHandler, httpError } from '../middleware/errorHandler.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /auth/signup — create an account and return a session token. */
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw httpError(400, 'Name, email and password are required');
  }
  if (!EMAIL_RE.test(email)) throw httpError(400, 'Please enter a valid email');
  if (password.length < 6) {
    throw httpError(400, 'Password must be at least 6 characters');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user._id);
  res.status(201).json({ token, user: user.toPublic() });
});

/** POST /auth/login — verify credentials and return a session token. */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw httpError(400, 'Email and password are required');
  }

  // passwordHash is select:false, so request it explicitly here.
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash'
  );
  if (!user || !(await user.verifyPassword(password))) {
    throw httpError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);
  res.json({ token, user: user.toPublic() });
});

/** GET /auth/me — return the current authenticated user. */
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});
