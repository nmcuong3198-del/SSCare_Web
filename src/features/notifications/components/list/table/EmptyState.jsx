import { Inbox } from "lucide-react";

import "./EmptyState.css";

export default function EmptyState({
  title = "Chưa có thông báo",
  description = "Hiện chưa có thông báo nào trong hệ thống.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Inbox size={60} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
