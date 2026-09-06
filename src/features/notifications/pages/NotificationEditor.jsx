import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import authService from "@/features/auth/services/authService";
import NotificationForm from "@/features/notifications/components/editor/form/NotificationForm";
import CreateNotificationSuccessModal from "@/features/notifications/components/editor/popup/CreateNotificationSuccessModal";
import SaveDraftSuccessModal from "@/features/notifications/components/editor/popup/SaveDraftSuccessModal";
import SendSuccessModal from "@/features/notifications/components/editor/popup/SendSuccessModal";
import NotificationPreview from "@/features/notifications/components/editor/preview/NotificationPreview";
import { createEmptyNotification } from "@/features/notifications/model/notificationDefault";
import notificationsService from "@/features/notifications/services/notificationsService";
import {
  createNotificationPayload,
  normalizeNotification,
} from "@/features/notifications/utils/notificationPayload";
import { validateNotification } from "@/features/notifications/utils/notificationValidator";
import ServerUnavailableModal from "@/shared/components/ui/ServerUnavailableModal/ServerUnavailableModal";

import "./NotificationEditor.css";

export default function NotificationEditor() {
  const [notification, setNotification] = useState(createEmptyNotification);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  const navigate = useNavigate();
  const { code } = useParams();
  const currentUsername = authService.getCurrentUser()?.username ?? "";

  const showRequestError = useCallback((error, action = "thực hiện thao tác") => {
    const status = error?.response?.status;
    const problem = error?.response?.data || {};
    const code = problem?.code;
    const detail = problem?.detail || problem?.message;

    if (error?.code === "ECONNABORTED") {
      setRequestError({
        title: "⚠️ Gửi thông báo quá thời gian chờ",
        message: "Backend chưa trả kết quả gửi Firebase trong thời gian cho phép.",
        details: [
          "Kiểm tra kết nối Internet outbound từ Backend tới Google/Firebase.",
          "Kiểm tra log backend để biết Firebase SDK đang chờ hay lỗi.",
          "Không bấm gửi liên tục để tránh gửi trùng nếu Backend vẫn đang xử lý.",
        ],
        tip: "Timeout của riêng API gửi push đã được tăng lên 45 giây.",
      });
      return;
    }

    if (!error?.response) {
      setRequestError({
        title: "⚠️ Không thể kết nối tới máy chủ",
        message: `Không thể ${action} vì trình duyệt không nhận được phản hồi từ Backend.`,
        details: [
          "Kiểm tra sscare-backend.service có đang active (running) hay không.",
          "Kiểm tra Nginx /api/ có proxy tới Backend :8080.",
          "Kiểm tra kết nối mạng và thử lại.",
        ],
        tip: "Nếu Backend vừa deploy Firebase, hãy kiểm tra FIREBASE_CREDENTIALS_PATH và journalctl.",
      });
      return;
    }

    if (status === 409 && code === "PUSH_NO_ACTIVE_DEVICE") {
      setRequestError({
        title: "⚠️ Chưa có thiết bị nhận thông báo",
        message: detail || "Không có thiết bị Android/iOS đang hoạt động cho người nhận đã chọn.",
        details: [
          "Đăng nhập SSCare App trên Android/iOS để App đăng ký FCM token.",
          "Kiểm tra bảng sscare.user_devices có account_id, fcm_token và active=true.",
          "Nếu vừa logout, token của thiết bị sẽ được chuyển active=false.",
        ],
        tip: "Web chỉ có thể gửi push khi ít nhất một thiết bị App đã đăng ký FCM token với Backend.",
      });
      return;
    }

    if (status === 502 && code === "PUSH_DELIVERY_FAILED") {
      setRequestError({
        title: "⚠️ Firebase không gửi được thông báo",
        message: detail || "Backend đã nhận yêu cầu nhưng Firebase không giao được push tới thiết bị.",
        details: [
          "Kiểm tra FIREBASE_CREDENTIALS_PATH trên host.",
          "Kiểm tra service-account thuộc đúng Firebase project của App.",
          "Kiểm tra FCM token và kết nối outbound từ host tới Google/Firebase.",
        ],
        tip: "Xem journalctl của sscare-backend.service để lấy lỗi Firebase chi tiết.",
      });
      return;
    }

    if (status === 401 || status === 403) {
      setRequestError({
        title: "⚠️ Không đủ quyền gửi thông báo",
        message: detail || "Phiên đăng nhập không hợp lệ hoặc tài khoản chưa có quyền NOTIFICATION_MANAGER/ADMIN.",
        details: [
          "Đăng nhập lại tài khoản quản trị.",
          "Kiểm tra role NOTIFICATION_MANAGER hoặc ADMIN của tài khoản.",
        ],
        tip: `HTTP ${status}`,
      });
      return;
    }

    setRequestError({
      title: `⚠️ Không thể ${action}`,
      message: detail || `Backend trả về lỗi HTTP ${status || "không xác định"}.`,
      details: [
        `HTTP status: ${status || "không có phản hồi"}`,
        code ? `Mã lỗi: ${code}` : "Kiểm tra log Backend để biết nguyên nhân chi tiết.",
      ],
      tip: "Thông báo lỗi này phản ánh response thật từ Backend, không còn quy mọi lỗi thành mất kết nối máy chủ.",
    });
  }, []);

  const applyNotificationResponse = useCallback((response) => {
    const normalized = normalizeNotification(response);

    setNotification(normalized);
    setUpdatedAt(normalized.updatedAt);
    setIsCreated(Boolean(normalized.id || normalized.code));
    setNotificationSent(
      normalized.status === "published" || normalized.status === "scheduled",
    );

    return normalized;
  }, []);

  useEffect(() => {
    if (!code) return undefined;

    let cancelled = false;

    notificationsService
      .getByCode(code)
      .then((response) => {
        if (!cancelled) applyNotificationResponse(response);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải thông báo:", error);
          showRequestError(error, "tải thông báo");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyNotificationResponse, code, showRequestError]);

  const createNotification = async () => {
    if (!validateNotification(notification)) return;

    try {
      const formData = createNotificationPayload(notification, {
        status: "draft",
        createdBy: currentUsername,
      });
      const response = await notificationsService.create(formData);
      const createdNotification = applyNotificationResponse(response);

      navigate(`/notifications/${createdNotification.code}`, { replace: true });
      setShowCreateModal(true);
    } catch (error) {
      showRequestError(error, "tạo thông báo");
    }
  };

  const updateNotification = async () => {
    if (!validateNotification(notification)) return;

    try {
      const formData = createNotificationPayload(notification, {
        status: "draft",
      });
      const response = await notificationsService.update(formData);

      applyNotificationResponse(response);
      setShowSaveModal(true);
    } catch (error) {
      showRequestError(error, "lưu thông báo");
    }
  };

  const sendNotification = async () => {
    if (!validateNotification(notification)) return;

    try {
      const formData = createNotificationPayload(notification);
      const response = await notificationsService.pushNotification(formData);

      applyNotificationResponse(response);
      setShowSendModal(true);
    } catch (error) {
      showRequestError(error, "gửi thông báo");
    }
  };

  return (
    <div className="notification-editor-page">
      <div className="notification-editor-layout">
        <div className="notification-left">
          <NotificationForm
            notification={notification}
            setNotification={setNotification}
            onCreate={createNotification}
            onUpdate={updateNotification}
            onSend={sendNotification}
            isCreated={isCreated}
            notificationSent={notificationSent}
          />
        </div>

        <div className="notification-right">
          <NotificationPreview notification={notification} />
        </div>

        <SaveDraftSuccessModal
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />

        <SendSuccessModal
          open={showSendModal}
          onClose={() => setShowSendModal(false)}
          onBackToList={() => navigate("/notifications")}
          updatedAt={updatedAt}
          status={notification.status}
          scheduleTime={notification.scheduleTime}
        />

        <CreateNotificationSuccessModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        <ServerUnavailableModal
          open={Boolean(requestError)}
          onClose={() => setRequestError(null)}
          title={requestError?.title}
          message={requestError?.message}
          details={requestError?.details}
          tip={requestError?.tip}
        />
      </div>
    </div>
  );
}
