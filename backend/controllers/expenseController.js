const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Category = require("../models/Category");

function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfMonth(date) {
  const d = startOfMonth(date);
  d.setMonth(d.getMonth() + 1);
  d.setMilliseconds(-1);
  return d;
}

async function addExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const { amount, categoryId, note } = req.body;
    const date = req.body.date ? new Date(req.body.date) : new Date();

    const now = new Date();
    if (date.getTime() > now.getTime()) {
      return res.status(400).json({ message: "Date cannot be in the future" });
    }

    let finalCategoryId = undefined;
    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }

      const cat = await Category.findOne({ _id: categoryId, userId });
      if (!cat) return res.status(404).json({ message: "Category not found" });
      finalCategoryId = cat._id;
    }

    const expense = await Expense.create({
      userId,
      amount,
      categoryId: finalCategoryId,
      note,
      date
    });

    return res.status(201).json(expense);
  } catch (err) {
    return next(err);
  }
}

// Optional filters:
// - month=YYYY-MM (e.g. 2026-03)
// - categoryId=<ObjectId>
async function getExpenses(req, res, next) {
  try {
    const userId = req.user.id;
    const { month, categoryId } = req.query;

    const query = { userId };

    if (month) {
      const match = String(month).match(/^(\d{4})-(\d{2})$/);
      if (!match) return res.status(400).json({ message: "month must be in YYYY-MM format" });
      const [_, yearStr, monthStr] = match;
      const year = Number(yearStr);
      const mon = Number(monthStr) - 1;
      const dt = new Date(year, mon, 1);
      query.date = { $gte: startOfMonth(dt), $lte: endOfMonth(dt) };
    }

    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      query.categoryId = categoryId;
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate({ path: "categoryId", select: "name" });

    return res.json(expenses);
  } catch (err) {
    return next(err);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const deleted = await Expense.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: "Expense not found" });

    return res.json({ message: "Expense deleted" });
  } catch (err) {
    return next(err);
  }
}

async function updateExpense(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount, categoryId, note, date } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    let finalCategoryId = undefined;
    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      const cat = await Category.findOne({ _id: categoryId, userId });
      if (!cat) return res.status(404).json({ message: "Category not found" });
      finalCategoryId = cat._id;
    }

    let parsedDate = undefined;
    if (date) {
      parsedDate = new Date(date);
      const now = new Date();
      if (parsedDate.getTime() > now.getTime()) {
        return res.status(400).json({ message: "Date cannot be in the future" });
      }
    }

    const update = {};
    if (typeof amount === "number") update.amount = amount;
    if (typeof note === "string") update.note = note;
    if (finalCategoryId !== undefined) update.categoryId = finalCategoryId;
    if (parsedDate) update.date = parsedDate;

    const updated = await Expense.findOneAndUpdate({ _id: id, userId }, update, {
      new: true
    });
    if (!updated) return res.status(404).json({ message: "Expense not found" });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

module.exports = { addExpense, getExpenses, deleteExpense, updateExpense };

