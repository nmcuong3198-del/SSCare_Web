import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaRegFileAlt } from "react-icons/fa";
import { FiCheck, FiChevronDown, FiClock, FiEdit3, FiSearch } from "react-icons/fi";

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


function ArticleFilterSelect({ id, value, options, onChange, disabled = false, ariaLabel }) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const selectOption = (option) => {
    if (disabled || option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`article-filter-select ${open ? "is-open" : ""} ${disabled ? "is-disabled" : ""}`.trim()}
    >
      <button
        id={id}
        type="button"
        className="article-filter-select__trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        <FiChevronDown aria-hidden="true" />
      </button>

      {open && (
        <div className="article-filter-select__menu" role="listbox" aria-labelledby={id}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={`${option.value || "all"}-${option.label}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`article-filter-select__option ${isSelected ? "is-selected" : ""}`.trim()}
                disabled={option.disabled}
                onClick={() => selectOption(option)}
              >
                <span>{option.label}</span>
                {isSelected && <FiCheck aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

  const handleTitleBlur = () => {
    const nextTitle = titleInput.trim();
    if (nextTitle === filters.title) return;

    setPage(0);
    setFilters((current) => ({
      ...current,
      title: nextTitle,
    }));
  };

  const handleStatusChange = (value) => {
    setPage(0);
    setFilters((current) => ({ ...current, status: value }));
  };

  const handleAuthorChange = (value) => {
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
        <div className="article-title-search">
          <label htmlFor="article-title-search">Tên bài viết</label>
          <div className="article-search-input-wrap">
            <FiSearch aria-hidden="true" />
            <input
              id="article-title-search"
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Nhập tên bài viết cần tìm..."
            />
          </div>
        </div>

        <div className="article-filter-field">
          <label htmlFor="article-status-filter">Trạng thái</label>
          <ArticleFilterSelect
            id="article-status-filter"
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={handleStatusChange}
            disabled={loading}
            ariaLabel="Lọc theo trạng thái bài viết"
          />
        </div>

        {isAdmin && (
          <div className="article-filter-field">
            <label htmlFor="article-author-filter">Người viết</label>
            <ArticleFilterSelect
              id="article-author-filter"
              value={filters.author}
              options={[
                { value: "", label: "Tất cả người viết" },
                ...authors.map((author) => ({ value: author, label: author })),
              ]}
              onChange={handleAuthorChange}
              disabled={loading}
              ariaLabel="Lọc theo người viết"
            />
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
