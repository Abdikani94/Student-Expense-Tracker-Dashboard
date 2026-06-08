import {
  LayoutDashboard,
  Wallet,
  ReceiptText,
  TrendingUp,
  Target,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      name: "Dashboard",
      key: "dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Expenses",
      key: "expenses",
      icon: <ReceiptText size={18} />,
    },
    {
      name: "Reports",
      key: "reports",
      icon: <TrendingUp size={18} />,
    },
    {
      name: "Budget",
      key: "budget",
      icon: <Target size={18} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">
          <Wallet size={24} />
        </div>

        <div>
          <h2>ExpensePro</h2>
          <p>Student Finance</p>
        </div>
      </div>

      <nav className="nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${activePage === item.key ? "active" : ""}`}
            onClick={() => setActivePage(item.key)}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;