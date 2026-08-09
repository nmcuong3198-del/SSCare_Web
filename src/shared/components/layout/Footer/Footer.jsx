import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebookF,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import "./Footer.css";

const productLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Về chúng tôi", to: "/about" },
  { label: "Viết bài", to: "/posts" },
  { label: "Quản lý thông báo", to: "/notifications" },
  { label: "Tải ứng dụng", to: "/download" },
];

const supportLinks = [
  { label: "Điều khoản sử dụng", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Câu hỏi thường gặp", href: "#" },
  { label: "Liên hệ", href: "mailto:admin@sscare.com" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-decoration footer-decoration-left" />
      <div className="footer-decoration footer-decoration-right" />

      <div className="footer-container">
        <section className="footer-brand" aria-label="Giới thiệu SSCare">
          <Link to="/" className="footer-brand-link" aria-label="Về trang chủ SSCare">
            
            <span className="footer-brand-name">SSCare</span>
          </Link>

          <p className="footer-description">
            Đồng hành cùng cha mẹ trong hành trình thấu hiểu, chăm sóc và phát
            triển toàn diện cho trẻ ở tuổi dậy thì.
          </p>

          <p className="footer-slogan">Thấu hiểu để đồng hành</p>

          <div className="footer-social" aria-label="Mạng xã hội của SSCare">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook SSCare"
            >
              <FaFacebookF />
            </a>
          </div>
        </section>

        <nav className="footer-column" aria-label="Sản phẩm">
          <h3>Sản phẩm</h3>
          <div className="footer-link-list">
            {productLinks.map((item) => (
              <Link key={item.to} to={item.to} className="footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav className="footer-column" aria-label="Hỗ trợ">
          <h3>Hỗ trợ</h3>
          <div className="footer-link-list">
            {supportLinks.map((item) => (
              <a key={item.label} href={item.href} className="footer-link">
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section className="footer-column footer-contact" aria-label="Thông tin liên hệ">
          <h3>Liên hệ</h3>

          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <FaMapMarkerAlt />
              </span>
              <span>Hà Nội, Việt Nam</span>
            </div>

            <a href="mailto:admin@sscare.com" className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <FaEnvelope />
              </span>
              <span>admin@sscare.com</span>
            </a>

            <a href="tel:0123456789" className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <FaPhoneAlt />
              </span>
              <span>0123 456 789</span>
            </a>
          </div>
        </section>
      </div>

      <div className="footer-bottom-wrap">
        <div className="footer-bottom">
          <span>© {currentYear} SSCare. All rights reserved.</span>
          <span className="footer-made-with">
            Made with <FaHeart aria-label="yêu thương" /> in Vietnam
          </span>
        </div>
      </div>
    </footer>
  );
}
