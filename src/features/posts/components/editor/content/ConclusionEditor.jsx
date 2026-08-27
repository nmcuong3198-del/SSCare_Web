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

  const handleChange = (event) => {

    const value = event.target.value;

    setArticle((prev) => ({

      ...prev,

      conclusion: value,

    }));

  };

  return (

    <div className="conclusion-card">

      <label>
        Lời kết
      </label>

      <textarea
        rows={5}
        maxLength={MAX_LENGTH}
        disabled={loading}
        placeholder="Viết thông điệp cuối cùng hoặc lời khuyên tổng kết..."
        value={conclusion}
        onChange={handleChange}
        readOnly={readOnly}
      />

      <div className="char-counter">
        {conclusion.length}/{MAX_LENGTH}
      </div>

    </div>

  );

}