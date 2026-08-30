import { Shapes } from "lucide-react";

import "./Sidebar.css";

import HashTagInput from "@/features/posts/components/editor/sidebar/HashTagInput";
import QualityChecker from "@/features/posts/components/editor/sidebar/QualityChecker";
import PublishFolderSelect from "@/features/posts/components/editor/sidebar/PublishFolderSelect";

export default function Sidebar({
  article,
  imageFile,
  readOnly,
  qualityRevision,
  setArticle,
  setQualityChecked,
}) {
  return (
    <>
      <PublishFolderSelect
        article={article}
        setArticle={setArticle}
        readOnly={readOnly}
      />
      <div className="sidebar-card">
        <div className="sidebar-header">
          <Shapes size={15} />
          <span>PHÂN LOẠI & GẮN THẺ</span>
        </div>

        <HashTagInput
          article={article}
          setArticle={setArticle}
          readOnly={readOnly}
        />
      </div>

      {article.status === "rejected" && article.rejectionReason && (
        <div className="sidebar-card rejection-reason-card">
          <div className="sidebar-header">
            <span>LÝ DO TỪ CHỐI</span>
          </div>
          <p>{article.rejectionReason}</p>
        </div>
      )}

      <QualityChecker
        key={qualityRevision}
        article={article}
        imageFile={imageFile}
        setArticle={setQualityChecked}
        readOnly={readOnly}
      />
    </>
  );
}
