import "./NotificationTable.css";

import NotificationTableHeader from "@/features/notifications/components/list/table/NotificationTableHeader";
import NotificationRow from "@/features/notifications/components/list/table/NotificationRow";
import EmptyState from "@/features/notifications/components/list/table/EmptyState";

export default function NotificationTable({ notifications, loading }) {
  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (notifications.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="notification-table-wrapper">
      <NotificationTableHeader total={notifications.length} />

      <table className="notification-table">
        <thead>
          <tr>
            <th>Mã</th>

            <th>Trạng Thái</th>

            <th>LOẠI THÔNG BÁO</th>

            <th>HẸN GIỜ GỬI</th>

            <th>NGƯỜI NHẬN</th>

            <th>THAO TÁC</th>
          </tr>
        </thead>

        <tbody>
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.code}
              notification={notification}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
