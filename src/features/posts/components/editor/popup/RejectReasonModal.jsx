import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import "./RejectReasonModal.css";

const MAX_REASON_LENGTH = 500;

export default function RejectReasonModal({
  open,
  loading = false,
  onCancel,
  onConfirm,
}) {
  const [reason, setReason] = useState("");


  if (!open) return null;

  const normalizedReason = reason.trim();

  const handleCancel = () => {
    if (loading) return;
    setReason("");
    onCancel();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!normalizedReason || loading) return;
    onConfirm(normalizedReason);
    setReason("");
  };

  return (
    <div
      className="reject-reason-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          handleCancel();
        }
      }}
    >
      <form
        className="reject-reason-modal"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-reason-title"
      >
        <div className="reject-reason-icon">
          <AlertTriangle size={30} />
        </div>

        <h2 id="reject-reason-title">Từ chối bài viết</h2>
        <p className="reject-reason-description">
          Nhập lý do để người viết biết nội dung cần chỉnh sửa trước khi gửi lại.
        </p>

        <label className="reject-reason-label" htmlFor="reject-reason-input">
          Lý do từ chối <span>*</span>
        </label>

        <textarea
          id="reject-reason-input"
          value={reason}
          onChange={(event) => setReason(event.target.value.slice(0, MAX_REASON_LENGTH))}
          maxLength={MAX_REASON_LENGTH}
          rows={5}
          placeholder="Nhập lý do từ chối..."
          disabled={loading}
          autoFocus
        />

        <div className="reject-reason-counter">
          {reason.length}/{MAX_REASON_LENGTH}
        </div>

        <div className="reject-reason-actions">
          <button
            type="button"
            className="reject-reason-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="reject-reason-confirm"
            disabled={!normalizedReason || loading}
          >
            {loading ? "Đang từ chối..." : "Xác nhận từ chối"}
          </button>
        </div>
      </form>
    </div>
  );
}
