import { useEffect } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

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
      <strong>{children}</strong>
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
          <h1 id="app-download-title">Tải ứng dụng SSCare ngay</h1>

          <p id="app-download-description">
            Bắt đầu hành trình đồng hành cùng con tuổi dậy thì!
          </p>
        </header>

        <div className="app-download-options">
          <DownloadOption type="apple" title="App Store" href={APP_STORE_URL} />
          <DownloadOption type="google" title="Google Play" href={GOOGLE_PLAY_URL} />
        </div>
      </section>
    </div>
  );
}
