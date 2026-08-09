import "./CreateNotificationSuccessModal.css";
import { CheckCircle2 } from "lucide-react";

export default function CreateNotificationSuccessModal({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon-wrapper">
          <CheckCircle2
            size={80}
            strokeWidth={2.2}
            className="success-icon"
          />
        </div>

        <h2>Tạo thông báo thành công</h2>

        <p>
          Thông báo mới đã được tạo thành công.
          <br />
          Bạn có thể tiếp tục chỉnh sửa, lưu bản nháp hoặc gửi thông báo.
        </p>

        <button
          className="success-btn"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}