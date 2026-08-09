import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaPaperPlane, FaPlusCircle, FaRegFileAlt } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";

import SearchBar from "@/features/notifications/components/list/header/SearchBar";
import StatisticCard from "@/features/notifications/components/list/statistic/StatisticCard";
import NotificationTable from "@/features/notifications/components/list/table/NotificationTable";
import notificationService from "@/features/notifications/services/notificationsService";
import Pagination from "@/shared/components/ui/Pagination/Pagination";

import "./NotificationList.css";

const PAGE_SIZE = 5;

const formatNotification = (notification) => ({
  ...notification,
  type: notification.type === "SYSTEM" ? "Hệ thống" : "Khác",
  recipients:
    notification.recipients === "ALL" ? "Tất cả" : notification.recipients,
});

export default function NotificationList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;

    notificationService
      .getList(page, PAGE_SIZE)
      .then((response) => {
        if (cancelled) return;

        setNotifications(response.content.map(formatNotification));
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải danh sách thông báo:", error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  const filteredNotifications = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) return notifications;

    return notifications.filter((notification) =>
      [notification.code, notification.title, notification.type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedKeyword)),
    );
  }, [keyword, notifications]);

  return (
    <div className="notification-page">
      <div className="page-header">
        <div>
          <h1>Quản lý thông báo</h1>
          <p>Theo dõi, tạo và gửi thông báo tới người dùng hệ thống.</p>
        </div>

        <div className="page-action">
          <SearchBar keyword={keyword} onChange={setKeyword} />

          <button
            type="button"
            className="new-notification-btn"
            onClick={() => navigate("/notifications/new")}
          >
            <FaPlusCircle />
            <span>Tạo thông báo</span>
          </button>
        </div>
      </div>

      <div className="statistic-grid">
        <StatisticCard
          icon={<FaPaperPlane />}
          title="Đã gửi"
          value="1,284"
          subTitle="+8% so với tuần trước"
          color="#EDF4FF"
        />

        <StatisticCard
          icon={<FaRegFileAlt />}
          title="Bản nháp"
          value="42"
          subTitle="Chưa gửi"
          color="#FFF5E6"
        />

        <StatisticCard
          icon={<IoWarning />}
          title="Lỗi gửi"
          value="03"
          subTitle="Cần kiểm tra"
          color="#FFF0F0"
        />

        <StatisticCard
          dark
          icon={<FaChartLine />}
          title="Tỉ lệ mở"
          value="86.4%"
          subTitle="+2.4%"
        />
      </div>

      <NotificationTable
        notifications={filteredNotifications}
        loading={loading}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
