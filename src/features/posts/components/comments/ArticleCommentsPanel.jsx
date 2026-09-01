import "./ArticleCommentsPanel.css";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function ArticleCommentsPanel({
  comments = [],
  loading = false,
  onRefresh,
}) {
  return (
    <section className="article-comments-panel">
      <div className="article-comments-panel__header">
        <div>
          <h2>Bình luận bài viết</h2>
          <p>{comments.length} bình luận công khai trên ứng dụng</p>
        </div>
        <button
          type="button"
          className="article-comments-panel__refresh"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {loading && comments.length === 0 ? (
        <div className="article-comments-panel__empty">Đang tải bình luận...</div>
      ) : comments.length === 0 ? (
        <div className="article-comments-panel__empty">
          Bài viết chưa có bình luận nào.
        </div>
      ) : (
        <div className="article-comments-panel__list">
          {comments.map((comment) => (
            <article className="article-comment-item" key={comment.id}>
              <div className="article-comment-item__meta">
                <strong>{comment.authorName || "Người dùng SSCare"}</strong>
                <time dateTime={comment.createdAt || undefined}>
                  {formatDateTime(comment.createdAt)}
                </time>
              </div>
              <div className="article-comment-item__content">
                {comment.content}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
