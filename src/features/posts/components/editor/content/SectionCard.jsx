import { Trash2 } from "lucide-react";

import RichTextMarkdownEditor from "@/features/posts/components/editor/content/RichTextMarkdownEditor";

import "./SectionCard.css";

const SECTION_TITLE_MAX_LENGTH = 100;
const SECTION_CONTENT_MAX_LENGTH = 1000;

export default function SectionCard({
  section,
  readOnly,
  index,
  article,
  setArticle,
}) {
  const updateSection = (field, value) => {
    setArticle((prev) => ({
      ...prev,
      content: prev.content.map((item) =>
        item.id === section.id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeSection = () => {
    if (readOnly) return;

    if (article.content.length === 1) {
      alert("Bài viết phải có ít nhất một mục.");
      return;
    }

    setArticle((prev) => ({
      ...prev,
      content: prev.content.filter((item) => item.id !== section.id),
    }));
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <span>NỘI DUNG {index + 1}</span>

        {!readOnly && (
          <button type="button" onClick={removeSection} aria-label={`Xóa nội dung ${index + 1}`}>
            <Trash2 size={17} />
          </button>
        )}
      </div>

      <input
        value={section.title}
        placeholder={`Tiêu đề ${index + 1}`}
        maxLength={SECTION_TITLE_MAX_LENGTH}
        onChange={(e) => updateSection("title", e.target.value)}
        readOnly={readOnly}
      />

      {!readOnly && (
        <div className="section-title-counter">
          {(section.title ?? "").length}/{SECTION_TITLE_MAX_LENGTH}
        </div>
      )}

      <RichTextMarkdownEditor
        value={section.content ?? ""}
        onChange={(value) => updateSection("content", value)}
        readOnly={readOnly}
        placeholder="Nhập nội dung..."
        minHeight={140}
        maxLength={SECTION_CONTENT_MAX_LENGTH}
        ariaLabel={`Nội dung chi tiết ${index + 1}`}
      />
    </div>
  );
}
