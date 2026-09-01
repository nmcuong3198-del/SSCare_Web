import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, EyeOff, Loader2, XCircle } from "lucide-react";

import ForbiddenWordResultModal from "@/features/posts/components/editor/popup/ForbiddenWordResultModal";
import articleService from "@/features/posts/services/articleService";
import { createForbiddenWordCheckPayload } from "@/features/posts/utils/articlePayload";
import { isArticleReadyForQualityCheck } from "@/features/posts/utils/articleValidator";

import "./QualityChecker.css";

export default function QualityChecker({
  article,
  readOnly,
  setArticle,
}) {
  const [scanResult, setScanResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const canCheck = isArticleReadyForQualityCheck(article);

  const checked = scanResult !== null || Boolean(article.qualityChecked);
  const passed = scanResult !== null
    ? scanResult.clean === true
    : Boolean(article.qualityChecked);

  const handleCheck = async () => {
    if (!canCheck || checking) return;

    try {
      setChecking(true);
      const result = await articleService.checkForbiddenWords(
        createForbiddenWordCheckPayload(article),
      );

      setScanResult(result);
      setArticle((previousArticle) => ({
        ...previousArticle,
        qualityChecked: result.clean === true,
      }));
      setShowResult(true);
    } catch (error) {
      console.error("Không thể kiểm tra từ cấm:", error);
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Không thể kiểm tra từ cấm. Vui lòng thử lại.",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleAnonymousChange = (event) => {
    const checkedValue = event.target.checked;
    setArticle((previousArticle) => ({
      ...previousArticle,
      anonymousAuthor: checkedValue,
    }));
  };

  return (
    <>
      {checking && (
        <div className="quality-loading-overlay" role="status" aria-live="polite">
          <div className="quality-loading-box">
            <Loader2 size={34} className="quality-loading-spinner" />
            <strong>Đang kiểm tra từ cấm...</strong>
            <span>Hệ thống đang đối chiếu nội dung với danh sách trong cơ sở dữ liệu.</span>
          </div>
        </div>
      )}

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
              disabled={!canCheck || checking}
              title={canCheck ? "Kiểm tra từ cấm" : "Vui lòng nhập nội dung bài viết trước"}
            >
              {checking ? (
                <>
                  <Loader2 size={18} className="quality-button-spinner" />
                  Đang kiểm tra...
                </>
              ) : (
                <>🛡 Kiểm tra từ cấm</>
              )}
            </button>
            {!canCheck && (
              <p className="quality-desc">
                Nhập nội dung bài viết để sử dụng chức năng kiểm tra từ cấm.
              </p>
            )}
          </>
        )}

        {!readOnly && scanResult && !scanResult.clean && (
          <button
            type="button"
            className="quality-detail-button"
            onClick={() => setShowResult(true)}
          >
            Xem {scanResult.totalMatches || scanResult.matches?.length || 0} vị trí cần chỉnh sửa
          </button>
        )}

        <div className="anonymous-author-option">
          <div className="anonymous-author-option__icon">
            <EyeOff size={18} />
          </div>
          <label
            htmlFor="anonymous-author-checkbox"
            className="anonymous-author-option__content"
          >
            <span className="anonymous-author-option__title">
              Ẩn danh người viết bài
            </span>
            <span className="anonymous-author-option__desc">
              Khi bật, tên người viết sẽ được che khi hiển thị bài viết.
            </span>
          </label>
          <input
            id="anonymous-author-checkbox"
            type="checkbox"
            checked={article.anonymousAuthor === true}
            onChange={handleAnonymousChange}
            disabled={readOnly}
            aria-label="Ẩn danh người viết bài"
          />
        </div>
      </div>

      <ForbiddenWordResultModal
        open={showResult}
        result={scanResult}
        onClose={() => setShowResult(false)}
      />
    </>
  );
}
