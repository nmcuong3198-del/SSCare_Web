import { Calendar, Check } from "lucide-react";
import "./SendSuccessModal.css";

export default function SendSuccessModal({
  open,
  onClose,
  onBackToList,
  updatedAt,
  status,
  scheduleTime,
}) {
  if (!open) return null;

  const isScheduled = status === "scheduled";

  const formatTime = (isoString) => {
    if (!isoString) return "Vừa xong";
    const dateObj = new Date(isoString);
    if (Number.isNaN(dateObj.getTime())) return "Vừa xong";

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${hours}:${minutes} ${day}/${month}/${dateObj.getFullYear()}`;
  };

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon-outer">
          <div className="success-icon-inner">
            <Check size={20} strokeWidth={4} className="success-icon-tick" />
          </div>
        </div>

        <h2 className="success-modal-title">
          {isScheduled ? "Đã lên lịch gửi thông báo" : "Gửi thông báo thành công"}
        </h2>

        <p className="success-modal-desc">
          {isScheduled
            ? `Thông báo sẽ được backend tự động gửi tới người dùng vào ${formatTime(scheduleTime)}.`
            : "Thông báo đã được gửi qua Firebase tới các thiết bị Android/iOS đang hoạt động của người nhận."}
        </p>

        <div className="success-modal-actions">
          <button className="success-btn btn-primary" onClick={onBackToList}>
            Quay lại danh sách
          </button>

          <button className="success-btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>

        <hr className="success-modal-divider" />

        <div className="success-modal-footer">
          <Calendar size={14} className="calendar-icon" />
          <span>
            {isScheduled
              ? `Lịch gửi: ${formatTime(scheduleTime)}`
              : `Cập nhật lúc: ${formatTime(updatedAt)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
