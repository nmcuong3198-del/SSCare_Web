import { useState } from "react";
import { FaCheckCircle, FaTimes, FaUserEdit } from "react-icons/fa";

import "./AuthorProfileModal.css";

export default function AuthorProfileModal({ account, saving, onClose, onSave }) {
  const [credentials, setCredentials] = useState(
    account?.authorProfile?.credentials || "",
  );
  const [verified, setVerified] = useState(
    account?.authorProfile?.verified === true,
  );
  const [error, setError] = useState("");

  if (!account) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedCredentials = credentials.trim();

    if (verified && !normalizedCredentials) {
      setError("Vui lòng nhập chức danh/chuyên môn trước khi xác minh chuyên gia.");
      return;
    }

    setError("");
    try {
      await onSave({
        credentials: normalizedCredentials || null,
        verified,
      });
    } catch {
      setError("Không thể lưu hồ sơ tác giả. Vui lòng thử lại.");
    }
  };

  return (
    <div
      className="author-profile-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <form
        className="author-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="author-profile-title"
        onSubmit={handleSubmit}
      >
        <div className="author-profile-modal__header">
          <div className="author-profile-modal__title-wrap">
            <span className="author-profile-modal__icon">
              <FaUserEdit />
            </span>
            <div>
              <h2 id="author-profile-title">Hồ sơ tác giả / chuyên gia</h2>
              <p>Thông tin này được hiển thị cùng tên người viết trên bài viết.</p>
            </div>
          </div>
          <button
            type="button"
            className="author-profile-modal__close"
            onClick={onClose}
            disabled={saving}
            aria-label="Đóng"
          >
            <FaTimes />
          </button>
        </div>

        <div className="author-profile-account-card">
          <div>
            <span>Tài khoản</span>
            <strong>{account.displayName || "-"}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{account.email || "-"}</strong>
          </div>
        </div>

        <div className="author-profile-field">
          <div className="author-profile-label-row">
            <label htmlFor="author-credentials">Chức danh / chuyên môn</label>
            <span>{credentials.length}/255</span>
          </div>
          <textarea
            id="author-credentials"
            value={credentials}
            maxLength={255}
            rows={3}
            onChange={(event) => setCredentials(event.target.value)}
            placeholder="Ví dụ: Bác sĩ chuyên khoa Nhi, Chuyên gia tâm lý tuổi dậy thì..."
            disabled={saving}
          />
          <p className="author-profile-hint">
            Có thể để trống đối với người viết thông thường.
          </p>
        </div>

        <label className="author-verified-option">
          <span className="author-verified-option__content">
            <span className="author-verified-option__check">
              <FaCheckCircle />
            </span>
            <span>
              <strong>Xác minh chuyên gia</strong>
              <small>
                Bật khi Admin đã xác nhận thông tin chuyên môn của tài khoản này.
              </small>
            </span>
          </span>
          <span className="author-verified-switch">
            <input
              type="checkbox"
              checked={verified}
              onChange={(event) => setVerified(event.target.checked)}
              disabled={saving}
            />
            <span />
          </span>
        </label>

        {error && <div className="author-profile-modal__error">{error}</div>}

        <div className="author-profile-modal__actions">
          <button
            type="button"
            className="author-profile-modal__cancel"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="author-profile-modal__save"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}
