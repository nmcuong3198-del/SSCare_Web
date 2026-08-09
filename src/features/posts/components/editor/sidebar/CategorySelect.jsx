import "./CategorySelect.css";

const CATEGORY_LIST = [
  { id: 1, name: "Hiểu con" },
  { id: 2, name: "Cùng con" },
  { id: 3, name: "Báo cáo" },
];

export default function CategorySelect({
  article,
  setArticle,
  loading = false,
  readOnly = false,
}) {
  const handleChange = (e) => {
    const categoryId = Number(e.target.value);

    const category = CATEGORY_LIST.find((item) => item.id === categoryId);

    setArticle((prev) => ({
      ...prev,
      cateId: category?.id ?? "",
      cateName: category?.name ?? "",
    }));
  };

  return (
    <div className="sidebar-group">
      <label>Thư mục liên quan</label>

      <select value={article.cateId} onChange={handleChange} disabled={loading || readOnly}>
        {CATEGORY_LIST.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
