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

  return (
    <div className="pagination">
      <div className="pagination-summary">
        Hiển thị {start}-{end} trong {totalElements}
      </div>

      <div className="page-group">
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={index === currentPage ? "active" : ""}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
