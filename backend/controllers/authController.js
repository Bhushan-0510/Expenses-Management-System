const User = require("../models/User");
const { signAccessToken } = require("../utils/jwt");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ email, password });
    const token = signAccessToken(user._id);

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signAccessToken(user._id);
    return res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };

