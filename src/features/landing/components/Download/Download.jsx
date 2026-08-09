import "./Download.css";
import { useEffect, useState } from "react";
import {
  FaApple,
  FaGooglePlay,
  FaShieldAlt,
  FaBolt,
  FaHeart,
  FaChartBar,
} from "react-icons/fa";

import ios from "@/assets/landing/qr.png";
import android from "@/assets/landing/qr.png";
import screen1 from "@/assets/landing/screens/imageDemo1.jpg";
import screen2 from "@/assets/landing/screens/imageDemo2.jpg";
import screen3 from "@/assets/landing/screens/imageDemo3.jpg";
import healthCard from "@/assets/landing/screens/health-card.webp";
import reportCard from "@/assets/landing/screens/report-card.webp";
import actionCard from "@/assets/landing/screens/action-card.webp";

const PHONE_SCREENS = [
  { src: screen1, label: "Trang chủ SSCare" },
  { src: screen2, label: "Theo dõi sức khỏe" },
  { src: screen3, label: "Báo cáo SSCare" },
];

export default function AppDownload() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setCurrentScreen((current) => (current + 1) % PHONE_SCREENS.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="download-section" id="download">
      <div className="download-glow download-glow-left" />
      <div className="download-glow download-glow-right" />
      <div className="download-dots download-dots-top" />
      <div className="download-dots download-dots-bottom" />

      <div className="container download-container">
        <div className="download-content">
          <span className="download-badge">
            <span aria-hidden="true">★</span>
            ỨNG DỤNG SSCare
          </span>

          <h2 className="download-title">
            Tải ứng dụng
            <span>SSCare ngay hôm nay</span>
          </h2>

          <p className="download-description">
            Mang cả thế giới kiến thức và sự hỗ trợ chuyên nghiệp vào ngay trong
            túi của bạn. Theo dõi và chăm sóc gia đình thuận tiện hơn mỗi ngày.
          </p>

          <div className="download-features">
            <div className="download-feature">
              <FaShieldAlt />
              <div>
                <strong>An toàn</strong>
                <span>Bảo mật tuyệt đối</span>
              </div>
            </div>

            <div className="download-feature">
              <FaBolt />
              <div>
                <strong>Nhanh chóng</strong>
                <span>Truy cập mọi lúc</span>
              </div>
            </div>

            <div className="download-feature">
              <FaHeart />
              <div>
                <strong>Hỗ trợ 24/7</strong>
                <span>Đồng hành cùng bạn</span>
              </div>
            </div>

            <div className="download-feature">
              <FaChartBar />
              <div>
                <strong>Hiệu quả</strong>
                <span>Theo dõi dễ dàng</span>
              </div>
            </div>
          </div>

          <div className="download-qr-list">
            <article className="download-qr-card download-qr-card-blue">
              <div className="download-store-title">
                <FaApple />
                <div>
                  <strong>App Store</strong>
                  <span>Quét để tải ứng dụng</span>
                </div>
              </div>
              <div className="download-qr-image">
                <img src={ios} alt="Mã QR tải SSCare trên App Store" />
              </div>
            </article>

            <article className="download-qr-card download-qr-card-green">
              <div className="download-store-title">
                <FaGooglePlay />
                <div>
                  <strong>Google Play</strong>
                  <span>Quét để tải ứng dụng</span>
                </div>
              </div>
              <div className="download-qr-image">
                <img src={android} alt="Mã QR tải SSCare trên Google Play" />
              </div>
            </article>
          </div>
        </div>

        <div
          className="download-visual"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="download-visual-circle" />
          <div className="download-orbit download-orbit-one" />
          <div className="download-orbit download-orbit-two" />

          <article className="download-satellite download-satellite-health">
            <img src={healthCard} alt="Theo dõi sức khỏe" />
          </article>

          <article className="download-satellite download-satellite-report">
            <img src={reportCard} alt="Báo cáo chi tiết" />
          </article>

          <article className="download-satellite download-satellite-action">
            <img src={actionCard} alt="Hành động kịp thời" />
          </article>

          <div className="download-phone-platform" />

          <div className="download-phone-wrap">
            <div className="download-phone-buttons download-phone-buttons-left" />
            <div className="download-phone-buttons download-phone-buttons-right" />

            <div className="download-phone-body">
              <div className="download-phone-island" />
              <div className="download-phone-screen">
                {PHONE_SCREENS.map((screen, index) => (
                  <img
                    key={screen.label}
                    src={screen.src}
                    alt={screen.label}
                    className={index === currentScreen ? "is-active" : ""}
                  />
                ))}
              </div>
              <div className="download-phone-reflection" />
            </div>
          </div>

          <div className="download-screen-dots" aria-label="Chọn màn hình ứng dụng">
            {PHONE_SCREENS.map((screen, index) => (
              <button
                key={screen.label}
                type="button"
                className={index === currentScreen ? "is-active" : ""}
                onClick={() => setCurrentScreen(index)}
                aria-label={`Hiển thị ${screen.label}`}
                aria-pressed={index === currentScreen}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
