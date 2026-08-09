import StatusBadge from "@/features/notifications/components/list/badge/StatusBadge";
import NotificationAction from "@/features/notifications/components/list/table/NotificationAction";
import RecipientCell from "@/features/notifications/components/list/table/RecipientCell";

import "./NotificationRow.css";

export default function NotificationRow({ notification }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss}`;
  };

  return (
    <tr>
      <td data-label="Mã">{notification.code}</td>

      <td data-label="Trạng thái">
        <StatusBadge status={notification.status} />
      </td>

      <td data-label="Loại thông báo">{notification.type}</td>

      <td data-label="Hẹn giờ gửi">
        {formatDateTime(notification.scheduleTime)}
      </td>

      <td data-label="Người nhận">
        <RecipientCell recipient={notification.recipients} />
      </td>

      <td data-label="Thao tác">
        <NotificationAction code={notification.code} />
      </td>
    </tr>
  );
}
