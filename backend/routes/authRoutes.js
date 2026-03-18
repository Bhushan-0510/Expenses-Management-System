const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validateRequest");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isString().notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  login
);

module.exports = router;

