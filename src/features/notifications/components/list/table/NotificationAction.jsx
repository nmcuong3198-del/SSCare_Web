import "./NotificationAction.css";

import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationAction({ code }) {
  const navigate = useNavigate();

  return (
    <button
      className="notification-action"
      onClick={() => navigate(`/notifications/${code}`)}
    >
      <Eye size={17} />

      <span>Chi tiết</span>
    </button>
  );
}
