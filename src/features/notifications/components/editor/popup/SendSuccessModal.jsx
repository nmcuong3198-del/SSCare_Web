import "./SendSuccessModal.css";
import { Check, Calendar } from "lucide-react";

export default function SendSuccessModal({
  open,
  onClose,
  onBackToList,
  updatedAt,
}) {
  if (!open) return null;

  const formatUpdateTime = (isoString) => {
    if (!isoString) return "Vừa xong";

    try {
      const dateObj = new Date(isoString);

      // Lấy giờ và phút (Thêm số 0 phía trước nếu < 10)
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}`;

      // So sánh ngày để hiển thị "Hôm nay" hoặc Ngày/Tháng
      const today = new Date();
      const isToday =
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear();

      if (isToday) {
        return `${timeStr} Hôm nay`;
      } else {
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        return `${timeStr} ${day}/${month}/${dateObj.getFullYear()}`;
      }
    } catch {
      return "Vừa xong"; // Fallback nếu chuỗi không hợp lệ
    }
  };

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon-outer">
          <div className="success-icon-inner">
            <Check size={20} strokeWidth={4} className="success-icon-tick" />
          </div>
        </div>

        <h2 className="success-modal-title">Gửi thông báo thành công</h2>

        <p className="success-modal-desc">
          Thông báo của bạn đã được gửi đến danh sách người dùng được chỉ định.
          Quý phụ huynh và học sinh sẽ nhận được cập nhật ngay lập tức.
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
          <span>Cập nhật lúc: {formatUpdateTime(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
