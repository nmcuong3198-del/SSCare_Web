import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "@/features/legal/pages/LegalPage.css";

export default function LegalDocumentPage({ title, introNote, blocks }) {
  const navigate = useNavigate();

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
            {introNote && <p className="legal-note">{introNote}</p>}
          </div>
        </div>
      </section>

      <section className="legal-content-section">
        <article className="legal-document">
          {blocks.map((block, index) => {
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
                  {block.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              );
            }

            if (block.type === "contact") {
              return (
                <div className="legal-contact" key={key}>
                  {block.lines.map((line) => <p key={line}>{line}</p>)}
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
