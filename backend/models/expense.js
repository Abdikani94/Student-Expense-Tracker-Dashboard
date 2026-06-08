const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transport",
        "Internet",
        "Education",
        "Personal",
        "Health",
        "Shopping",
        "Bills",
        "Entertainment",
        "Other",
      ],
      default: "Food",
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["Cash", "EVC Plus", "Bank", "Card", "Other"],
      default: "Cash",
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);