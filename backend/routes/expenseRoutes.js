const express = require("express");
const { body, query, param } = require("express-validator");
const { authRequired } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const { addExpense, getExpenses, deleteExpense, updateExpense } = require("../controllers/expenseController");

const router = express.Router();

router.use(authRequired);

router.post(
  "/",
  [
    body("amount").isFloat({ gt: 0 }).withMessage("amount must be a number > 0"),
    body("note").isString().trim().notEmpty().withMessage("note is required").isLength({ max: 500 }),
    body("date").optional().isISO8601().withMessage("date must be ISO8601"),
    body("categoryId").optional().isMongoId().withMessage("categoryId must be a MongoId")
  ],
  validateRequest,
  addExpense
);

router.get(
  "/",
  [
    query("month").optional().isString().withMessage("month must be a string"),
    query("categoryId").optional().isMongoId().withMessage("categoryId must be a MongoId")
  ],
  validateRequest,
  getExpenses
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("id must be a MongoId")],
  validateRequest,
  deleteExpense
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("id must be a MongoId"),
    body("amount").optional().isFloat({ gt: 0 }).withMessage("amount must be a number > 0"),
    body("note")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("note is required")
      .isLength({ max: 500 }),
    body("date").optional().isISO8601().withMessage("date must be ISO8601"),
    body("categoryId").optional().isMongoId().withMessage("categoryId must be a MongoId")
  ],
  validateRequest,
  updateExpense
);

module.exports = router;

