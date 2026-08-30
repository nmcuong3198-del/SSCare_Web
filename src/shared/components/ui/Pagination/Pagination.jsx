import "./Pagination.css";

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) {
  if (totalPages === 0) return null;

  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  const changePage = (nextPage) => {
    if (nextPage === currentPage || nextPage < 0 || nextPage >= totalPages) {
      return;
    }
    onPageChange(nextPage);
  };

  return (
    <div className="pagination">
      <div className="pagination-summary">
        Hiển thị {start}-{end} trong {totalElements}
      </div>

      <div className="page-group">
        <button
          type="button"
          disabled={currentPage === 0}
          onClick={() => changePage(currentPage - 1)}
          aria-label="Trang trước"
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const isCurrent = index === currentPage;
          return (
            <button
              type="button"
              key={index}
              className={isCurrent ? "active" : ""}
              disabled={isCurrent}
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => changePage(index)}
            >
              {index + 1}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages - 1}
          onClick={() => changePage(currentPage + 1)}
          aria-label="Trang sau"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
