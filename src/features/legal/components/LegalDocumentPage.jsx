import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "@/features/legal/pages/LegalPage.css";

function formatEffectiveDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function LegalDocumentPage({
  title,
  introNote,
  blocks = [],
  version,
  effectiveAt,
  loading = false,
  error = "",
  onRetry,
}) {
  const navigate = useNavigate();
  const effectiveDate = formatEffectiveDate(effectiveAt);

  return (
    <div className="legal-page">
      <section className="legal-hero" aria-labelledby="legal-page-title">
        <div className="legal-shell">
          <button type="button" className="legal-back" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>

          <div className="legal-title-wrap">
            <span className="legal-eyebrow">SSCare</span>
            <h1 id="legal-page-title">{title}</h1>
            {(version || effectiveDate) && (
              <p className="legal-version">
                {version && <span>Phiên bản {version}</span>}
                {version && effectiveDate && <span aria-hidden="true">•</span>}
                {effectiveDate && <span>Hiệu lực từ {effectiveDate}</span>}
              </p>
            )}
            {introNote && <p className="legal-note">{introNote}</p>}
          </div>
        </div>
      </section>

      <section className="legal-content-section">
        <article className="legal-document">
          {loading && (
            <div className="legal-state" role="status">
              Đang tải nội dung...
            </div>
          )}

          {!loading && error && (
            <div className="legal-state legal-state-error" role="alert">
              <p>{error}</p>
              {onRetry && (
                <button type="button" onClick={onRetry}>
                  Thử lại
                </button>
              )}
            </div>
          )}

          {!loading && !error && blocks.map((block, index) => {
            const key = `${block.type}-${index}`;

            if (block.type === "heading") {
              return <h2 key={key}>{block.text}</h2>;
            }

            if (block.type === "subheading") {
              return <h3 key={key}>{block.text}</h3>;
            }

            if (block.type === "list") {
              return (
                <ul key={key}>
                  {(block.items || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              );
            }

            if (block.type === "contact") {
              return (
                <div className="legal-contact" key={key}>
                  {(block.lines || []).map((line) => <p key={line}>{line}</p>)}
                </div>
              );
            }

            return <p key={key}>{block.text}</p>;
          })}
        </article>
      </section>
    </div>
  );
}
