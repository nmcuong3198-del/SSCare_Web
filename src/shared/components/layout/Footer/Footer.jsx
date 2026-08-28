import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebookF,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import socialNetworkLicense from "@/assets/brand/social-network-license-clean.png";
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
  { label: "Liên hệ", href: "mailto:sscarevn@gmail.com" },
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
                <span>Số 232, Dãy C13, Tổ 1, Phường Long Biên, Hà Nội</span>
              </div>

              <a href="mailto:sscarevn@gmail.com" className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <FaEnvelope />
              </span>
                <span>sscarevn@gmail.com</span>
              </a>

              <div className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <FaPhoneAlt />
              </span>
                <span>Số điện thoại: Đang cập nhật</span>
              </div>
            </div>
          </section>

          <section className="footer-legal" aria-label="Thông tin pháp lý SSCare">
            <h3>Thông tin doanh nghiệp</h3>

            <div className="footer-legal-grid">
              <div className="footer-legal-card">
                <p className="footer-legal-company">Công ty Cổ phần Dịch vụ SSCare</p>
                <p>
                  <span>Mã số doanh nghiệp/MST:</span> 0111554606
                </p>
                <p>
                  <span>Đăng ký lần đầu:</span> 01/07/2026
                </p>
                <p>
                  <span>Cơ quan cấp:</span> Phòng Đăng ký kinh doanh và Tài chính doanh nghiệp
                </p>
              </div>

              <div className="footer-legal-card">
                <p>
                  <span>Địa chỉ:</span> Số 232, Dãy C13, Tổ 1, Phường Long Biên, Hà Nội
                </p>
                <p>
                  <span>Email:</span>{" "}
                  <a href="mailto:sscarevn@gmail.com">sscarevn@gmail.com</a>
                </p>
                <p>
                  <span>Số điện thoại:</span> Đang cập nhật
                </p>
              </div>

              <div className="footer-legal-card">
                <p className="footer-legal-owner">
                  <span>Người chịu trách nhiệm quản lý nội dung:</span> Nguyễn Thị Hương
                </p>

                <div className="footer-license">
                  <span className="footer-license-title">Thông tin cấp phép mạng xã hội</span>

                  <div className="footer-license-badge-panel">
                    <img
                        src={socialNetworkLicense}
                        alt="Biểu tượng cấp phép mạng xã hội"
                        className="footer-license-badge"
                    />
                  </div>

                  <p className="footer-license-summary">
                    <span>Số giấy phép, ngày cấp, cơ quan cấp:</span> Sẽ bổ sung sau khi được cấp.
                  </p>
                </div>
              </div>
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

          <p className="footer-testing-notice">
            Website đang trong quá trình kiểm thử. SSCare cam kết hoạt động đúng theo
            quy định của pháp luật!
          </p>
        </div>
      </footer>
  );
}
