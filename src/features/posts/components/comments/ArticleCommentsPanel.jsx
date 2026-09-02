import { Trash2 } from "lucide-react";

import "./ArticleCommentsPanel.css";

function formatCommentTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0 || diffMs < 60_000) return "Vừa xong";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes} phút`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày`;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function byCreatedAtAsc(a, b) {
  return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
}

function byCreatedAtDesc(a, b) {
  return byCreatedAtAsc(b, a);
}

function buildCommentTree(comments) {
  const nodes = new Map(
      comments
          .filter((comment) => comment?.id)
          .map((comment) => [comment.id, { ...comment, children: [] }]),
  );
  const roots = [];

  nodes.forEach((node) => {
    const parent = node.parentId ? nodes.get(node.parentId) : null;
    if (parent && parent.id !== node.id) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortChildren = (node, visited = new Set()) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);
    node.children.sort(byCreatedAtAsc);
    node.children.forEach((child) => sortChildren(child, visited));
  };

  roots.sort(byCreatedAtDesc);
  roots.forEach((root) => sortChildren(root));
  return roots;
}

function CommentNode({
                       comment,
                       depth,
                       canDelete,
                       deletingCommentId,
                       onDeleteComment,
                     }) {
  return (
      <div className={`article-comment-thread__node${depth > 0 ? " is-reply" : ""}`}>
        <article className="article-comment-item">
          <div className="article-comment-item__meta">
            <strong title={comment.authorName || "Người dùng SSCare"}>
              {comment.authorName || "Người dùng SSCare"}
            </strong>
            <div className="article-comment-item__meta-actions">
              <time dateTime={comment.createdAt || undefined}>
                {formatCommentTime(comment.createdAt)}
              </time>
              {canDelete && (
                  <button
                      type="button"
                      className="article-comment-item__delete"
                      title="Xóa bình luận"
                      aria-label={`Xóa bình luận của ${comment.authorName || "người dùng"}`}
                      disabled={deletingCommentId === comment.id}
                      onClick={() => onDeleteComment?.(comment)}
                  >
                    <Trash2 size={15} />
                  </button>
              )}
            </div>
          </div>

          <div className="article-comment-item__content">{comment.content}</div>
        </article>

        {comment.children.length > 0 && (
            <div className="article-comment-thread__children">
              {comment.children.map((child) => (
                  <CommentNode
                      key={child.id}
                      comment={child}
                      depth={depth + 1}
                      canDelete={canDelete}
                      deletingCommentId={deletingCommentId}
                      onDeleteComment={onDeleteComment}
                  />
              ))}
            </div>
        )}
      </div>
  );
}

export default function ArticleCommentsPanel({
                                               comments = [],
                                               loading = false,
                                               onRefresh,
                                               canDelete = false,
                                               deletingCommentId = null,
                                               onDeleteComment,
                                             }) {
  const title = comments.length > 0 ? `Bình luận (${comments.length})` : "Bình luận";
  const tree = buildCommentTree(comments);

  return (
      <section className="article-comments-panel">
        <div className="article-comments-panel__header">
          <h2>{title}</h2>
          <button
              type="button"
              className="article-comments-panel__refresh"
              onClick={onRefresh}
              disabled={loading}
              aria-label="Tải lại bình luận"
              title="Tải lại bình luận"
          >
            <span aria-hidden="true">↻</span>
            <span>{loading ? "Đang tải..." : "Làm mới"}</span>
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
              {tree.map((comment) => (
                  <CommentNode
                      key={comment.id}
                      comment={comment}
                      depth={0}
                      canDelete={canDelete}
                      deletingCommentId={deletingCommentId}
                      onDeleteComment={onDeleteComment}
                  />
              ))}
            </div>
        )}
      </section>
  );
}
