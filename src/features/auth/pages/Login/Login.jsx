import "./Login.css";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authService from "@/features/auth/services/authService";
import ServerUnavailableModal from "@/shared/components/ui/ServerUnavailableModal/ServerUnavailableModal";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showServerModal, setShowServerModal] = useState(false);

  const [loginError, setLoginError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const authResponse = await authService.login(form);

      if (!authService.hasCmsAccessFromResponse(authResponse)) {
        setLoginError("Tài khoản chưa được Admin cấp quyền truy cập quản trị web.");
        return;
      }

      authService.saveUser(authResponse);

      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setLoginError("Email/số điện thoại hoặc mật khẩu không chính xác.");
        return;
      }
      setShowServerModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-page">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
        <div className="particle p5"></div>

        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>

        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>

          <div className="form-group">
            <label>Tên đăng nhập</label>

            <div className="input-box">
              <FaUser className="icon" />

              <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Email hoặc số điện thoại"
                  value={form.username}
                  onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>

            <div className="input-box">
              <FaLock className="icon" />

              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
              />

              <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={`login-error ${loginError ? "show" : ""}`}>
            {loginError || "\u00A0"}
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <ServerUnavailableModal
            open={showServerModal}
            onClose={() => setShowServerModal(false)}
        />
      </div>
  );
}