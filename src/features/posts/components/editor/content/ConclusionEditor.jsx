import RichTextMarkdownEditor from "@/features/posts/components/editor/content/RichTextMarkdownEditor";

import "./ConclusionEditor.css";

const MAX_LENGTH = 500;

export default function ConclusionEditor({
  article,
  setArticle,
  readOnly,
  loading,
}) {
  // Null for any article whose body has no conclusion block, which is everything not written
  // in this editor: the app's own content, and anything imported.
  const conclusion = article.conclusion ?? "";

  const handleChange = (value) => {
    setArticle((prev) => ({
      ...prev,
      conclusion: value,
    }));
  };

  return (
    <div className="conclusion-card">
      <label>Lời kết</label>

      <RichTextMarkdownEditor
        value={conclusion}
        onChange={handleChange}
        readOnly={readOnly}
        disabled={loading}
        placeholder="Viết thông điệp cuối cùng hoặc lời khuyên tổng kết..."
        minHeight={120}
        maxLength={MAX_LENGTH}
        ariaLabel="Lời kết bài viết"
      />
    </div>
  );
}
