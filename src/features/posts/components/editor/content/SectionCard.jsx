import { Trash2 } from "lucide-react";
import "./SectionCard.css";

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
          <button type="button" onClick={removeSection}>
            <Trash2 size={17} />
          </button>
        )}
      </div>

      <input
        value={section.title}
        placeholder={`Tiêu đề ${index + 1}`}
        onChange={(e) => updateSection("title", e.target.value)}
        readOnly={readOnly}
      />

      <textarea
        rows={6}
        value={section.content}
        placeholder="Nhập nội dung..."
        onChange={(e) => updateSection("content", e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}
