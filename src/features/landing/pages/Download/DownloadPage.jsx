import { useEffect } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

import qrCode from "@/assets/landing/qr.png";

import "./DownloadPage.css";

const APP_STORE_URL = import.meta.env.VITE_APP_STORE_URL || "#";
const GOOGLE_PLAY_URL = import.meta.env.VITE_GOOGLE_PLAY_URL || "#";

function StoreButton({ type, href, children }) {
  const isApple = type === "apple";

  const handleClick = (event) => {
    if (href === "#") {
      event.preventDefault();
    }
  };

  return (
    <a
      className="app-download-store-button"
      href={href}
      target={href === "#" ? undefined : "_blank"}
      rel={href === "#" ? undefined : "noreferrer"}
      onClick={handleClick}
      aria-label={isApple ? "Mở SSCare trên App Store" : "Mở SSCare trên Google Play"}
    >
      {isApple ? <FaApple aria-hidden="true" /> : <FaGooglePlay aria-hidden="true" />}
      <span>
        <small>{isApple ? "DOWNLOAD ON THE" : "GET IT ON"}</small>
        <strong>{children}</strong>
      </span>
    </a>
  );
}

function DownloadOption({ type, title, href }) {
  const isApple = type === "apple";

  return (
    <article className="app-download-option">
      <div className={`app-download-qr-card ${isApple ? "is-apple" : "is-google"}`}>
        <div className="app-download-qr-artwork">
          <img src={qrCode} alt={`Mã QR tải SSCare trên ${title}`} />
          <span className="app-download-qr-logo" aria-hidden="true">
            {isApple ? <FaApple /> : <FaGooglePlay />}
          </span>
        </div>
        <span className="app-download-qr-caption">
          {isApple ? "Download on the App Store" : "Google Play Store"}
        </span>
      </div>

      <p className="app-download-option-title">
        {isApple ? "Dành cho Apple Store" : "Dành cho CH Play"}
      </p>

      <StoreButton type={type} href={href}>
        {title}
      </StoreButton>
    </article>
  );
}

export default function DownloadPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="download-page">
      <section
        className="app-download-page-card"
        aria-labelledby="app-download-title"
        aria-describedby="app-download-description"
      >
        <header className="app-download-header">
          <span className="app-download-official-badge">
            <FiCheckCircle aria-hidden="true" />
            Ứng dụng chính thức
          </span>

          <h1 id="app-download-title">
            Tải ứng dụng SSCare
            <span>ngay</span>
          </h1>

          <p id="app-download-description">
            Bắt đầu hành trình kết nối và phát triển cùng gia đình bạn.
          </p>
        </header>

        <div className="app-download-options">
          <DownloadOption type="apple" title="App Store" href={APP_STORE_URL} />
          <DownloadOption type="google" title="Google Play" href={GOOGLE_PLAY_URL} />
        </div>

        <footer className="app-download-quote">
          “SSCare: Đồng hành cùng gia đình bạn trên hành trình trưởng thành.”
        </footer>
      </section>
    </div>
  );
}
