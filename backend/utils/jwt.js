const jwt = require("jsonwebtoken");

function signAccessToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign({}, secret, {
    subject: String(userId),
    expiresIn
  });
}

module.exports = { signAccessToken };

