import "./Login.css";

import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
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

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (loginError) setLoginError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const authResponse = await authService.login(form);

      // Mọi tài khoản hợp lệ đều được phép đăng nhập Web.
      // Role chỉ quyết định các tab/chức năng bổ sung được hiển thị và truy cập.
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

  const openForgotPassword = () => {
    navigate("/forgot-password", {
      state: { identity: form.username.trim() },
    });
  };

  return (
    <div className="login-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="particle p1" />
      <div className="particle p2" />
      <div className="particle p3" />
      <div className="particle p4" />
      <div className="particle p5" />

      <div className="wave wave-1" />
      <div className="wave wave-2" />

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

        <div className="form-group login-password-group">
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
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="button"
            className="forgot-password-link"
            onClick={openForgotPassword}
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className={`login-error ${loginError ? "show" : ""}`}>
          {loginError || "\u00A0"}
        </div>

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="login-register-divider">
          <span>Hoặc</span>
        </div>

        <button
          type="button"
          className="login-register-btn"
          disabled={loading}
          onClick={() => navigate("/register")}
        >
          <FaUserPlus />
          <span>Đăng ký tài khoản</span>
        </button>
      </form>

      <ServerUnavailableModal
        open={showServerModal}
        onClose={() => setShowServerModal(false)}
      />
    </div>
  );
}
