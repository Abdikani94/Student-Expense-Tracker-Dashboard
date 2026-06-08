function SummaryCard({ icon, label, value, note }) {
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>
      <p>{label}</p>
      <h2>{value}</h2>
      <small>{note}</small>
    </div>
  );
}

export default SummaryCard;