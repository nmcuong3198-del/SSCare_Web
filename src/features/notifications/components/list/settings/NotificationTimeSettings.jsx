import { useEffect, useMemo, useState } from "react";
import { FaBell, FaChild, FaClock, FaSave } from "react-icons/fa";

import notificationService from "@/features/notifications/services/notificationsService";

import "./NotificationTimeSettings.css";

const EMPTY_SETTINGS = {
  childTime: "",
  otherTime: "",
  timezone: "Asia/Ho_Chi_Minh",
};

const toTimeInput = (value) => (value ? String(value).slice(0, 5) : "");

export default function NotificationTimeSettings() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    notificationService
      .getTimeSettings()
      .then((response) => {
        if (cancelled) return;
        const next = {
          childTime: toTimeInput(response?.childTime),
          otherTime: toTimeInput(response?.otherTime),
          timezone: response?.timezone || "Asia/Ho_Chi_Minh",
        };
        setSettings(next);
        setSavedSettings(next);
      })
      .catch((requestError) => {
        if (cancelled) return;
        console.error("Không thể tải giờ gửi thông báo:", requestError);
        setError("Không thể tải cấu hình giờ gửi.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(
    () =>
      settings.childTime !== savedSettings.childTime ||
      settings.otherTime !== savedSettings.otherTime,
    [settings, savedSettings],
  );

  const updateTime = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const save = async () => {
    if (!settings.childTime || !settings.otherTime) {
      setError("Vui lòng chọn đủ giờ cho cả 2 loại thông báo.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await notificationService.updateTimeSettings({
        childTime: settings.childTime,
        otherTime: settings.otherTime,
      });
      const next = {
        childTime: toTimeInput(response?.childTime),
        otherTime: toTimeInput(response?.otherTime),
        timezone: response?.timezone || settings.timezone,
      };
      setSettings(next);
      setSavedSettings(next);
      setMessage("Đã cập nhật giờ gửi. Cấu hình mới có hiệu lực ngay.");
    } catch (requestError) {
      console.error("Không thể cập nhật giờ gửi thông báo:", requestError);
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="notification-time-settings" aria-labelledby="notification-time-title">
      <div className="notification-time-heading">
        <div className="notification-time-title-wrap">
          <span className="notification-time-icon" aria-hidden="true">
            <FaClock />
          </span>
          <div>
            <h2 id="notification-time-title">Cấu hình giờ gửi tự động</h2>
            <p>
              Chỉ chọn giờ. Ngày và điều kiện gửi của từng thông báo vẫn được hệ thống tự xử lý.
            </p>
          </div>
        </div>
        <span className="notification-time-zone">Múi giờ: {settings.timezone}</span>
      </div>

      <div className="notification-time-grid">
        <label className="notification-time-card">
          <span className="notification-time-card-icon child" aria-hidden="true">
            <FaChild />
          </span>
          <span className="notification-time-copy">
            <strong>Quản lý con</strong>
            <small>Lịch nhắc nhớ và Hành động</small>
          </span>
          <input
            type="time"
            step="60"
            value={settings.childTime}
            disabled={loading || saving}
            onChange={(event) => updateTime("childTime", event.target.value)}
            aria-label="Giờ gửi thông báo Quản lý con"
          />
        </label>

        <label className="notification-time-card">
          <span className="notification-time-card-icon other" aria-hidden="true">
            <FaBell />
          </span>
          <span className="notification-time-copy">
            <strong>Thông báo khác</strong>
            <small>Gợi ý tự động từ SSCare</small>
          </span>
          <input
            type="time"
            step="60"
            value={settings.otherTime}
            disabled={loading || saving}
            onChange={(event) => updateTime("otherTime", event.target.value)}
            aria-label="Giờ gửi Thông báo khác"
          />
        </label>
      </div>

      <div className="notification-time-footer">
        <div className="notification-time-feedback" aria-live="polite">
          {error ? <span className="error">{error}</span> : null}
          {!error && message ? <span className="success">{message}</span> : null}
          {!error && !message ? (
            <span>Thay đổi giờ không cần build hoặc khởi động lại Backend.</span>
          ) : null}
        </div>

        <button
          type="button"
          className="notification-time-save"
          disabled={loading || saving || !dirty}
          onClick={save}
        >
          <FaSave />
          <span>{saving ? "Đang lưu..." : "Lưu giờ gửi"}</span>
        </button>
      </div>
    </section>
  );
}
