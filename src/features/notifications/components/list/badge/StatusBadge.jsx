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

    scheduled: {
      text: "Đã lên lịch",
      className: "draft",
    },

    sending: {
      text: "Đang gửi",
      className: "draft",
    },

    failed: {
      text: "Gửi lỗi",
      className: "default",
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
