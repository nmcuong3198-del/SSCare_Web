import "./ForgotPassword.css";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/authService";
import ServerUnavailableModal from "@/shared/components/ui/ServerUnavailableModal/ServerUnavailableModal";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const OTP_PATTERN = /^\d{6}$/;

function normalizePhoneDigits(value) {
  return value.replace(/\D/g, "");
}

function utf8Length(value) {
  return new TextEncoder().encode(value).length;
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

function formatClock(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const otpInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState(location.state?.identity || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [verification, setVerification] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showServerModal, setShowServerModal] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [success, setSuccess] = useState(false);

  const identityError = useMemo(() => {
    if (!submitted || step !== 0) return "";

    const value = identity.trim();
    if (!value) return "Vui lòng nhập email hoặc số điện thoại";

    if (value.includes("@")) {
      return EMAIL_PATTERN.test(value) ? "" : "Email không hợp lệ";
    }

    const digits = normalizePhoneDigits(value);
    if (digits.length < 9 || digits.length > 15) {
      return "Số điện thoại không hợp lệ";
    }

    return "";
  }, [identity, step, submitted]);

  const passwordErrors = useMemo(() => {
    if (!submitted || step !== 2) return {};

    const errors = {};

    if (newPassword.length < 8) {
      errors.newPassword = "Mật khẩu tối thiểu 8 ký tự";
    } else if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      errors.newPassword = "Mật khẩu phải gồm cả chữ và số";
    } else if (utf8Length(newPassword) > 72) {
      errors.newPassword = "Mật khẩu quá dài";
    }

    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return errors;
  }, [confirmPassword, newPassword, step, submitted]);

  const activeExpiresAt = (() => {
    if (step === 1 && challenge?.expiresAt) {
      return new Date(challenge.expiresAt).getTime();
    }
    if (step === 2 && verification?.expiresAt) {
      return new Date(verification.expiresAt).getTime();
    }
    return 0;
  })();

  const resendAvailableAt = challenge?.resendAvailableAt
    ? new Date(challenge.resendAvailableAt).getTime()
    : 0;

  const expirySeconds = activeExpiresAt
    ? Math.max(0, Math.ceil((activeExpiresAt - now) / 1000))
    : 0;
  const resendSeconds = resendAvailableAt
    ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000))
    : 0;
  const canResend = Boolean(
    step === 1 && challenge && expirySeconds > 0 && resendSeconds === 0,
  );

  useEffect(() => {
    if ((step !== 1 && step !== 2) || !activeExpiresAt || success) {
      return undefined;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [activeExpiresAt, step, success]);

  useEffect(() => {
    if ((step !== 1 && step !== 2) || !activeExpiresAt || success) {
      return undefined;
    }

    const delay = Math.max(0, activeExpiresAt - Date.now());
    const timeout = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [activeExpiresAt, navigate, step, success]);

  useEffect(() => {
    if (step === 1) {
      window.setTimeout(() => otpInputRef.current?.focus(), 0);
    }
  }, [step]);

  const resetError = () => {
    if (errorMessage) setErrorMessage("");
  };

  const requestOtp = async (event) => {
    event?.preventDefault();
    setSubmitted(true);
    setErrorMessage("");

    const value = identity.trim();
    const invalidEmail = value.includes("@") && !EMAIL_PATTERN.test(value);
    const phoneDigits = normalizePhoneDigits(value);
    const invalidPhone = !value.includes("@") &&
      (phoneDigits.length < 9 || phoneDigits.length > 15);

    if (!value || invalidEmail || invalidPhone) return;

    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(value);
      setChallenge(response);
      setVerification(null);
      setOtp("");
      setNow(Date.now());
      setSubmitted(false);
      setStep(1);
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
      const response = await authService.verifyPasswordResetOtp({
        challengeId: challenge.challengeId,
        otp,
      });
      setVerification(response);
      setNow(Date.now());
      setSubmitted(false);
      setStep(2);
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

  const resendOtp = async () => {
    if (!challenge || !canResend || loading) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await authService.resendPasswordResetOtp(
        challenge.challengeId,
      );
      setChallenge(response);
      setVerification(null);
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

  const submitNewPassword = async (event) => {
    event?.preventDefault();
    setSubmitted(true);
    setErrorMessage("");

    if (!challenge || !verification) {
      setErrorMessage("Phiên đặt lại mật khẩu không hợp lệ.");
      return;
    }

    const weakPassword = newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      utf8Length(newPassword) > 72;
    if (weakPassword || confirmPassword !== newPassword) return;

    if (expirySeconds <= 0) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        challengeId: challenge.challengeId,
        resetToken: verification.resetToken,
        newPassword,
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
          getApiErrorMessage(
            error,
            "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (!loading) navigate("/login");
  };

  const renderFieldError = (message) =>
    message ? <span className="forgot-field-error">{message}</span> : null;

  return (
    <div className="forgot-page">
      <div className="forgot-orb forgot-orb-left" />
      <div className="forgot-orb forgot-orb-right" />

      <main className="forgot-shell">
        <button type="button" className="forgot-back" onClick={goBack}>
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>

        <section className="forgot-card" aria-labelledby="forgot-title">
          <div className="forgot-progress" aria-label={`Bước ${step + 1} của 3`}>
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={index <= step ? "is-active" : ""}
              />
            ))}
          </div>
          <p className="forgot-step-label">Bước {step + 1} của 3</p>

          {success ? (
            <div className="forgot-success">
              <FaCheckCircle />
              <h1 id="forgot-title">Đặt lại mật khẩu thành công</h1>
              <p>Mật khẩu đã được cập nhật. Đang chuyển về màn hình đăng nhập...</p>
            </div>
          ) : (
            <>
              {step === 0 && (
                <form className="forgot-step" onSubmit={requestOtp} noValidate>
                  <div className="forgot-heading">
                    <span className="forgot-heading-icon"><FaKey /></span>
                    <div>
                      <h1 id="forgot-title">Quên mật khẩu</h1>
                      <p>
                        Nhập email hoặc số điện thoại đã đăng ký. SSCare sẽ gửi
                        mã OTP tới email đã đăng ký của tài khoản.
                      </p>
                    </div>
                  </div>

                  <label className="forgot-field">
                    <span>Email hoặc Số điện thoại</span>
                    <div className={`forgot-input ${identityError ? "has-error" : ""}`}>
                      <FaUser />
                      <input
                        type="text"
                        autoComplete="username"
                        value={identity}
                        onChange={(event) => {
                          setIdentity(event.target.value);
                          resetError();
                        }}
                        placeholder="Nhập email hoặc số điện thoại"
                      />
                    </div>
                    {renderFieldError(identityError)}
                  </label>

                  {errorMessage && (
                    <div className="forgot-error-box">{errorMessage}</div>
                  )}

                  <button
                    type="submit"
                    className="forgot-primary-btn"
                    disabled={loading}
                  >
                    {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
                  </button>

                  <button
                    type="button"
                    className="forgot-login-link"
                    disabled={loading}
                    onClick={() => navigate("/login")}
                  >
                    Quay lại đăng nhập
                  </button>
                </form>
              )}

              {step === 1 && (
                <div className="forgot-step forgot-otp-step">
                  <div className="forgot-heading centered">
                    <span className="forgot-heading-icon"><FaEnvelope /></span>
                    <div>
                      <h1 id="forgot-title">Xác thực OTP</h1>
                      <p>
                        Nhập mã OTP 6 số đã gửi tới <strong>{challenge?.destination}</strong>.
                        Mã có hiệu lực trong 5 phút.
                      </p>
                    </div>
                  </div>

                  <div
                    className="forgot-otp-wrap"
                    onClick={() => otpInputRef.current?.focus()}
                  >
                    <div className="forgot-otp-boxes" aria-hidden="true">
                      {Array.from({ length: 6 }, (_, index) => (
                        <span
                          key={index}
                          className={index <= otp.length ? "is-active" : ""}
                        >
                          {otp[index] || ""}
                        </span>
                      ))}
                    </div>
                    <input
                      ref={otpInputRef}
                      className="forgot-otp-hidden-input"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(event) => {
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                        resetError();
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !loading && otp.length === 6) {
                          verifyOtp();
                        }
                      }}
                      maxLength={6}
                      aria-label="Mã OTP 6 số"
                    />
                  </div>

                  <p className="forgot-expiry">
                    Mã OTP hết hạn sau <strong>{formatClock(expirySeconds)}</strong>
                  </p>

                  {errorMessage && (
                    <div className="forgot-error-box">{errorMessage}</div>
                  )}

                  <button
                    type="button"
                    className="forgot-primary-btn"
                    disabled={loading || otp.length !== 6}
                    onClick={verifyOtp}
                  >
                    {loading ? "Đang xác thực..." : "Xác thực"}
                  </button>

                  <button
                    type="button"
                    className="forgot-resend-btn"
                    disabled={loading || !canResend}
                    onClick={resendOtp}
                  >
                    {canResend
                      ? "Gửi lại OTP"
                      : `Có thể gửi lại OTP sau ${formatClock(resendSeconds)}`}
                  </button>
                </div>
              )}

              {step === 2 && (
                <form className="forgot-step" onSubmit={submitNewPassword} noValidate>
                  <div className="forgot-heading">
                    <span className="forgot-heading-icon"><FaLock /></span>
                    <div>
                      <h1 id="forgot-title">Tạo mật khẩu mới</h1>
                      <p>
                        Mật khẩu mới tối thiểu 8 ký tự, có cả chữ và số.
                        Phiên đặt lại mật khẩu còn {formatClock(expirySeconds)}.
                      </p>
                    </div>
                  </div>

                  <label className="forgot-field">
                    <span>Mật khẩu mới</span>
                    <div className={`forgot-input ${passwordErrors.newPassword ? "has-error" : ""}`}>
                      <FaLock />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) => {
                          setNewPassword(event.target.value);
                          resetError();
                        }}
                        placeholder="Nhập mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="forgot-eye-btn"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <small>Tối thiểu 8 ký tự, bao gồm chữ và số</small>
                    {renderFieldError(passwordErrors.newPassword)}
                  </label>

                  <label className="forgot-field">
                    <span>Nhắc lại mật khẩu mới</span>
                    <div className={`forgot-input ${passwordErrors.confirmPassword ? "has-error" : ""}`}>
                      <FaLock />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          resetError();
                        }}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="forgot-eye-btn"
                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        onClick={() => setShowConfirmPassword((current) => !current)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {renderFieldError(passwordErrors.confirmPassword)}
                  </label>

                  {errorMessage && (
                    <div className="forgot-error-box">{errorMessage}</div>
                  )}

                  <button
                    type="submit"
                    className="forgot-primary-btn"
                    disabled={loading}
                  >
                    {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </main>

      <ServerUnavailableModal
        open={showServerModal}
        onClose={() => setShowServerModal(false)}
      />
    </div>
  );
}
