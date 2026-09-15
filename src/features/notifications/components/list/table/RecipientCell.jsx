import "./RecipientCell.css";

const ROLE_LABELS = {
  PARENT: "Phụ huynh",
  EXPERT: "Chuyên gia",
  ADMIN: "Quản trị viên",
  CONTENT_EDITOR: "Biên tập nội dung",
  NOTIFICATION_MANAGER: "Quản lý thông báo",
  SUPPORT: "Hỗ trợ",
};

const displayRecipient = (recipient) => {
  const value = String(recipient || "").trim();
  if (!value) return "";
  if (value.toUpperCase() === "ALL") return "Tất cả";

  if (value.toUpperCase().startsWith("ROLE:")) {
    const roleCode = value.slice("ROLE:".length).trim().toUpperCase();
    return ROLE_LABELS[roleCode] || `Nhóm ${roleCode}`;
  }

  return value;
};

export default function RecipientCell({ recipient }) {
  if (!recipient) return "-";

  if (String(recipient).trim().toUpperCase() === "ALL" || recipient === "Tất cả") {
    return <span>Tất cả</span>;
  }

  const users = String(recipient)
    .split(",")
    .map((item) => displayRecipient(item))
    .filter(Boolean);

  const visibleUsers = users.slice(0, 3);
  const remain = users.length - visibleUsers.length;

  return (
    <div className="recipient-list">
      {visibleUsers.map((user, index) => (
        <span key={`${user}-${index}`} className="recipient-item">
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
