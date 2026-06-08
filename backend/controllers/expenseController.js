const Expense = require("../models/Expense");

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    if (!title || amount === undefined || !category || !paymentMethod || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Title, amount, category, payment method, and date are required",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const expense = await Expense.create({
      title,
      amount: Number(amount),
      category,
      paymentMethod,
      date,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create expense",
      error: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    if (req.body.amount !== undefined && Number(req.body.amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (req.body.amount !== undefined) {
      updateData.amount = Number(req.body.amount);
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};