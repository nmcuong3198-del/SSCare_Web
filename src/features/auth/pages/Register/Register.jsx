import "./Register.css";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBirthdayCake,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhoneAlt,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/authService";
import ServerUnavailableModal from "@/shared/components/ui/ServerUnavailableModal/ServerUnavailableModal";

const ROLE_OPTIONS = [
  { label: "Bố", value: "FATHER", icon: "👨" },
  { label: "Mẹ", value: "MOTHER", icon: "👩" },
  { label: "Người giám hộ khác", value: "GUARDIAN", icon: "👥" },
];

const INITIAL_FORM = {
  fullName: "",
  displayName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const FULL_NAME_PATTERN = /^[\p{L}\p{M} ]+$/u;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const OTP_PATTERN = /^\d{6}$/;

function normalizePhoneDigits(value) {
  return value.replace(/\D/g, "");
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLatestAllowedParentBirthDate(referenceDate = new Date()) {
  const latest = new Date(
      referenceDate.getFullYear() - 18,
      referenceDate.getMonth(),
      referenceDate.getDate(),
  );
  latest.setDate(latest.getDate() - 1);
  return formatDateInputValue(latest);
}

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (data?.detail && data.detail !== "One or more fields are invalid.") {
    return data.detail;
  }

  if (data?.errors && typeof data.errors === "object") {
    const firstMessage = Object.values(data.errors).find(Boolean);
    if (firstMessage) return firstMessage;
  }

  if (data?.message) return data.message;
  return fallback;
}

export default function Register() {
  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [role, setRole] = useState("MOTHER");
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showServerModal, setShowServerModal] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [otp, setOtp] = useState("");
  const [now, setNow] = useState(null);
  const [success, setSuccess] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const latestAllowedParentBirthDate = getLatestAllowedParentBirthDate();

  const fieldErrors = useMemo(() => {
    const errors = {};
    const fullName = form.fullName.trim();
    const displayName = form.displayName.trim();
    const email = form.email.trim();
    const phoneDigits = normalizePhoneDigits(form.phone);

    if (!fullName) {
      errors.fullName = "Vui lòng nhập họ và tên";
    } else if (fullName.length > 100) {
      errors.fullName = "Họ và tên tối đa 100 ký tự";
    } else if (!FULL_NAME_PATTERN.test(fullName)) {
      errors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
    }

    if (!displayName) {
      errors.displayName = "Vui lòng nhập tên hiển thị";
    } else if (displayName.length > 100) {
      errors.displayName = "Tên hiển thị tối đa 100 ký tự";
    }

    if (!form.dateOfBirth) {
      errors.dateOfBirth = "Vui lòng chọn ngày sinh";
    } else if (form.dateOfBirth > latestAllowedParentBirthDate) {
      errors.dateOfBirth = "Phụ huynh phải trên 18 tuổi";
    }

    if (!EMAIL_PATTERN.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (form.password.length < 8) {
      errors.password = "Mật khẩu tối thiểu 8 ký tự";
    } else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      errors.password = "Mật khẩu phải gồm cả chữ và số";
    }

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return errors;
  }, [form, latestAllowedParentBirthDate]);

  const resendAvailableAt = challenge?.resendAvailableAt
      ? new Date(challenge.resendAvailableAt).getTime()
      : 0;
  const expiresAt = challenge?.expiresAt
      ? new Date(challenge.expiresAt).getTime()
      : 0;
  const resendSeconds = Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));
  const expirySeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const canResend = Boolean(challenge && resendSeconds === 0 && expirySeconds > 0);

  useEffect(() => {
    if (step !== 2 || !challenge) return undefined;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [step, challenge]);

  useEffect(() => {
    if (step !== 2 || !challenge || !expiresAt) return undefined;

    const delay = Math.max(0, expiresAt - Date.now());
    const timeout = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [challenge, expiresAt, navigate, step]);

  useEffect(() => {
    if (step === 2) {
      window.setTimeout(() => otpInputRef.current?.focus(), 0);
    }
  }, [step]);

  const updateField = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "fullName") {
      nextValue = value
          .replace(/[^\p{L}\p{M} ]/gu, "")
          .slice(0, 100);
    }

    if (name === "displayName") {
      nextValue = value.slice(0, 100);
    }

    setForm((current) => ({ ...current, [name]: nextValue }));
    if (errorMessage) setErrorMessage("");
  };

  const handleRoleContinue = () => {
    setErrorMessage("");
    setStep(1);
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setErrorMessage("");

    if (!acceptedPolicies || Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await authService.register({
        displayName: form.displayName.trim(),
        fullName: form.fullName.trim(),
        parentRelationCode: role,
        dateOfBirth: form.dateOfBirth,
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      setChallenge(response);
      setOtp("");
      setNow(Date.now());
      setSubmitted(false);
      setStep(2);
    } catch (error) {
      if (!error?.response) {
        setShowServerModal(true);
      } else {
        setErrorMessage(
            getApiErrorMessage(error, "Không thể gửi OTP. Vui lòng thử lại."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (event) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (errorMessage) setErrorMessage("");
  };

  const verifyOtp = async () => {
    if (!challenge || !OTP_PATTERN.test(otp)) {
      setErrorMessage("Vui lòng nhập đủ 6 số OTP.");
      return;
    }

    if (expirySeconds <= 0) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      await authService.verifyRegistration({
        challengeId: challenge.challengeId,
        otp,
      });
      setSuccess(true);
      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      if (!error?.response) {
        setShowServerModal(true);
      } else {
        setErrorMessage(
            getApiErrorMessage(error, "Không thể xác thực OTP. Vui lòng thử lại."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!challenge || !canResend || loading) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await authService.resendRegistrationOtp(challenge.challengeId);
      setChallenge(response);
      setOtp("");
      setNow(Date.now());
      window.setTimeout(() => otpInputRef.current?.focus(), 0);
    } catch (error) {
      if (!error?.response) {
        setShowServerModal(true);
      } else {
        setErrorMessage(
            getApiErrorMessage(error, "Không thể gửi lại OTP. Vui lòng thử lại."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    if (step === 2) {
      setStep(1);
      setOtp("");
      return;
    }
    if (step === 1) {
      setStep(0);
      return;
    }
    navigate("/");
  };

  const formatClock = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const rest = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${rest}`;
  };

  const renderError = (name) =>
      submitted && fieldErrors[name] ? (
          <span className="register-field-error">{fieldErrors[name]}</span>
      ) : null;

  return (
      <div className="register-page">
        <div className="register-orb register-orb-left" />
        <div className="register-orb register-orb-right" />

        <div className="register-shell">
          <button type="button" className="register-back" onClick={handleBack}>
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>

          <section className="register-card" aria-labelledby="register-title">
            <div className="register-progress" aria-label={`Bước ${step + 1} của 3`}>
              {[0, 1, 2].map((index) => (
                  <span
                      key={index}
                      className={index <= step ? "is-active" : ""}
                  />
              ))}
            </div>
            <p className="register-step-label">Bước {step + 1} của 3</p>

            {step === 0 && (
                <div className="register-step register-role-step">
                  <div className="register-heading">
                    <span className="register-heading-icon"><FaUserFriends /></span>
                    <div>
                      <h1 id="register-title">Bạn là:</h1>
                      <p>Chọn vai trò phù hợp để SSCare cá nhân hóa tài khoản của bạn.</p>
                    </div>
                  </div>

                  <div className="register-role-grid">
                    {ROLE_OPTIONS.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={`register-role-card ${role === option.value ? "is-selected" : ""}`}
                            onClick={() => setRole(option.value)}
                        >
                          <span className="register-role-emoji" aria-hidden="true">{option.icon}</span>
                          <span>{option.label}</span>
                          <span className="register-role-check">
                      {role === option.value && <FaCheckCircle />}
                    </span>
                        </button>
                    ))}
                  </div>

                  <button type="button" className="register-primary-btn" onClick={handleRoleContinue}>
                    Tiếp tục
                  </button>
                </div>
            )}

            {step === 1 && (
                <form className="register-step" onSubmit={handleRequestOtp} noValidate>
                  <div className="register-heading compact">
                    <span className="register-heading-icon"><FaUser /></span>
                    <div>
                      <h1 id="register-title">Tạo tài khoản mới</h1>
                      <p>Thông tin này sẽ dùng chung với tài khoản trên ứng dụng SSCare.</p>
                    </div>
                  </div>

                  <div className="register-form-grid">
                    <label className="register-field">
                      <span>Họ và tên</span>
                      <div className={`register-input ${submitted && fieldErrors.fullName ? "has-error" : ""}`}>
                        <FaUser />
                        <input
                            type="text"
                            name="fullName"
                            autoComplete="name"
                            value={form.fullName}
                            onChange={updateField}
                            placeholder="Nhập họ và tên của bạn"
                            maxLength={100}
                        />
                      </div>
                      <small>Tối đa 100 ký tự, chỉ gồm chữ cái và khoảng trắng</small>
                      {renderError("fullName")}
                    </label>

                    <label className="register-field">
                      <span>Tên hiển thị</span>
                      <div className={`register-input ${submitted && fieldErrors.displayName ? "has-error" : ""}`}>
                        <FaUser />
                        <input
                            type="text"
                            name="displayName"
                            value={form.displayName}
                            onChange={updateField}
                            placeholder="Nhập tên hiển thị của bạn"
                            maxLength={100}
                        />
                      </div>
                      {renderError("displayName")}
                    </label>

                    <label className="register-field">
                      <span>Ngày sinh</span>
                      <div className={`register-input ${submitted && fieldErrors.dateOfBirth ? "has-error" : ""}`}>
                        <FaBirthdayCake />
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={updateField}
                            max={latestAllowedParentBirthDate}
                        />
                      </div>
                      {renderError("dateOfBirth")}
                    </label>

                    <label className="register-field">
                      <span>Email</span>
                      <div className={`register-input ${submitted && fieldErrors.email ? "has-error" : ""}`}>
                        <FaEnvelope />
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={updateField}
                            placeholder="Nhập địa chỉ email"
                        />
                      </div>
                      {renderError("email")}
                    </label>

                    <label className="register-field">
                      <span>Số điện thoại</span>
                      <div className={`register-input ${submitted && fieldErrors.phone ? "has-error" : ""}`}>
                        <FaPhoneAlt />
                        <input
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={updateField}
                            placeholder="Nhập số điện thoại"
                            maxLength={30}
                        />
                      </div>
                      {renderError("phone")}
                    </label>

                    <label className="register-field">
                      <span>Mật khẩu</span>
                      <div className={`register-input ${submitted && fieldErrors.password ? "has-error" : ""}`}>
                        <FaLock />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={updateField}
                            placeholder="Nhập mật khẩu"
                        />
                        <button
                            type="button"
                            className="register-eye-btn"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <small>Tối thiểu 8 ký tự, bao gồm chữ và số</small>
                      {renderError("password")}
                    </label>

                    <label className="register-field register-field-wide">
                      <span>Nhắc lại mật khẩu</span>
                      <div className={`register-input ${submitted && fieldErrors.confirmPassword ? "has-error" : ""}`}>
                        <FaLock />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={form.confirmPassword}
                            onChange={updateField}
                            placeholder="Nhập lại mật khẩu"
                        />
                        <button
                            type="button"
                            className="register-eye-btn"
                            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            onClick={() => setShowConfirmPassword((current) => !current)}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {renderError("confirmPassword")}
                    </label>
                  </div>

                  <div className="register-policy-block">
                    <label className="register-policy-consent">
                      <input
                          type="checkbox"
                          checked={acceptedPolicies}
                          onChange={(event) => {
                            setAcceptedPolicies(event.target.checked);
                            if (errorMessage) setErrorMessage("");
                          }}
                      />
                      <span className="register-policy-check" aria-hidden="true" />
                      <span className="register-policy-text">
                    Bạn đồng ý với Chính sách bảo mật và Điều khoản và điều kiện của chúng tôi.
                  </span>
                    </label>

                    <div className="register-policy-links" aria-label="Tài liệu chính sách và điều khoản">
                      <Link
                          to="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="register-policy-link"
                      >
                        Chính sách bảo mật
                      </Link>
                      <span className="register-policy-separator" aria-hidden="true">•</span>
                      <Link
                          to="/terms-of-use"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="register-policy-link"
                      >
                        Điều khoản và điều kiện
                      </Link>
                    </div>
                  </div>

                  {errorMessage && <div className="register-error-box">{errorMessage}</div>}

                  <button
                      type="submit"
                      className="register-primary-btn"
                      disabled={loading || !acceptedPolicies}
                      title={!acceptedPolicies ? "Vui lòng đồng ý với Chính sách bảo mật và Điều khoản và điều kiện" : undefined}
                  >
                    {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
                  </button>
                </form>
            )}

            {step === 2 && (
                <div className="register-step register-otp-step">
                  {success ? (
                      <div className="register-success">
                        <FaCheckCircle />
                        <h1 id="register-title">Đăng ký thành công</h1>
                        <p>Tài khoản đã được tạo. Đang chuyển về màn hình đăng nhập...</p>
                      </div>
                  ) : (
                      <>
                        <div className="register-heading compact centered">
                          <span className="register-heading-icon"><FaEnvelope /></span>
                          <div>
                            <h1 id="register-title">Xác thực email</h1>
                            <p>
                              Nhập mã OTP 6 số đã gửi tới <strong>{challenge?.destination}</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="register-otp-wrap" onClick={() => otpInputRef.current?.focus()}>
                          <div className="register-otp-boxes" aria-hidden="true">
                            {Array.from({ length: 6 }, (_, index) => (
                                <span key={index} className={index <= otp.length ? "is-active" : ""}>
                          {otp[index] || ""}
                        </span>
                            ))}
                          </div>
                          <input
                              ref={otpInputRef}
                              className="register-otp-hidden-input"
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              value={otp}
                              onChange={handleOtpChange}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" && !loading && otp.length === 6) {
                                  verifyOtp();
                                }
                              }}
                              maxLength={6}
                              aria-label="Mã OTP 6 số"
                          />
                        </div>

                        <p className="register-otp-expiry">
                          Mã OTP hết hạn sau <strong>{formatClock(expirySeconds)}</strong>
                        </p>

                        {errorMessage && <div className="register-error-box">{errorMessage}</div>}

                        <button
                            type="button"
                            className="register-primary-btn"
                            disabled={loading || otp.length !== 6}
                            onClick={verifyOtp}
                        >
                          {loading ? "Đang xác thực..." : "Xác thực"}
                        </button>

                        <button
                            type="button"
                            className="register-resend-btn"
                            disabled={loading || !canResend}
                            onClick={handleResendOtp}
                        >
                          {canResend
                              ? "Gửi lại OTP"
                              : `Có thể gửi lại OTP sau ${formatClock(resendSeconds)}`}
                        </button>
                      </>
                  )}
                </div>
            )}

            {!success && (
                <p className="register-login-link">
                  Đã có tài khoản?{" "}
                  <button type="button" onClick={() => navigate("/login")}>Đăng nhập</button>
                </p>
            )}
          </section>
        </div>

        <ServerUnavailableModal
            open={showServerModal}
            onClose={() => setShowServerModal(false)}
        />
      </div>
  );
}
