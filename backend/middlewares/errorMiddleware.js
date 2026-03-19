function notFoundHandler(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Always log the full error to the server logs for debugging (useful on Render)
  // This will not expose stack traces to production responses, only to logs.
  // eslint-disable-next-line no-console
  console.error(err && err.stack ? err.stack : err);

  if (err.details) {
    return res.status(status).json({ message, errors: err.details });
  }

  if (process.env.NODE_ENV !== "production") {
    return res.status(status).json({
      message,
      stack: err.stack
    });
  }

  return res.status(status).json({ message });
}

module.exports = { notFoundHandler, errorHandler };

