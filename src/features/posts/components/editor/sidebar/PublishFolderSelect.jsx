import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import articleService from "@/features/posts/services/articleService";
import "./PublishFolderSelect.css";

// The keys come from the server because they are the vocabulary the mobile app uses to build
// its library tabs; a folder the app does not know about would be unreachable content.
export default function PublishFolderSelect({
  article,
  setArticle,
  loading = false,
  readOnly = false,
}) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let cancelled = false;

    articleService
      .getCategories()
      .then((data) => {
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setCategories(list);

        setArticle((previousArticle) =>
          previousArticle.cateName || list.length === 0
            ? previousArticle
            : { ...previousArticle, cateName: list[0].key },
        );
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải thư mục bài viết:", error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setArticle]);

  const handleChange = (event) => {
    const { value } = event.target;

    setArticle((previousArticle) => ({
      ...previousArticle,
      cateName: value,
    }));
  };

  return (
    <section className="publish-folder-card">
      <div className="publish-folder-card__title">
        <FolderOpen size={18} strokeWidth={2} />
        <span>THƯ MỤC ĐĂNG TẢI BÀI VIẾT</span>
      </div>

      <div className="publish-folder-card__field">
        <label htmlFor="publish-folder-select">Chọn thư mục</label>

        <select
          id="publish-folder-select"
          value={article?.cateName ?? ""}
          onChange={handleChange}
          disabled={loading || readOnly || loadingCategories}
        >
          <option value="" disabled>
            {loadingCategories ? "Đang tải thư mục..." : "Chọn thư mục"}
          </option>

          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}