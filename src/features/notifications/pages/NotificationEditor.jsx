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
  createNotificationFormData,
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
  const [showServerModal, setShowServerModal] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  const navigate = useNavigate();
  const { code } = useParams();
  const currentUsername = authService.getCurrentUser()?.username ?? "";

  const applyNotificationResponse = useCallback((response) => {
    const normalized = normalizeNotification(response);

    setNotification(normalized);
    setUpdatedAt(normalized.updatedAt);
    setIsCreated(Boolean(normalized.id || normalized.code));
    setNotificationSent(normalized.status === "published");

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
          setShowServerModal(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyNotificationResponse, code]);

  const createNotification = async () => {
    if (!validateNotification(notification)) return;

    try {
      const formData = createNotificationFormData(notification, {
        status: "draft",
        createdBy: currentUsername,
      });
      const response = await notificationsService.create(formData);
      const createdNotification = applyNotificationResponse(response);

      navigate(`/notifications/${createdNotification.code}`, { replace: true });
      setShowCreateModal(true);
    } catch {
      setShowServerModal(true);
    }
  };

  const updateNotification = async () => {
    if (!validateNotification(notification)) return;

    try {
      const formData = createNotificationFormData(notification, {
        status: "draft",
      });
      const response = await notificationsService.update(formData);

      applyNotificationResponse(response);
      setShowSaveModal(true);
    } catch {
      setShowServerModal(true);
    }
  };

  const sendNotification = async () => {
    if (!validateNotification(notification)) return;

    try {
      const formData = createNotificationFormData(notification);
      const response = await notificationsService.pushNotification(formData);

      applyNotificationResponse(response);
      setNotificationSent(true);
      setShowSendModal(true);
    } catch {
      setShowServerModal(true);
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
        />

        <CreateNotificationSuccessModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        <ServerUnavailableModal
          open={showServerModal}
          onClose={() => setShowServerModal(false)}
        />
      </div>
    </div>
  );
}
