import { useState } from "react";
import { Plus, X } from "lucide-react";

import "./HashTagInput.css";

export default function HashTagInput({ article, readOnly, setArticle }) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const tag = value.trim();

    if (!tag) return;

    if (article.hashtags.includes(tag)) return;

    if (article.hashtags.length >= 10) {
      alert("Tối đa 10 hashtag");

      return;
    }

    setArticle((prev) => ({
      ...prev,

      hashtags: [...prev.hashtags, tag],
    }));

    setValue("");
  };

  return (
    <div>
      <label className="tag-title">Hashtags (Tối đa 10)</label>

      <div className="tag-list">
        {article.hashtags.map((tag) => (
          <div className="tag-chip" key={tag}>
            #{tag}
            {!readOnly && (
              <X
                size={14}
                onClick={() => {
                  setArticle((prev) => ({
                    ...prev,
                    hashtags: prev.hashtags.filter((item) => item !== tag),
                  }));
                }}
              />
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="tag-input-wrapper">
          <input
            value={value}
            placeholder="Thêm hashtag..."
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />

          <button type="button" onClick={addTag}>
            <Plus size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
