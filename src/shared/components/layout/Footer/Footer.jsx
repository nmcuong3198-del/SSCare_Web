import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFileAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import socialNetworkLicense from "@/assets/brand/social-network-license.png";
import "./Footer.css";

const footerLinks = [
  { label: "Về chúng tôi", to: "/about" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Điều khoản sử dụng", href: "#" },
  { label: "Liên hệ", href: "mailto:sscarevn@gmail.com" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="footer">
        <div className="footer-decoration footer-decoration-left" />
        <div className="footer-decoration footer-decoration-right" />

        <div className="footer-container">
          <div className="footer-main">
            <section className="footer-company" aria-label="Thông tin Công ty SSCare">
              <Link to="/" className="footer-brand-link" aria-label="Về trang chủ SSCare">
                <span className="footer-brand-ss">SS</span>
                <span className="footer-brand-care">Care</span>
                <span className="footer-brand-sparkle" aria-hidden="true">✦</span>
              </Link>

              <h2 className="footer-company-name">Công ty Cổ phần Dịch vụ SSCare</h2>

              <div className="footer-company-info">
                <div className="footer-info-row">
                <span className="footer-info-icon" aria-hidden="true">
                  <FaFileAlt />
                </span>
                  <span>
                  Mã số doanh nghiệp/MST: <strong>0111554606</strong>
                  <span className="footer-info-separator"> – </span>
                  Đăng ký lần đầu: <strong>01/07/2026</strong>
                </span>
                </div>

                <div className="footer-info-row">
                <span className="footer-info-icon" aria-hidden="true">
                  <FaShieldAlt />
                </span>
                  <span>
                  Cơ quan cấp: Phòng Đăng ký kinh doanh và Tài chính doanh nghiệp
                </span>
                </div>

                <div className="footer-info-row">
                <span className="footer-info-icon" aria-hidden="true">
                  <FaMapMarkerAlt />
                </span>
                  <span>Số 232, Dãy C13, Tổ 1, Phường Long Biên, Hà Nội</span>
                </div>

                <a href="mailto:sscarevn@gmail.com" className="footer-info-row footer-info-link">
                <span className="footer-info-icon" aria-hidden="true">
                  <FaEnvelope />
                </span>
                  <span>
                  Email: <strong>sscarevn@gmail.com</strong>
                </span>
                </a>

                <div className="footer-info-row">
                <span className="footer-info-icon" aria-hidden="true">
                  <FaPhoneAlt />
                </span>
                  <span>Số điện thoại: Đang cập nhật</span>
                </div>

                <div className="footer-info-row">
                <span className="footer-info-icon" aria-hidden="true">
                  <FaUser />
                </span>
                  <span>
                  Người chịu trách nhiệm quản lý nội dung: <strong>Nguyễn Thị Hương</strong>
                </span>
                </div>
              </div>
            </section>

            <section className="footer-right" aria-label="Thông tin cấp phép và liên kết">
              <div className="footer-license-card">
                <div className="footer-license-heading">
                <span className="footer-license-icon" aria-hidden="true">
                  <FaShieldAlt />
                </span>

                  <div>
                    <h3>THÔNG TIN CẤP PHÉP</h3>
                    <p>Giấy phép số: [Đang cập nhật]</p>
                  </div>
                </div>

                <div className="footer-license-badge-panel">
                  <img
                      src={socialNetworkLicense}
                      alt="Biểu tượng Đã cấp phép mạng xã hội"
                      className="footer-license-badge"
                  />
                </div>
              </div>

              <nav className="footer-quick-links" aria-label="Liên kết chân trang">
                {footerLinks.map((item, index) => (
                    <span className="footer-quick-link-wrap" key={item.label}>
                  {item.to ? (
                      <Link to={item.to} className="footer-quick-link">
                        {item.label}
                      </Link>
                  ) : (
                      <a href={item.href} className="footer-quick-link">
                        {item.label}
                      </a>
                  )}

                      {index < footerLinks.length - 1 && (
                          <span className="footer-link-dot" aria-hidden="true">•</span>
                      )}
                </span>
                ))}
              </nav>
            </section>
          </div>

          <div className="footer-bottom">
          <span>
            © {currentYear} Công ty Cổ phần Dịch vụ SSCare. All rights reserved.
          </span>
          </div>

          <p className="footer-testing-notice">
            <strong>
              Website đang trong quá trình kiểm thử. SSCare cam kết hoạt động đúng theo quy định của pháp luật!
            </strong>
          </p>
        </div>
      </footer>
  );
}
