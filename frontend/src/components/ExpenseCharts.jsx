import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const pieColors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#db2777",
  "#4f46e5",
];

function ExpenseCharts({ chartData }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Spending Analytics</h2>
          <p>Category-based expense breakdown.</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <p className="empty">Add expenses to see analytics.</p>
      ) : (
        <>
          <div className="chart-box">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box small">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseCharts;