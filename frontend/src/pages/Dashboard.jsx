import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  ReceiptText,
  TrendingUp,
  Target,
  CreditCard,
} from "lucide-react";

import API from "../services/api";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseCharts from "../components/ExpenseCharts";
import ExpenseTable from "../components/ExpenseTable";
import "./Dashboard.css";

function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    return savedBudget ? Number(savedBudget) : 100;
  });

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "Cash",
    date: "",
    notes: "",
  });

  const categories = [
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
  ];

  const paymentMethods = ["Cash", "EVC Plus", "Bank", "Card", "Other"];

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const expenseData = Array.isArray(res.data) ? res.data : res.data.data;
      setExpenses(expenseData || []);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    localStorage.setItem("monthlyBudget", monthlyBudget);
  }, [monthlyBudget]);

  const allTimeTotal = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const remainingBudget = monthlyBudget - allTimeTotal;

  const budgetUsedPercent =
    monthlyBudget > 0 ? Math.min((allTimeTotal / monthlyBudget) * 100, 100) : 0;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      amount: "",
      category: "Food",
      paymentMethod: "Cash",
      date: "",
      notes: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAmount = Number(form.amount);

    if (newAmount <= 0) {
      alert("Expense amount must be greater than 0.");
      return;
    }

    if (monthlyBudget <= 0) {
      alert("Please enter a valid monthly budget first.");
      return;
    }

    let currentExpenseAmount = 0;

    if (editingId) {
      const currentExpense = expenses.find(
        (expense) => expense._id === editingId
      );
      currentExpenseAmount = currentExpense ? Number(currentExpense.amount) : 0;
    }

    const availableBudget = monthlyBudget - allTimeTotal + currentExpenseAmount;

    if (newAmount > availableBudget) {
      alert(
        `You cannot spend $${newAmount.toFixed(
          2
        )}. Your remaining budget is only $${availableBudget.toFixed(2)}.`
      );
      return;
    }

    const expenseData = {
      ...form,
      amount: newAmount,
    };

    try {
      if (editingId) {
        await API.put(`/expenses/${editingId}`, expenseData);
      } else {
        await API.post("/expenses", expenseData);
      }

      resetForm();
      fetchExpenses();
    } catch (error) {
      console.error("Failed to save expense:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while saving expense."
      );
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);

    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod || "Cash",
      date: expense.date?.slice(0, 10),
      notes: expense.notes || "",
    });

    setActivePage("expenses");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (filterCategory !== "All") {
      result = result.filter((expense) => expense.category === filterCategory);
    }

    if (filterPayment !== "All") {
      result = result.filter(
        (expense) => expense.paymentMethod === filterPayment
      );
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((expense) =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "highest") return Number(b.amount) - Number(a.amount);
      if (sortOrder === "lowest") return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return result;
  }, [expenses, filterCategory, filterPayment, searchTerm, sortOrder]);

  const filteredTotal = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((max, item) =>
          Number(item.amount) > Number(max.amount) ? item : max
        )
      : null;

  const categoryTotals = categories.map((category) => {
    const total = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      category,
      amount: total,
    };
  });

  const chartData = categoryTotals.filter((item) => item.amount > 0);

  const topCategory =
    chartData.length > 0
      ? chartData.reduce((max, item) =>
          item.amount > max.amount ? item : max
        ).category
      : "None";

  const clearFilters = () => {
    setFilterCategory("All");
    setFilterPayment("All");
    setSearchTerm("");
    setSortOrder("newest");
  };

  const pageTitle = {
    dashboard: "Student Expense Tracker",
    expenses: "Expense Management",
    reports: "Reports & Analytics",
    budget: "Monthly Budget",
  };

  const pageDescription = {
    dashboard:
      "Manage expenses, track spending habits, and stay within your budget.",
    expenses:
      "Add, edit, delete, search, and filter your expense records.",
    reports:
      "Analyze your spending by category and understand your financial behavior.",
    budget:
      "Enter your monthly money and track how much remains after expenses.",
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <header className="header">
          <div>
            <p className="eyebrow">Personal Finance Dashboard</p>
            <h1>{pageTitle[activePage]}</h1>
            <p>{pageDescription[activePage]}</p>
          </div>

        </header>

        {activePage === "dashboard" && (
          <>
            <section className="summary-grid">
              <SummaryCard
                icon={<Wallet size={22} />}
                label="Filtered Spending"
                value={`$${filteredTotal.toFixed(2)}`}
                note="Based on current filters"
              />

              <SummaryCard
                icon={<ReceiptText size={22} />}
                label="Total Expenses"
                value={filteredExpenses.length}
                note={`${expenses.length} saved in database`}
              />

              <SummaryCard
                icon={<TrendingUp size={22} />}
                label="Highest Expense"
                value={
                  highestExpense
                    ? `$${Number(highestExpense.amount).toFixed(2)}`
                    : "$0.00"
                }
                note={highestExpense ? highestExpense.title : "No data yet"}
              />

              <SummaryCard
                icon={<Target size={22} />}
                label="Top Category"
                value={topCategory}
                note="Highest spending category"
              />
            </section>

            <BudgetSection
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
              allTimeTotal={allTimeTotal}
              remainingBudget={remainingBudget}
              budgetUsedPercent={budgetUsedPercent}
            />

            <section className="content-grid">
              <ExpenseForm
                form={form}
                editingId={editingId}
                categories={categories}
                paymentMethods={paymentMethods}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
              />

              <ExpenseCharts chartData={chartData} />
            </section>

            <ExpenseTable
              expenses={filteredExpenses}
              categories={categories}
              paymentMethods={paymentMethods}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterPayment={filterPayment}
              setFilterPayment={setFilterPayment}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              startEdit={startEdit}
              deleteExpense={deleteExpense}
              clearFilters={clearFilters}
            />
          </>
        )}

        {activePage === "expenses" && (
          <>
            <section className="content-grid">
              <ExpenseForm
                form={form}
                editingId={editingId}
                categories={categories}
                paymentMethods={paymentMethods}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
              />

              <div className="panel">
                <h2>Expense Summary</h2>
                <p>Total saved expenses: {expenses.length}</p>
                <p>Current filtered expenses: {filteredExpenses.length}</p>
                <p>Filtered total: ${filteredTotal.toFixed(2)}</p>
                <p>
                  Remaining budget: $
                  {remainingBudget > 0 ? remainingBudget.toFixed(2) : "0.00"}
                </p>
              </div>
            </section>

            <ExpenseTable
              expenses={filteredExpenses}
              categories={categories}
              paymentMethods={paymentMethods}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterPayment={filterPayment}
              setFilterPayment={setFilterPayment}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              startEdit={startEdit}
              deleteExpense={deleteExpense}
              clearFilters={clearFilters}
            />
          </>
        )}

        {activePage === "reports" && (
          <>
            <section className="summary-grid">
              <SummaryCard
                icon={<Wallet size={22} />}
                label="Total Spending"
                value={`$${allTimeTotal.toFixed(2)}`}
                note="All expenses combined"
              />

              <SummaryCard
                icon={<ReceiptText size={22} />}
                label="Total Records"
                value={expenses.length}
                note="Saved in MongoDB"
              />

              <SummaryCard
                icon={<TrendingUp size={22} />}
                label="Highest Expense"
                value={
                  highestExpense
                    ? `$${Number(highestExpense.amount).toFixed(2)}`
                    : "$0.00"
                }
                note={highestExpense ? highestExpense.title : "No data yet"}
              />

              <SummaryCard
                icon={<Target size={22} />}
                label="Top Category"
                value={topCategory}
                note="Highest spending category"
              />
            </section>

            <ExpenseCharts chartData={chartData} />
          </>
        )}

        {activePage === "budget" && (
          <>
            <section className="summary-grid">
              <SummaryCard
                icon={<Wallet size={22} />}
                label="Monthly Budget"
                value={`$${monthlyBudget.toFixed(2)}`}
                note="Your saved monthly money"
              />

              <SummaryCard
                icon={<ReceiptText size={22} />}
                label="Total Spent"
                value={`$${allTimeTotal.toFixed(2)}`}
                note="Deducted from your budget"
              />

              <SummaryCard
                icon={<Target size={22} />}
                label="Remaining"
                value={`$${
                  remainingBudget > 0 ? remainingBudget.toFixed(2) : "0.00"
                }`}
                note="Available to spend"
              />

              <SummaryCard
                icon={<TrendingUp size={22} />}
                label="Budget Used"
                value={`${budgetUsedPercent.toFixed(0)}%`}
                note="Monthly usage percentage"
              />
            </section>

            <BudgetSection
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
              allTimeTotal={allTimeTotal}
              remainingBudget={remainingBudget}
              budgetUsedPercent={budgetUsedPercent}
              detailed
            />
          </>
        )}
      </main>
    </div>
  );
}

