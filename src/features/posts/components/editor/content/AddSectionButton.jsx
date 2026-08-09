import { CirclePlus } from "lucide-react";
import "./AddSectionButton.css";

const MAX_SECTIONS = 10;

export default function AddSectionButton({ article, setArticle, readOnly }) {
  const handleAddSection = () => {
    if (article.content.length >= MAX_SECTIONS) {
      alert(`Tối đa ${MAX_SECTIONS} mục nội dung.`);

      return;
    }

    setArticle((prev) => ({
      ...prev,

      content: [
        ...prev.content,

        {
          id: crypto.randomUUID(),

          title: "",

          content: "",
        },
      ],
    }));
  };
  
  // Không hiển thị nút khi ở chế độ chỉ đọc
  if (readOnly) {
    return null;
  }

  return (
    <div className="add-section-wrapper">
      <button
        type="button"
        className="add-section-btn"
        onClick={handleAddSection}
      >
        <CirclePlus size={18} />

        <span>
          Thêm mục nội dung ({article.content.length}/{MAX_SECTIONS})
        </span>
      </button>
    </div>
  );
}
