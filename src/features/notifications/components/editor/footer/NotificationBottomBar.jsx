import { ArrowLeft, Loader2, Plus, Save, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./NotificationBottomBar.css";

export default function NotificationBottomBar({
  onCreate,
  onUpdate,
  onSend,
  isCreated = false,
  notificationSent = false,
}) {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);

  const runAction = async (action, callback) => {
    if (loadingAction || typeof callback !== "function") return;

    setLoadingAction(action);
    try {
      await callback();
    } finally {
      setLoadingAction(null);
    }
  };

  const isBusy = loadingAction !== null;

  return (
    <div className="notification-bottom-bar">
      {!isCreated ? (
        <button
          type="button"
          className="create-btn"
          onClick={() => runAction("create", onCreate)}
          disabled={isBusy}
        >
          {loadingAction === "create" ? (
            <Loader2 size={18} className="spin" />
          ) : (
            <Plus size={18} />
          )}
          <span>
            {loadingAction === "create" ? "Đang tạo..." : "Tạo thông báo"}
          </span>
        </button>
      ) : !notificationSent ? (
        <>
          <button
            type="button"
            className="save-btn"
            onClick={() => runAction("save", onUpdate)}
            disabled={isBusy}
          >
            {loadingAction === "save" ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Save size={18} />
            )}
            <span>
              {loadingAction === "save" ? "Đang lưu..." : "Lưu thông báo"}
            </span>
          </button>

          <button
            type="button"
            className="send-btn"
            onClick={() => runAction("send", onSend)}
            disabled={isBusy}
          >
            {loadingAction === "send" ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <SendHorizonal size={18} />
            )}
            <span>
              {loadingAction === "send" ? "Đang gửi..." : "Gửi thông báo"}
            </span>
          </button>
        </>
      ) : (
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/notifications")}
        >
          <ArrowLeft size={18} />
          <span>Danh sách thông báo</span>
        </button>
      )}
    </div>
  );
}
