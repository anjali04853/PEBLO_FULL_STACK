import jwt from 'jsonwebtoken';

/** Signs a JWT for a given user id. */
export function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