function BudgetSection({
  monthlyBudget,
  setMonthlyBudget,
  allTimeTotal,
  remainingBudget,
  budgetUsedPercent,
  detailed = false,
}) {
  return (
    <section className="budget-card">
      <div>
        <h2>{detailed ? "Monthly Budget Control" : "Monthly Budget"}</h2>
        <p>
          Enter your monthly money. Every expense will be deducted from this
          budget.
        </p>
      </div>

      <div className="budget-controls">
        <input
          type="integer"
          value={monthlyBudget}
          min="0"
          onChange={(e) => setMonthlyBudget(Number(e.target.value))}
        />

        <span>
          Spent ${allTimeTotal.toFixed(2)} of ${monthlyBudget.toFixed(2)} |
          Remaining $
          {remainingBudget > 0 ? remainingBudget.toFixed(2) : "0.00"}
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${budgetUsedPercent}%` }}
        />
      </div>

      {detailed && (
        <div className="budget-details">
          <h3>Total Budget: ${monthlyBudget.toFixed(2)}</h3>
          <h3>Total Spent: ${allTimeTotal.toFixed(2)}</h3>
          <h3>
            Remaining: $
            {remainingBudget > 0 ? remainingBudget.toFixed(2) : "0.00"}
          </h3>
        </div>
      )}

      {remainingBudget <= 0 ? (
        <p className="budget-warning">
          Your monthly budget is finished. You cannot add more expenses.
        </p>
      ) : (
        <p className="budget-success">
          You still have ${remainingBudget.toFixed(2)} remaining this month.
        </p>
      )}
    </section>
  );
}

export default Dashboard;