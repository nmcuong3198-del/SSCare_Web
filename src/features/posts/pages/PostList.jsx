import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaRegFileAlt } from "react-icons/fa";
import { FiClock, FiEdit3, FiSearch } from "react-icons/fi";

import authService from "@/features/auth/services/authService";
import ArticleTable from "@/features/posts/components/list/ArticleTable";
import StatisticCard from "@/features/posts/components/list/StatisticCard";
import articleService from "@/features/posts/services/articleService";
import Pagination from "@/shared/components/ui/Pagination/Pagination";

import "./PostList.css";

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "draft", label: "Bản nháp" },
  { value: "pending", label: "Đang chờ duyệt" },
  { value: "published", label: "Đã phê duyệt" },
  { value: "rejected", label: "Bị từ chối" },
  { value: "archived", label: "Lưu trữ" },
];

export default function PostList() {
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);

  const [titleInput, setTitleInput] = useState("");
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    author: "",
  });

  const listFilters = useMemo(
    () => ({
      title: filters.title || undefined,
      status: filters.status || undefined,
      author: filters.author || undefined,
    }),
    [filters],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    articleService
      .getList(page, PAGE_SIZE, listFilters)
      .then((response) => {
        if (cancelled) return;

        setArticles(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
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
  }, [page, listFilters]);

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
  }, []);

  useEffect(() => {
    if (!isAdmin) return undefined;

    let cancelled = false;
    articleService
      .getAuthors()
      .then((data) => {
        if (!cancelled) setAuthors(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải danh sách người viết:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const handlePageChange = (nextPage) => {
    if (loading || nextPage === page) return;
    setPage(nextPage);
  };

  const handleSearchTitle = (event) => {
    event.preventDefault();
    setPage(0);
    setFilters((current) => ({
      ...current,
      title: titleInput.trim(),
    }));
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setPage(0);
    setFilters((current) => ({ ...current, status: value }));
  };

  const handleAuthorChange = (event) => {
    const value = event.target.value;
    setPage(0);
    setFilters((current) => ({ ...current, author: value }));
  };

  const clearFilters = () => {
    setTitleInput("");
    setPage(0);
    setFilters({ title: "", status: "", author: "" });
  };

  const hasFilters = Boolean(filters.title || filters.status || filters.author);

  return (
    <div className="post-list-page">
      <div className="page-header">
        <div>
          <h1>Danh sách bài viết</h1>
          <p>
            {isAdmin
              ? "Theo dõi, tìm kiếm và kiểm duyệt các bài viết trên hệ thống."
              : "Quản lý và theo dõi các bài viết của bạn."}
          </p>
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
          value={stats ? stats.total : totalElements}
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

      <div className="article-search-panel">
        <form className="article-title-search" onSubmit={handleSearchTitle}>
          <label htmlFor="article-title-search">Tên bài viết</label>
          <div className="article-search-input-wrap">
            <FiSearch aria-hidden="true" />
            <input
              id="article-title-search"
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              placeholder="Nhập tên bài viết cần tìm..."
            />
          </div>
          <button type="submit" className="article-search-btn" disabled={loading}>
            Tìm kiếm
          </button>
        </form>

        <div className="article-filter-field">
          <label htmlFor="article-status-filter">Trạng thái</label>
          <select
            id="article-status-filter"
            value={filters.status}
            onChange={handleStatusChange}
            disabled={loading}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <div className="article-filter-field">
            <label htmlFor="article-author-filter">Người viết</label>
            <select
              id="article-author-filter"
              value={filters.author}
              onChange={handleAuthorChange}
              disabled={loading}
            >
              <option value="">Tất cả người viết</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasFilters && (
          <button type="button" className="article-clear-filter" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        )}
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
