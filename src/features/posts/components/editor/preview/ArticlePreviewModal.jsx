import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Markdown from "react-markdown";

import {
  buildContentBlocks,
  estimateReadMinutes,
} from "@/features/posts/utils/articleBlocks";

import "./ArticlePreviewModal.css";

const CATEGORY_LABELS = {
  mental: "Sức khỏe tinh thần",
  physical: "Sức khỏe thể chất",
  skills: "Kỹ năng sống",
  alerts: "Dấu hiệu cảnh báo",
};

// The app drops every markdown image, so showing one here would promise something the reader
// never sees. Rendered as a warning instead of silently vanishing.
const markdownComponents = {
  img: ({ alt }) => (
    <span className="article-preview__dropped-image">
      Ảnh trong nội dung sẽ không hiển thị trên ứng dụng{alt ? `: ${alt}` : ""}
    </span>
  ),
};

export default function ArticlePreviewModal({
  open,
  onClose,
  article,
  imageFile,
}) {
  const coverUrl = useMemo(() => {
    if (!imageFile) return null;
    return typeof imageFile === "string"
      ? imageFile
      : URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (coverUrl?.startsWith("blob:")) URL.revokeObjectURL(coverUrl);
    };
  }, [coverUrl]);

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
                  <Markdown components={markdownComponents}>
                    {block.markdown}
                  </Markdown>
                </div>
              ))
            )}

            {article?.hashtags?.length > 0 && (
              <div className="article-preview__tags">
                {article.hashtags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
