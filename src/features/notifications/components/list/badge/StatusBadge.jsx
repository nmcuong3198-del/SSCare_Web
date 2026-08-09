import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  const config = {
    published: {
      text: "Đã gửi",
      className: "published",
    },

    draft: {
      text: "Bản nháp",
      className: "draft",
    },
  };

  const current = config[status] || {
    text: status,
    className: "default",
  };

  return (
    <span className={`notification-status ${current.className}`}>
      <span className="status-dot"></span>

      {current.text}
    </span>
  );
}
