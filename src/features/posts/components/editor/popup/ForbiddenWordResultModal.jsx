import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import "./ForbiddenWordResultModal.css";

export default function ForbiddenWordResultModal({ open, result, onClose }) {
  if (!open || !result) return null;

  const matches = Array.isArray(result.matches) ? result.matches : [];
  const clean = result.clean === true;
  const uniqueWords = [...new Set(matches.map((item) => item.word).filter(Boolean))];

  return (
    <div className="forbidden-result-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="forbidden-result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forbidden-result-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="forbidden-result-close"
          onClick={onClose}
          aria-label="Đóng kết quả kiểm tra"
        >
          <X size={20} />
        </button>

        <div className={`forbidden-result-icon ${clean ? "is-clean" : "has-issues"}`}>
          {clean ? <CheckCircle2 size={30} /> : <AlertTriangle size={30} />}
        </div>

        <h2 id="forbidden-result-title">
          {clean ? "Không phát hiện từ cấm" : "Phát hiện nội dung cần chỉnh sửa"}
        </h2>

        <p className="forbidden-result-summary">
          {clean
            ? "Toàn bộ nội dung bài viết đã vượt qua kiểm tra từ cấm hiện tại trong hệ thống."
            : `Phát hiện ${matches.length} vị trí, thuộc ${uniqueWords.length} từ/cụm từ cấm.`}
        </p>

        {!clean && (
          <div className="forbidden-result-list">
            {matches.map((match, index) => (
              <div
                className="forbidden-result-item"
                key={`${match.location}-${match.startIndex}-${match.endIndex}-${match.word}-${index}`}
              >
                <div className="forbidden-result-item__top">
                  <span className="forbidden-result-word">{match.word}</span>
                  <span className="forbidden-result-location">{match.location}</span>
                </div>
                <div className="forbidden-result-excerpt">“{match.excerpt}”</div>
              </div>
            ))}
          </div>
        )}

        <div className="forbidden-result-footer">
          <button type="button" onClick={onClose}>
            {clean ? "Hoàn tất" : "Đóng và chỉnh sửa"}
          </button>
        </div>
      </div>
    </div>
  );
}
