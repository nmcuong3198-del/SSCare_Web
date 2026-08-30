import { useEffect, useMemo } from "react";
import { X } from "lucide-react";

import authService from "@/features/auth/services/authService";
import {
  buildContentBlocks,
  estimateReadMinutes,
} from "@/features/posts/utils/articleBlocks";
import useArticleImagePreview from "@/features/posts/utils/useArticleImagePreview";

import "./ArticlePreviewModal.css";

const CATEGORY_LABELS = {
  mental: "Sức khỏe tinh thần",
  physical: "Sức khỏe thể chất",
  skills: "Kỹ năng sống",
  alerts: "Dấu hiệu cảnh báo",
};

function MarkdownPreview({ markdown = "" }) {
  const lines = markdown.split(/\r?\n/);
  return (
    <>
      {lines.map((line, index) => {
        const text = line.trim();
        if (!text) return <br key={`br-${index}`} />;
        if (text.startsWith("## ")) {
          return <h2 key={`h-${index}`}>{text.slice(3)}</h2>;
        }
        if (/^!\[[^\]]*\]\([^)]*\)$/.test(text)) {
          return (
            <p key={`img-${index}`} className="article-preview__dropped-image">
              Ảnh trong nội dung sẽ không hiển thị trên ứng dụng
            </p>
          );
        }
        return <p key={`p-${index}`}>{line}</p>;
      })}
    </>
  );
}

function maskAuthorName(value) {
  const name = String(value ?? "").trim();
  if (!name) return "Người viết";

  const characters = Array.from(name).filter((character) => !/\s/.test(character));
  if (characters.length === 0) return "Người viết";
  if (characters.length === 1) return `${characters[0]}****${characters[0]}`;
  return `${characters[0]}****${characters[characters.length - 1]}`;
}

function currentAuthorName(article) {
  if (article?.authorName) return article.authorName;

  const currentUser = authService.getCurrentUser();
  return (
    currentUser?.fullName ||
    currentUser?.displayName ||
    currentUser?.username ||
    "Người viết"
  );
}

export default function ArticlePreviewModal({
  open,
  onClose,
  article,
  imageFile,
}) {
  const coverUrl = useArticleImagePreview(imageFile);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const blocks = useMemo(
    () => buildContentBlocks(article?.content, article?.conclusion),
    [article?.content, article?.conclusion],
  );

  if (!open) return null;

  const category = article?.cateName;
  const rawAuthorName = currentAuthorName(article);
  const authorName = article?.anonymousAuthor
    ? maskAuthorName(rawAuthorName)
    : rawAuthorName;

  return (
    <div
      className="article-preview__backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="article-preview"
        role="dialog"
        aria-modal="true"
        aria-label="Xem trước bài viết"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="article-preview__bar">
          <div>
            <strong>Xem trước</strong>
            <span className="article-preview__hint">
              Hiển thị gần đúng như trên ứng dụng
            </span>
          </div>

          <button
            type="button"
            className="article-preview__close"
            onClick={onClose}
            aria-label="Đóng xem trước"
          >
            <X size={18} />
          </button>
        </header>

        <div className="article-preview__phone">
          <article className="article-preview__body">
            {coverUrl && (
              <img
                className="article-preview__cover"
                src={coverUrl}
                alt={article?.title || "Ảnh bìa"}
              />
            )}

            <div className="article-preview__meta">
              {category && (
                <span className="article-preview__chip">
                  {CATEGORY_LABELS[category] ?? category}
                </span>
              )}
              <span className="article-preview__minutes">
                {estimateReadMinutes(blocks)} phút đọc
              </span>
            </div>

            <div className="article-preview__author">
              Người viết: <strong>{authorName}</strong>
            </div>

            <h1 className="article-preview__title">
              {article?.title || "Chưa có tiêu đề"}
            </h1>

            {article?.summary && (
              <p className="article-preview__excerpt">{article.summary}</p>
            )}

            {blocks.length === 0 ? (
              <p className="article-preview__empty">
                Chưa có nội dung để xem trước.
              </p>
            ) : (
              blocks.map((block) => (
                <div key={block.id} className="article-preview__block">
                  <MarkdownPreview markdown={block.markdown} />
                </div>
              ))
            )}

            {article?.hashtags?.length > 0 && (
              <div className="article-preview__tags">
                {article.hashtags.map((tag, index) => (
                  <span key={`${String(tag)}-${index}`}>
                    #{String(tag)}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
