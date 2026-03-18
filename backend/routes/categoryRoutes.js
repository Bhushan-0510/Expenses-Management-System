const express = require("express");
const { body } = require("express-validator");
const { authRequired } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const { createCategory, getCategories } = require("../controllers/categoryController");

const router = express.Router();

router.use(authRequired);

router.post(
  "/",
  [body("name").isString().trim().notEmpty().withMessage("name is required").isLength({ max: 60 })],
  validateRequest,
  createCategory
);

router.get("/", getCategories);

module.exports = router;

