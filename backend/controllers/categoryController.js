const Category = require("../models/Category");

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const category = await Category.create({ name, userId });
    return res.status(201).json(category);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    return next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const userId = req.user.id;
    const categories = await Category.find({ userId }).sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    return next(err);
  }
}

module.exports = { createCategory, getCategories };

