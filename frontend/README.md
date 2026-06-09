# Student Expense Tracker Dashboard

A modern full-stack expense tracking dashboard built for students to manage monthly budgets, record daily expenses, analyze spending habits, and control personal finances.

This project is designed as a practical portfolio project to demonstrate full-stack development skills using React, Node.js, Express, MongoDB, and data visualization.

---

## Project Overview

The Student Expense Tracker Dashboard helps students track where their money goes each month. Users can set a monthly budget, add expenses, edit or delete records, search and filter transactions, and view spending analytics through charts.

The system also prevents users from adding expenses that exceed their remaining monthly budget.

---

## Features

### Dashboard
- Modern sidebar navigation
- Overview summary cards
- Total spending calculation
- Highest expense tracking
- Top spending category
- MongoDB connection status display

### Expense Management
- Add new expenses
- Edit existing expenses
- Delete expenses
- Search expenses by title
- Filter by category
- Filter by payment method
- Sort by newest, oldest, highest amount, and lowest amount

### Budget Control
- Set monthly budget
- Automatically deduct expenses from budget
- Show remaining balance
- Show budget usage progress bar
- Prevent expenses above remaining budget
- Save monthly budget using browser local storage

### Reports and Analytics
- Spending by category chart
- Pie chart visualization
- Total spending report
- Highest expense report
- Top category report

---

## Tech Stack

### Frontend
- React
- Vite
- CSS
- Axios
- Recharts
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Dotenv

### Tools
- MongoDB Compass
- Git
- GitHub
- VS Code

---

## Project Structure

```bash
Student Expense Tracker Dashboard/
│
├── backend/
│   ├── controllers/
│   │   └── expenseController.js
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   └── expenseRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseCharts.jsx
│   │   │   └── ExpenseTable.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│   └── dashboard.png
│
├── .gitignore
└── README.md