import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "@/features/auth/services/authService";
import "./SessionTimeout.css";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_BEFORE_MS = 60 * 1000;
// const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
// const WARNING_BEFORE_MS = 30 * 1000;
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

export default function SessionTimeout() {
  const navigate = useNavigate();
  const location = useLocation();
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const warningVisibleRef = useRef(false);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const clearTimers = useCallback(() => {
    window.clearTimeout(warningTimerRef.current);
    window.clearTimeout(logoutTimerRef.current);
  }, []);

  const logout = useCallback((reason = "idle") => {
    clearTimers();
    authService.logout();
    warningVisibleRef.current = false;
    setShowWarning(false);
    navigate("/login", {
      replace: true,
      state: { logoutReason: reason },
    });
  }, [clearTimers, navigate]);

  const startTimers = useCallback(() => {
    clearTimers();

    if (!authService.isAuthenticated()) {
      return;
    }

    warningTimerRef.current = window.setTimeout(() => {
      setSecondsLeft(Math.ceil(WARNING_BEFORE_MS / 1000));
      warningVisibleRef.current = true;
      setShowWarning(true);
    }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);

    logoutTimerRef.current = window.setTimeout(() => {
      logout("idle");
    }, IDLE_TIMEOUT_MS);
  }, [clearTimers, logout]);

  const continueSession = () => {
    warningVisibleRef.current = false;
    setShowWarning(false);
    setSecondsLeft(Math.ceil(WARNING_BEFORE_MS / 1000));
    startTimers();
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      clearTimers();
      warningVisibleRef.current = false;
      return undefined;
    }

    const handleActivity = () => {
      if (!warningVisibleRef.current) {
        startTimers();
      }
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    startTimers();

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [clearTimers, location.pathname, startTimers]);

  useEffect(() => {
    if (!showWarning) {
      return undefined;
    }

    const countdown = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [showWarning]);

  useEffect(() => {
    const handleForcedLogout = (event) => {
      logout(event.detail?.reason || "expired");
    };

    window.addEventListener("auth:logout", handleForcedLogout);

    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, [logout]);

  if (!showWarning) {
    return null;
  }

  return (
    <div className="session-timeout-overlay" role="presentation">
      <div
        className="session-timeout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
      >
        <div className="session-timeout-icon">⏳</div>
        <h2 id="session-timeout-title">Phiên đăng nhập sắp hết hạn</h2>
        <p>
          Bạn đã không thao tác trong một thời gian. Hệ thống sẽ tự đăng xuất sau
          <strong> {secondsLeft} giây</strong>.
        </p>

        <div className="session-timeout-actions">
          <button type="button" className="session-logout-btn" onClick={() => logout("manual")}> 
            Đăng xuất
          </button>
          <button type="button" className="session-continue-btn" onClick={continueSession}>
            Tiếp tục làm việc
          </button>
        </div>
      </div>
    </div>
  );
}
