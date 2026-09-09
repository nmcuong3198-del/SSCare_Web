import "./Pagination.css";

const ELLIPSIS = "ellipsis";

/**
 * Chỉ hiển thị một cửa sổ nhỏ quanh trang hiện tại để phân trang không tràn
 * khi dữ liệu có nhiều trang.
 *
 * Ví dụ 31 trang, đang ở trang 15:
 * 1 … 14 15 16 … 31
 */
const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  if (currentPage <= 3) {
    return [0, 1, 2, 3, 4, ELLIPSIS, totalPages - 1];
  }

  if (currentPage >= totalPages - 4) {
    return [
      0,
      ELLIPSIS,
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
    ];
  }

  return [
    0,
    ELLIPSIS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    ELLIPSIS,
    totalPages - 1,
  ];
};

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  disabled = false,
}) {
  const normalizedTotalPages = Math.max(0, Number(totalPages) || 0);
  const normalizedTotalElements = Math.max(0, Number(totalElements) || 0);
  const normalizedPageSize = Math.max(1, Number(pageSize) || 1);

  if (normalizedTotalPages === 0 || normalizedTotalElements === 0) return null;

  const safeCurrentPage = Math.min(
    Math.max(0, Number(currentPage) || 0),
    normalizedTotalPages - 1,
  );

  const start = safeCurrentPage * normalizedPageSize + 1;
  const end = Math.min(
    (safeCurrentPage + 1) * normalizedPageSize,
    normalizedTotalElements,
  );
  const pageItems = buildPageItems(safeCurrentPage, normalizedTotalPages);

  const changePage = (nextPage) => {
    if (
      disabled ||
      nextPage === safeCurrentPage ||
      nextPage < 0 ||
      nextPage >= normalizedTotalPages
    ) {
      return;
    }
    onPageChange(nextPage);
  };

  return (
    <nav className="pagination" aria-label="Phân trang">
      <div className="pagination-summary" aria-live="polite">
        Hiển thị {start}-{end} trong {normalizedTotalElements}
      </div>

      <div className="page-group">
        <button
          type="button"
          className="page-nav-button"
          disabled={disabled || safeCurrentPage === 0}
          onClick={() => changePage(safeCurrentPage - 1)}
          aria-label="Trang trước"
          title="Trang trước"
        >
          ‹
        </button>

        {pageItems.map((item, index) => {
          if (item === ELLIPSIS) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="page-ellipsis"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isCurrent = item === safeCurrentPage;
          return (
            <button
              type="button"
              key={item}
              className={isCurrent ? "active" : ""}
              disabled={disabled || isCurrent}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Trang ${item + 1}`}
              onClick={() => changePage(item)}
            >
              {item + 1}
            </button>
          );
        })}

        <button
          type="button"
          className="page-nav-button"
          disabled={disabled || safeCurrentPage === normalizedTotalPages - 1}
          onClick={() => changePage(safeCurrentPage + 1)}
          aria-label="Trang sau"
          title="Trang sau"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
