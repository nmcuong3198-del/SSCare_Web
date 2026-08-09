import { FolderOpen } from "lucide-react";
import "./PublishFolderSelect.css";

const DEFAULT_FOLDER_LIST = [
  { id: 1, name: "Nuôi dưỡng tinh thần" },
  { id: 2, name: "Phát triển thể chất" },
  { id: 3, name: "Bồi đắp kỹ năng" },
  { id: 4, name: "Sự kiện cảnh báo" },
];

export default function PublishFolderSelect({
  article,
  setArticle,
  folders = DEFAULT_FOLDER_LIST,
  loading = false,
  readOnly = false,
}) {
  const handleChange = (event) => {
    const folderId = Number(event.target.value);

    const selectedFolder = folders.find(
      (folder) => folder.id === folderId
    );

    setArticle((previousArticle) => ({
      ...previousArticle,
      folderId: selectedFolder?.id ?? "",
      folderName: selectedFolder?.name ?? "",
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
          value={article?.folderId ?? ""}
          onChange={handleChange}
          disabled={loading || readOnly}
        >
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}