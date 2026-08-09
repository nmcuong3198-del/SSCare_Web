import "./RecipientCell.css";

export default function RecipientCell({ recipient }) {
  if (!recipient) return "-";

  if (recipient === "ALL" || recipient === "Tất cả") {
    return <span>Tất cả</span>;
  }

  const users = recipient
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const visibleUsers = users.slice(0, 3);
  const remain = users.length - visibleUsers.length;

  return (
    <div className="recipient-list">
      {visibleUsers.map((user) => (
        <span key={user} className="recipient-item">
          {user}
        </span>
      ))}

      {remain > 0 && (
        <span className="recipient-more">
          +{remain}
        </span>
      )}
    </div>
  );
}