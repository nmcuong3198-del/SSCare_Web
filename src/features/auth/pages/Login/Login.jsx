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
import { createConnectionError, getApiErrorMessage } from "@/shared/utils/apiError";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [form, setForm] = useState(() => {
    const rememberedLogin = authService.getRememberedLogin();

    return {
      username: rememberedLogin.username,
      password: "",
      remember: rememberedLogin.remember,
    };
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

    const identity = form.username.trim();
    if (!identity) {
      setLoginError("Vui lòng nhập email hoặc số điện thoại.");
      return;
    }
    if (!form.password) {
      setLoginError("Vui lòng nhập mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const authResponse = await authService.login(form);

      // Mọi tài khoản hợp lệ đều được phép đăng nhập Web.
      // Role chỉ quyết định các tab/chức năng bổ sung được hiển thị và truy cập.
      authService.saveUser(authResponse, form.remember, form.username.trim());

      navigate("/");
      window.location.reload();
    } catch (error) {
      const connectionProblem = createConnectionError(error, "đăng nhập");
      if (connectionProblem) {
        setConnectionError(connectionProblem);
        return;
      }

      const status = error?.response?.status;

      if (status === 401) {
        setLoginError("Email/số điện thoại hoặc mật khẩu không chính xác.");
        return;
      }

      if (status === 429) {
        setLoginError("Bạn đã thử đăng nhập quá nhiều lần. Vui lòng chờ một lúc rồi thử lại.");
        return;
      }

      if (status >= 500) {
        setLoginError("Hệ thống đang gặp sự cố. Vui lòng thử lại sau.");
        return;
      }

      setLoginError(
        getApiErrorMessage(
          error,
          status === 403
            ? "Tài khoản hiện không được phép đăng nhập."
            : "Không thể đăng nhập. Vui lòng kiểm tra thông tin và thử lại.",
        ),
      );
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

      <form className="login-card" onSubmit={handleSubmit} autoComplete="on">
        <h2>Đăng nhập</h2>

        <div className="form-group">
          <label>Tên đăng nhập</label>

          <div className="input-box">
            <FaUser className="icon" />

            <input
              id="login-username"
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
              id="login-password"
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

        </div>

        <div className="login-options-row">
          <label className="remember-login-option">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

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
        open={Boolean(connectionError)}
        onClose={() => setConnectionError(null)}
        title={connectionError?.title}
        message={connectionError?.message}
        details={connectionError?.details}
        tip={connectionError?.tip}
      />
    </div>
  );
}
