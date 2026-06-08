import { Search, Filter, Pencil, Trash2 } from "lucide-react";

function ExpenseTable({
  expenses,
  categories,
  paymentMethods,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterPayment,
  setFilterPayment,
  sortOrder,
  setSortOrder,
  startEdit,
  deleteExpense,
  clearFilters,
}) {
  return (
    <section className="panel">
      <div className="expense-top">
        <div>
          <h2>Expense Records</h2>
          <p>Search, filter, edit, and delete your saved expenses.</p>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search expense title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option>All</option>
          {paymentMethods.map((method) => (
            <option key={method}>{method}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        <button className="clear-btn" onClick={clearFilters}>
          <Filter size={16} />
          Clear
        </button>
      </div>

      {expenses.length === 0 ? (
        <p className="empty">No expenses found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.title}</td>
                  <td>${Number(expense.amount).toFixed(2)}</td>
                  <td>
                    <span className="badge">{expense.category}</span>
                  </td>
                  <td>{expense.paymentMethod || "Cash"}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.notes || "No notes"}</td>
                  <td>
                    <div className="action-row">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(expense)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteExpense(expense._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ExpenseTable;