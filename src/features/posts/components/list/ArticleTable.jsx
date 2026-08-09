import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "@/features/posts/components/list/StatusBadge";

import "./ArticleTable.css";

export default function ArticleTable({ articles }) {
  const navigate = useNavigate();

  return (
    <div className="article-table-wrapper">
      <table className="article-table">
        <thead>
          <tr>
            <th>Mã bài</th>
            <th>Tên bài</th>
            <th>Trạng thái</th>
            <th>Người viết</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((article) => (
            <tr key={article.code}>
              <td data-label="Mã bài">#{article.code}</td>
              <td data-label="Tên bài">{article.title}</td>
              <td data-label="Trạng thái">
                <StatusBadge status={article.status} />
              </td>
              <td data-label="Người viết">{article.authorName}</td>
              <td data-label="Thao tác">
                <button
                  type="button"
                  className="detail-btn"
                  onClick={() => navigate(`/posts/${article.code}`)}
                >
                  <span>Xem chi tiết</span>
                  <ExternalLink size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
