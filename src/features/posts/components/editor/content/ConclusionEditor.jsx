import "./ConclusionEditor.css";

const MAX_LENGTH = 500;

export default function ConclusionEditor({
  article,
  setArticle,
  readOnly,
  loading,
}) {


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
        value={article.conclusion}
        onChange={handleChange}
        readOnly={readOnly}
      />

      <div className="char-counter">
        {article.conclusion.length}/{MAX_LENGTH}
      </div>

    </div>

  );

}