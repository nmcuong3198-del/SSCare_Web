import {
  BatteryFull,
  Camera,
  Eye,
  Flashlight,
  LockKeyhole,
  Wifi,
} from "lucide-react";

import logo from "@/assets/brand/logo.png";

import "./NotificationPreview.css";

const capitalizeFirstLetter = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export default function NotificationPreview({ notification }) {
  const now = new Date();
  const formattedContent = notification.content
    ?.replace(/\n{3,}/g, "\n\n")
    .trim();

  const previewTime = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const previewDate = capitalizeFirstLetter(
    new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(now),
  );

  return (
    <section className="preview-card" aria-label="Xem trước thông báo">
      <div className="preview-header">
        <div className="preview-heading">
          <span className="preview-heading-icon" aria-hidden="true">
            <Eye size={18} />
          </span>

          <div>
            <h3>Xem trước</h3>
          </div>
        </div>
      </div>

      <div className="preview-phone-shell">
        <span className="phone-side-button phone-side-button--silent" />
        <span className="phone-side-button phone-side-button--volume-up" />
        <span className="phone-side-button phone-side-button--volume-down" />
        <span className="phone-side-button phone-side-button--power" />

        <div className="preview-phone">
          <div className="phone-wallpaper-glow phone-wallpaper-glow--top" />
          <div className="phone-wallpaper-glow phone-wallpaper-glow--bottom" />

          <div className="phone-status-bar">
            <span className="phone-status-time">{previewTime}</span>

            <div className="phone-status-icons" aria-hidden="true">
              <span className="phone-signal-bars">
                <i />
                <i />
                <i />
                <i />
              </span>
              <Wifi size={15} strokeWidth={2.4} />
              <BatteryFull size={19} strokeWidth={2.1} />
            </div>
          </div>

          <div className="phone-dynamic-island" aria-hidden="true">
            <span />
          </div>

          <div className="phone-lock-heading">
            <LockKeyhole size={15} strokeWidth={2.2} aria-hidden="true" />
            <p>{previewDate}</p>
            <time>{previewTime}</time>
          </div>

          <article className="phone-notification-card">
            <div className="phone-notification-header">
              <div className="phone-app-identity">
                <span className="phone-app-icon">
                  <img src={logo} alt="Logo SSCare" />
                </span>
                <span>SSCare</span>
              </div>

              <span className="phone-notification-time">Vừa xong</span>
            </div>

            <div className="phone-notification-body">
              <h4>{notification.title?.trim() || "Tiêu đề thông báo"}</h4>

              <p className={!formattedContent ? "is-placeholder" : undefined}>
                {formattedContent ||
                  "Nội dung thông báo của bạn sẽ được hiển thị tại đây."}
              </p>
            </div>
          </article>

          <div className="phone-lock-actions" aria-hidden="true">
            <span>
              <Flashlight size={19} fill="currentColor" />
            </span>
            <span>
              <Camera size={20} />
            </span>
          </div>

          <span className="phone-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
