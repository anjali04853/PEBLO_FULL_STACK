/** Wraps async route handlers so thrown errors reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** 404 handler for unmatched routes. */
export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
}

/** Central error handler — keeps responses consistent and JSON-shaped. */
export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  // Surface Mongoose duplicate-key errors with a friendly message.
  if (err.code === 11000) {
    return res.status(409).json({ error: 'That email is already registered' });
  }
  res.status(status).json({ error: err.message || 'Something went wrong' });
}

/** Builds an Error with an HTTP status attached. */
export function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}
