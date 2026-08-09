import "./SaveDraftSuccessModal.css";
import { CheckCircle2 } from "lucide-react";

export default function SaveDraftSuccessModal({
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

        <h2>Cập nhật thông báo thành công</h2>

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