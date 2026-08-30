import "./StatusBadge.css";

export default function StatusBadge({ status }) {

  const config = {
    published: {
      text: "Đã xuất bản",
      className: "published",
    },

    pending: {
      text: "Đang chờ duyệt",
      className: "pending",
    },

    draft: {
      text: "Bản nháp",
      className: "draft",
    },

    rejected: {
      text: "Bị từ chối",
      className: "rejected",
    },

    archived: {
      text: "Lưu trữ",
      className: "archived",
    },
  };

  const current = config[status] || {
    text: "Không xác định",
    className: "unknown",
  };

  return <span className={`status ${current.className}`}>{current.text}</span>;
}
