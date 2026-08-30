import {
  ArrowLeft,
  Check,
  Eye,
  Pencil,
  SendHorizonal,
  Save,
  Undo2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/authService";

import "./BottomBar.css";

function PreviewButton({ loading, onPreview }) {
  return (
    <button
      type="button"
      className="preview-btn"
      onClick={onPreview}
      disabled={loading}
    >
      <Eye size={18} />
      <span>Xem trước (Preview)</span>
    </button>
  );
}

function BackButton({ loading }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="preview-btn"
      onClick={() => navigate("/posts")}
      disabled={loading}
    >
      <ArrowLeft size={18} />
      <span>Trở về</span>
    </button>
  );
}

export default function BottomActionBar({
  loading = false,
  onPreview,
  onSubmit,
  onSaveDraft,
  onApprove,
  onReject,
  onRevoke,
  onEdit,
  onSave,
  onCancelEdit,
  canEdit = false,
  isEditing = false,
  isExisting = false,
  articleStatus,
}) {
  const isAdmin = authService.isAdmin();
  const isDraft = articleStatus === "draft";
  const isRejected = articleStatus === "rejected";
  const isPending = articleStatus === "pending";
  const isPublished = articleStatus === "published";

  // Đang chỉnh sửa: phải lưu lại trước, không cho gửi thẳng khi còn thay đổi chưa lưu.
  if (isEditing) {
    return (
      <div className="bottom-bar">
        <PreviewButton loading={loading} onPreview={onPreview} />

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

  // Tạo mới: chỉ được lưu trước. Sau khi đã có mã bài mới xuất hiện nút gửi.
  if (!isExisting) {
    return (
      <div className="bottom-bar">
        <PreviewButton loading={loading} onPreview={onPreview} />

        <button
          type="button"
          className="save-draft-btn"
          onClick={onSaveDraft}
          disabled={loading}
        >
          <Save size={18} />
          <span>{loading ? "Đang lưu..." : "Lưu bài viết"}</span>
        </button>
      </div>
    );
  }

  // Admin chỉ review bài đã gửi, không chỉnh sửa nội dung bài pending.
  if (isAdmin) {
    return (
      <div className="bottom-bar">
        <PreviewButton loading={loading} onPreview={onPreview} />

        <div className="admin-actions">
          <BackButton loading={loading} />

          {isPending && (
            <>
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
            </>
          )}

          {isPublished && (
            <button
              type="button"
              className="revoke-btn"
              onClick={onRevoke}
              disabled={loading}
            >
              <Undo2 size={18} />
              <span>{loading ? "Đang thu hồi..." : "Thu hồi bài viết"}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Người viết mở bài nháp: Preview + Chỉnh sửa + Gửi bài viết.
  if (isDraft) {
    return (
      <div className="bottom-bar">
        <PreviewButton loading={loading} onPreview={onPreview} />

        <div className="writer-actions">
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

          <button
            type="button"
            className="submit-btn"
            onClick={onSubmit}
            disabled={loading}
          >
            <SendHorizonal size={18} />
            <span>{loading ? "Đang gửi..." : "Gửi bài viết"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Bài bị từ chối vẫn được chỉnh sửa hoặc gửi lại.
  if (isRejected) {
    return (
      <div className="bottom-bar">
        <PreviewButton loading={loading} onPreview={onPreview} />

        <div className="writer-actions">
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

          <button
            type="button"
            className="submit-btn"
            onClick={onSubmit}
            disabled={loading}
          >
            <SendHorizonal size={18} />
            <span>{loading ? "Đang gửi..." : "Gửi lại bài viết"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Pending/published/archived: người viết chỉ được xem trước và trở về.
  return (
    <div className="bottom-bar">
      <PreviewButton loading={loading} onPreview={onPreview} />
      <BackButton loading={loading} />
    </div>
  );
}
