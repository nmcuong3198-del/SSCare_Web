import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";

import articleService from "@/features/posts/services/articleService";
import Select from "@/shared/components/ui/Select/Select";

import "./PublishFolderSelect.css";

const PUBLISH_CATEGORIES = [
  { key: "mental", label: "Nuôi dưỡng tinh thần" },
  { key: "physical", label: "Phát triển thể chất" },
  { key: "skills", label: "Bồi đắp kỹ năng" },
];

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

        const serverCategories = Array.isArray(data) ? data : [];
        const serverByKey = new Map(
          serverCategories.map((category) => [category.key, category]),
        );

        // CMS chỉ cho phép đúng 3 thư mục nghiệp vụ này.
        const list = PUBLISH_CATEGORIES.filter((category) =>
          serverByKey.has(category.key),
        ).map((category) => ({
          ...serverByKey.get(category.key),
          key: category.key,
          label: category.label,
        }));

        setCategories(list);

        setArticle((previousArticle) => {
          if (previousArticle.cateName || list.length === 0) {
            return previousArticle;
          }
          return { ...previousArticle, cateName: list[0].key };
        });
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

  const folderOptions = categories.map((category) => ({
    value: category.key,
    label: category.label,
  }));

  const handleChange = (value) => {
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

        <Select
          id="publish-folder-select"
          value={article?.cateName ?? ""}
          options={folderOptions}
          onChange={handleChange}
          placeholder={loadingCategories ? "Đang tải thư mục..." : "Chọn thư mục"}
          disabled={loading || readOnly || loadingCategories}
          ariaLabel="Chọn thư mục đăng tải bài viết"
        />
      </div>
    </section>
  );
}
