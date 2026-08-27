import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaRegFileAlt } from "react-icons/fa";
import { FiClock, FiEdit3 } from "react-icons/fi";

import authService from "@/features/auth/services/authService";
import ArticleTable from "@/features/posts/components/list/ArticleTable";
import StatisticCard from "@/features/posts/components/list/StatisticCard";
import articleService from "@/features/posts/services/articleService";
import Pagination from "@/shared/components/ui/Pagination/Pagination";

import "./PostList.css";

const PAGE_SIZE = 5;

export default function PostList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    let cancelled = false;

    articleService
      .getList(page, PAGE_SIZE)
      .then((response) => {
        if (cancelled) return;

        setArticles(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải danh sách bài viết:", error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    let cancelled = false;

    articleService
      .getStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải thống kê bài viết:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  return (
    <div className="post-list-page">
      <div className="page-header">
        <div>
          <h1>Danh sách bài viết</h1>
          <p>Quản lý và theo dõi các bài viết của bạn.</p>
        </div>

        {!isAdmin && (
          <button
            type="button"
            className="new-post-btn"
            onClick={() => navigate("/posts/new")}
          >
            <FaPlusCircle />
            Viết bài mới
          </button>
        )}
      </div>

      <div className="stat-grid">
        <StatisticCard
          icon={<FaRegFileAlt />}
          title="Tổng bài viết"
          value={totalElements}
        />

        <StatisticCard
          icon={<FiClock />}
          title="Chờ duyệt"
          value={stats ? stats.pending : "—"}
          color="#FDBE4C"
        />

        <StatisticCard
          icon={<FiEdit3 />}
          title="Bản nháp"
          value={stats ? stats.draft : "—"}
          color="#BFD7FF"
        />
      </div>

      <div className="table-container">
        <ArticleTable articles={articles} />
        {loading && <div className="table-loading">Đang tải...</div>}
      </div>

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
