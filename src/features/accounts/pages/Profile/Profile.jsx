import { useEffect, useMemo, useState } from "react";
import {
  FaBirthdayCake,
  FaChevronRight,
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaPen,
  FaPhone,
  FaTimes,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import authService from "@/features/auth/services/authService";
import authStorage from "@/shared/services/auth/authStorage";
import { getApiErrorMessage } from "@/shared/utils/apiError";

import "./Profile.css";

const ROLE_OPTIONS = [
  { value: "FATHER", label: "Bố" },
  { value: "MOTHER", label: "Mẹ" },
  { value: "GUARDIAN", label: "Người giám hộ khác" },
];

const FULL_NAME_PATTERN = /^[\p{L}\p{M} ]+$/u;
const INVALID_FULL_NAME_CHAR_PATTERN = /[^\p{L}\p{M} ]/gu;

const relationLabel = (code) =>
  ROLE_OPTIONS.find((item) => item.value === code)?.label || "Người giám hộ khác";

const dateToInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const formatDate = (value) => {
  const date = dateToInput(value);
  if (!date) return "—";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const todayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeProfile = (profile) => ({
  ...profile,
  fullName: profile?.fullName || profile?.displayName || "",
  displayName: profile?.displayName || profile?.fullName || "",
  parentRelationCode: profile?.parentRelationCode || "GUARDIAN",
  dateOfBirth: dateToInput(profile?.dateOfBirth),
  email: profile?.email || "",
  phone: profile?.phone || "",
});

const getEditLimitStorageKey = () => {
  const loginAt = authStorage.getItem(authStorage.keys.loginAt) || "current";
  return `sscare:profile-edit-limits:${loginAt}`;
};

const readEditLimits = () => {
  try {
    return JSON.parse(sessionStorage.getItem(getEditLimitStorageKey()) || "{}") || {};
  } catch {
    return {};
  }
};

const saveEditLimits = (limits) => {
  sessionStorage.setItem(getEditLimitStorageKey(), JSON.stringify(limits));
};

export default function Profile() {
  const [profile, setProfile] = useState(() => normalizeProfile(authService.getCurrentUser()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [editLimits, setEditLimits] = useState(readEditLimits);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let cancelled = false;

    authService
      .getProfile()
      .then((response) => {
        if (!cancelled) {
          setProfile(normalizeProfile(response));
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(
            getApiErrorMessage(
              error,
              "Không thể tải thông tin tài khoản. Vui lòng thử lại.",
            ),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const avatarInitial = useMemo(() => {
    const name = profile?.displayName?.trim();
    return name ? name.charAt(0).toUpperCase() : "?";
  }, [profile?.displayName]);

  const canEditRole = !editLimits.role;
  const canEditBirthDate = !editLimits.dateOfBirth;

  const openEditor = (field) => {
    if (field === "role" && !canEditRole) {
      toast("Vai trò đã được thay đổi trong phiên đăng nhập này.");
      return;
    }
    if (field === "dateOfBirth" && !canEditBirthDate) {
      toast("Ngày sinh đã được thay đổi trong phiên đăng nhập này.");
      return;
    }

    const values = {
      displayName: profile.displayName,
      fullName: profile.fullName,
      role: profile.parentRelationCode,
      dateOfBirth: profile.dateOfBirth,
    };
    setEditField(field);
    setEditValue(values[field] || "");
    setEditError("");
  };

  const closeEditor = () => {
    if (saving) return;
    setEditField(null);
    setEditError("");
  };

  const validateEdit = () => {
    const value = editValue.trim();

    if (editField === "displayName") {
      if (!value) return "Vui lòng nhập tên hiển thị.";
      if (value.length > 100) return "Tên hiển thị tối đa 100 ký tự.";
    }

    if (editField === "fullName") {
      if (!value) return "Vui lòng nhập họ và tên.";
      if (value.length > 100) return "Họ và tên tối đa 100 ký tự.";
      if (!FULL_NAME_PATTERN.test(value)) {
        return "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
      }
    }

    if (editField === "role" && !ROLE_OPTIONS.some((item) => item.value === editValue)) {
      return "Vui lòng chọn vai trò.";
    }

    if (editField === "dateOfBirth") {
      if (!editValue) return "Vui lòng chọn ngày sinh.";
      if (editValue < "1900-01-01" || editValue > todayKey()) {
        return "Ngày sinh phải từ 01/01/1900 đến ngày hiện tại.";
      }
    }

    return "";
  };

  const saveEditor = async () => {
    const validationError = validateEdit();
    if (validationError) {
      setEditError(validationError);
      return;
    }

    const nextProfile = {
      ...profile,
      displayName:
        editField === "displayName" ? editValue.trim() : profile.displayName,
      fullName: editField === "fullName" ? editValue.trim() : profile.fullName,
      parentRelationCode: editField === "role" ? editValue : profile.parentRelationCode,
      dateOfBirth: editField === "dateOfBirth" ? editValue : profile.dateOfBirth,
    };

    const unchanged =
      nextProfile.displayName === profile.displayName &&
      nextProfile.fullName === profile.fullName &&
      nextProfile.parentRelationCode === profile.parentRelationCode &&
      nextProfile.dateOfBirth === profile.dateOfBirth;

    if (unchanged) {
      closeEditor();
      return;
    }

    setSaving(true);
    setEditError("");

    try {
      const updated = normalizeProfile(await authService.updateProfile(nextProfile));
      setProfile(updated);

      if (editField === "role" || editField === "dateOfBirth") {
        const nextLimits = {
          ...editLimits,
          [editField === "role" ? "role" : "dateOfBirth"]: true,
        };
        setEditLimits(nextLimits);
        saveEditLimits(nextLimits);
      }

      setEditField(null);
      toast.success("Cập nhật tài khoản thành công.");
    } catch (error) {
      setEditError(
        getApiErrorMessage(
          error,
          "Không thể cập nhật tài khoản. Vui lòng thử lại.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const closePasswordModal = () => {
    if (passwordSaving) return;
    setPasswordOpen(false);
    setPasswordError("");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const updatePasswordField = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
    setPasswordError("");
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (
      newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ cái và chữ số.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    setPasswordSaving(true);
    setPasswordError("");

    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      if (response?.account) {
        setProfile(normalizeProfile(response.account));
      }
      setPasswordOpen(false);
      setPasswordError("");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Đã đổi mật khẩu.");
    } catch (error) {
      const code = error?.response?.data?.code;
      setPasswordError(
        code === "AUTH_CURRENT_PASSWORD_INVALID"
          ? "Mật khẩu hiện tại không chính xác."
          : getApiErrorMessage(
              error,
              "Không thể đổi mật khẩu. Vui lòng thử lại.",
            ),
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Đang tải thông tin tài khoản...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page-heading">
        <div>
          <span className="profile-eyebrow">Tài khoản của bạn</span>
          <h1>Quản lý tài khoản</h1>
          <p>Cập nhật thông tin cá nhân đồng bộ với tài khoản đang sử dụng trên ứng dụng SSCare.</p>
        </div>
      </div>

      {loadError && <div className="profile-alert profile-alert--error">{loadError}</div>}

      <section className="profile-section" aria-labelledby="account-information-title">
        <h2 id="account-information-title">Thông tin tài khoản</h2>

        <div className="profile-card">
          <div className="profile-identity-row">
            <div className="profile-avatar" aria-hidden="true">{avatarInitial}</div>
            <div className="profile-identity-copy">
              <strong>{profile.displayName || "Người dùng"}</strong>
              <span>Tên hiển thị</span>
            </div>
            <button
              type="button"
              className="profile-icon-button"
              aria-label="Sửa tên hiển thị"
              onClick={() => openEditor("displayName")}
            >
              <FaPen />
            </button>
          </div>

          <div className="profile-divider" />

          <ProfileRow
            icon={<FaUser />}
            label="Họ và tên"
            value={profile.fullName || "—"}
            onEdit={() => openEditor("fullName")}
          />
          <ProfileRow
            icon={<FaIdBadge />}
            label="Vai trò"
            value={relationLabel(profile.parentRelationCode)}
            onEdit={canEditRole ? () => openEditor("role") : null}
            disabledHint="Vai trò đã được thay đổi trong phiên đăng nhập này"
          />
          <ProfileRow
            icon={<FaBirthdayCake />}
            label="Ngày sinh"
            value={formatDate(profile.dateOfBirth)}
            onEdit={canEditBirthDate ? () => openEditor("dateOfBirth") : null}
            disabledHint="Ngày sinh đã được thay đổi trong phiên đăng nhập này"
          />
          <ProfileRow icon={<FaEnvelope />} label="Email" value={profile.email || "—"} />
          <ProfileRow icon={<FaPhone />} label="Số điện thoại" value={profile.phone || "—"} />
        </div>

        <button
          type="button"
          className="profile-password-card"
          onClick={() => {
            setPasswordError("");
            setPasswordOpen(true);
          }}
        >
          <span className="profile-password-icon"><FaLock /></span>
          <span className="profile-password-copy">
            <strong>Thay đổi mật khẩu</strong>
            <small>Cập nhật mật khẩu đăng nhập của tài khoản</small>
          </span>
          <FaChevronRight className="profile-password-chevron" />
        </button>
      </section>

      {editField && (
        <EditProfileModal
          field={editField}
          value={editValue}
          error={editError}
          saving={saving}
          onChange={(value) => {
            const nextValue =
              editField === "fullName"
                ? value.replace(INVALID_FULL_NAME_CHAR_PATTERN, "").slice(0, 100)
                : editField === "displayName"
                  ? value.slice(0, 100)
                  : value;
            setEditValue(nextValue);
            setEditError("");
          }}
          onClose={closeEditor}
          onSave={saveEditor}
        />
      )}

      {passwordOpen && (
        <PasswordModal
          form={passwordForm}
          error={passwordError}
          saving={passwordSaving}
          onChange={updatePasswordField}
          onClose={closePasswordModal}
          onSubmit={submitPassword}
        />
      )}
    </div>
  );
}

function ProfileRow({ icon, label, value, onEdit, disabledHint }) {
  return (
    <div className="profile-info-row">
      <span className="profile-info-icon">{icon}</span>
      <div className="profile-info-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      {onEdit ? (
        <button
          type="button"
          className="profile-row-edit"
          aria-label={`Sửa ${label.toLowerCase()}`}
          onClick={onEdit}
        >
          <FaPen />
        </button>
      ) : disabledHint ? (
        <span className="profile-row-edit profile-row-edit--disabled" title={disabledHint}>
          <FaPen />
        </span>
      ) : null}
    </div>
  );
}

function EditProfileModal({ field, value, error, saving, onChange, onClose, onSave }) {
  const config = {
    displayName: {
      title: "Sửa tên hiển thị",
      label: "Tên hiển thị",
      help: "Tên hiển thị tối đa 100 ký tự.",
    },
    fullName: {
      title: "Sửa họ và tên",
      label: "Họ và tên",
      help: "Tối đa 100 ký tự, chỉ gồm chữ cái và khoảng trắng.",
    },
    role: {
      title: "Sửa vai trò",
      label: "Vai trò",
      help: "Vai trò chỉ được thay đổi 1 lần trong mỗi phiên đăng nhập.",
    },
    dateOfBirth: {
      title: "Chọn ngày sinh",
      label: "Ngày sinh",
      help: "Ngày sinh chỉ được thay đổi 1 lần trong mỗi phiên đăng nhập.",
    },
  }[field];

  const handleKeyDown = (event) => {
    if (event.key === "Escape") onClose();
    if (event.key === "Enter" && field !== "role" && !saving) onSave();
  };

  return (
    <div className="profile-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <span><FaUserCircle /></span>
            <div>
              <h2 id="profile-edit-title">{config.title}</h2>
              <p>{config.help}</p>
            </div>
          </div>
          <button type="button" aria-label="Đóng" onClick={onClose} disabled={saving}>
            <FaTimes />
          </button>
        </div>

        <div className="profile-modal-body">
          <label className="profile-modal-field">
            <span>{config.label}</span>
            {field === "role" ? (
              <select value={value} onChange={(event) => onChange(event.target.value)} autoFocus>
                {ROLE_OPTIONS.map((item) => (
                  <option value={item.value} key={item.value}>{item.label}</option>
                ))}
              </select>
            ) : field === "dateOfBirth" ? (
              <input
                type="date"
                value={value}
                min="1900-01-01"
                max={todayKey()}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={value}
                maxLength={100}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            )}
          </label>

          {error && <div className="profile-modal-error">{error}</div>}
        </div>

        <div className="profile-modal-actions">
          <button type="button" className="profile-modal-cancel" onClick={onClose} disabled={saving}>
            Huỷ
          </button>
          <button type="button" className="profile-modal-save" onClick={onSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ form, error, saving, onChange, onClose, onSubmit }) {
  return (
    <div className="profile-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form className="profile-modal profile-password-modal" role="dialog" aria-modal="true" onSubmit={onSubmit}>
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <span><FaLock /></span>
            <div>
              <h2>Thay đổi mật khẩu</h2>
              <p>Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ cái và chữ số.</p>
            </div>
          </div>
          <button type="button" aria-label="Đóng" onClick={onClose} disabled={saving}>
            <FaTimes />
          </button>
        </div>

        <div className="profile-modal-body profile-password-fields">
          <label className="profile-modal-field">
            <span>Mật khẩu hiện tại</span>
            <input
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(event) => onChange("currentPassword", event.target.value)}
              autoFocus
            />
          </label>
          <label className="profile-modal-field">
            <span>Mật khẩu mới</span>
            <input
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(event) => onChange("newPassword", event.target.value)}
            />
          </label>
          <label className="profile-modal-field">
            <span>Xác nhận mật khẩu mới</span>
            <input
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => onChange("confirmPassword", event.target.value)}
            />
          </label>

          {error && <div className="profile-modal-error">{error}</div>}
        </div>

        <div className="profile-modal-actions">
          <button type="button" className="profile-modal-cancel" onClick={onClose} disabled={saving}>
            Huỷ
          </button>
          <button type="submit" className="profile-modal-save" disabled={saving}>
            {saving ? "Đang cập nhật..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}
