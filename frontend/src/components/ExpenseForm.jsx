import { PlusCircle } from "lucide-react";

function ExpenseForm({
  form,
  editingId,
  categories,
  paymentMethods,
  handleChange,
  handleSubmit,
  resetForm,
}) {
  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="panel-header">
        <div>
          <h2>{editingId ? "Edit Expense" : "Add New Expense"}</h2>
          <p>Record your daily student spending.</p>
        </div>

        <PlusCircle size={22} color="#2563eb" />
      </div>

      <div className="form-grid">
        <input
          name="title"
          placeholder="Expense title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          {paymentMethods.map((method) => (
            <option key={method}>{method}</option>
          ))}
        </select>

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      <button className="primary-btn" type="submit">
        {editingId ? "Update Expense" : "Save Expense"}
      </button>

      {editingId && (
        <button className="secondary-btn" type="button" onClick={resetForm}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default ExpenseForm;