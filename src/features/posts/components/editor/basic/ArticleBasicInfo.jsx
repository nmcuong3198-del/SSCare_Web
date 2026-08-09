import "./ArticleBasicInfo.css";
import UploadCover from "@/features/posts/components/editor/basic/UploadCover";

const TITLE_MAX_LENGTH = 100;
const SUMMARY_MAX_LENGTH = 500;

export default function ArticleBasicInfo({
  article,
  setArticle,
  imageFile,
  setImageFile,
  readOnly,
  loading,
}) {

  /**
   * Cập nhật tiêu đề
   */
  const handleTitleChange = (event) => {
    const value = event.target.value;

    setArticle((prev) => ({
      ...prev,
      title: value,
    }));
  };

  /**
   * Cập nhật tóm tắt
   */
  const handleSummaryChange = (event) => {
    const value = event.target.value;

    setArticle((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  return (
    <div className="editor-card">

      {/* ===========================
            TIÊU ĐỀ
      =========================== */}

      <div className="editor-group">

        <label>
          Tiêu đề bài viết
        </label>

        <input
          type="text"
          className="editor-input"
          placeholder="Nhập tiêu đề..."
          maxLength={TITLE_MAX_LENGTH}
          disabled={loading}
          value={article.title}
          onChange={handleTitleChange}
          readOnly={readOnly}
        />

        <small className="editor-counter">
          {article.title.length}/{TITLE_MAX_LENGTH}
        </small>

      </div>

      {/* ===========================
            ẢNH BÌA
      =========================== */}

      <div className="editor-group">

        <label>
          Ảnh bìa bài viết
        </label>

        <UploadCover
          imageFile={imageFile}
          setImageFile={setImageFile}
          loading={loading}
          readOnly={readOnly}
        />

      </div>

      {/* ===========================
            TÓM TẮT
      =========================== */}

      <div className="editor-group">

        <label>
          Tóm tắt
        </label>

        <textarea
          rows={6}
          className="editor-textarea"
          placeholder="Nhập tóm tắt..."
          maxLength={SUMMARY_MAX_LENGTH}
          disabled={loading}
          value={article.summary}
          onChange={handleSummaryChange}
          readOnly={readOnly}
        />

        <small className="editor-counter">
          {article.summary.length}/{SUMMARY_MAX_LENGTH}
        </small>

      </div>

    </div>
  );
}