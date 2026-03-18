const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      index: true
    },
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);

