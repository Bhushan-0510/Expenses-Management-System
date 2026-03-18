const { validationResult } = require("express-validator");

function validateRequest(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg
  }));

  const err = new Error("Validation failed");
  err.statusCode = 400;
  err.details = errors;
  return next(err);
}

module.exports = { validateRequest };

