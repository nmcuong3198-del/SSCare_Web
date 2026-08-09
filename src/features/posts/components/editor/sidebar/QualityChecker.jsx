import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { isArticleReadyForQualityCheck } from "@/features/posts/utils/articleValidator";

import "./QualityChecker.css";

const FORBIDDEN_WORDS = ["đánh", "giết", "chửi", "ngu", "khùng"];

export default function QualityChecker({
  article,
  imageFile,
  readOnly,
  setArticle,
}) {
  const [scanResult, setScanResult] = useState(null);
  const sections = Array.isArray(article.content) ? article.content : [];
  const canCheck = isArticleReadyForQualityCheck(article, imageFile);

  const checked = readOnly
    ? Boolean(article.qualityChecked)
    : scanResult !== null;
  const passed = readOnly
    ? Boolean(article.qualityChecked)
    : scanResult?.length === 0;
  const badWords = scanResult || [];

  const handleCheck = () => {
    if (!canCheck) return;

    const content = [
      article.title,
      article.summary,
      article.conclusion,
      ...sections.map((section) => section.title),
      ...sections.map((section) => section.content),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const foundWords = FORBIDDEN_WORDS.filter((word) =>
      content.includes(word),
    );

    setScanResult(foundWords);
    setArticle((previousArticle) => ({
      ...previousArticle,
      qualityChecked: foundWords.length === 0,
    }));
  };

  return (
    <div className="quality-card">
      <div className="quality-title">
        📝 <span>KIỂM TRA CHẤT LƯỢNG</span>
      </div>

      <div className="quality-result">
        <span>
          {checked
            ? passed
              ? "Ngôn ngữ phù hợp"
              : "Ngôn ngữ chưa phù hợp"
            : "Chưa kiểm tra"}
        </span>

        {checked &&
          (passed ? (
            <CheckCircle2 size={22} className="quality-success" />
          ) : (
            <XCircle size={22} className="quality-error" />
          ))}
      </div>

      {!readOnly && (
        <>
          <button
            type="button"
            className="quality-button"
            onClick={handleCheck}
            disabled={!canCheck}
            title={
              canCheck
                ? "Kiểm tra từ cấm"
                : "Vui lòng nhập đầy đủ các trường bắt buộc trước"
            }
          >
            🛡 Kiểm tra từ cấm
          </button>
          <p className="quality-desc">
            {canCheck
              ? "Hệ thống sẽ quét toàn bộ bài viết để tìm các từ ngữ không phù hợp với trẻ em."
              : "Nhập đầy đủ các trường bắt buộc để sử dụng chức năng kiểm tra từ cấm."}
          </p>
        </>
      )}

      {!readOnly && checked && !passed && (
        <div className="bad-word-list">
          <strong>Đã phát hiện:</strong>
          <ul>
            {badWords.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
