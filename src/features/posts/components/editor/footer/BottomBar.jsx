import { ArrowLeft, Check, Eye, Pencil, SendHorizonal, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/authService";

import "./BottomBar.css";

export default function BottomActionBar({
  loading = false,
  onPreview,
  onSubmit,
  onApprove,
  onReject,
  onEdit,
  onSave,
  onCancelEdit,
  canEdit = false,
  isEditing = false,
  readOnly,
}) {
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();

  if (isEditing) {
    return (
      <div className="bottom-bar">
        <button
          type="button"
          className="preview-btn"
          onClick={onPreview}
          disabled={loading}
        >
          <Eye size={18} />
          <span>Xem trước (Preview)</span>
        </button>

        <div className="admin-actions">
          <button
            type="button"
            className="reject-btn"
            onClick={onCancelEdit}
            disabled={loading}
          >
            <X size={18} />
            <span>Huỷ</span>
          </button>

          <button
            type="button"
            className="approve-btn"
            onClick={onSave}
            disabled={loading}
          >
            <Save size={18} />
            <span>{loading ? "Đang lưu..." : "Lưu thay đổi"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-bar">
      <button
        type="button"
        className="preview-btn"
        onClick={onPreview}
        disabled={loading}
      >
        <Eye size={18} />
        <span>Xem trước (Preview)</span>
      </button>

      {canEdit && (
        <button
          type="button"
          className="preview-btn"
          onClick={onEdit}
          disabled={loading}
        >
          <Pencil size={18} />
          <span>Chỉnh sửa</span>
        </button>
      )}

      {isAdmin ? (
        <div className="admin-actions">
          <button
            type="button"
            className="reject-btn"
            onClick={onReject}
            disabled={loading}
          >
            <X size={18} />
            <span>Từ chối</span>
          </button>

          <button
            type="button"
            className="approve-btn"
            onClick={onApprove}
            disabled={loading}
          >
            <Check size={18} />
            <span>Duyệt bài</span>
          </button>
        </div>
      ) : readOnly ? (
        <button
          type="button"
          className="submit-btn"
          onClick={() => navigate("/posts")}
          disabled={loading}
        >
          <ArrowLeft size={18} />
          <span>Trở về</span>
        </button>
      ) : (
        <button
          type="button"
          className="submit-btn"
          onClick={onSubmit}
          disabled={loading}
        >
          <SendHorizonal size={18} />
          <span>{loading ? "Đang gửi..." : "Gửi bài viết"}</span>
        </button>
      )}
    </div>
  );
}
