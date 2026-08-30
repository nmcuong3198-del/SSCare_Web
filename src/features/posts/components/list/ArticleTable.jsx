import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "@/features/posts/components/list/StatusBadge";

import "./ArticleTable.css";

export default function ArticleTable({ articles }) {
  const navigate = useNavigate();

  return (
      <div className="article-table-wrapper">
        <table className="article-table">
          <colgroup>
            <col className="article-col-code" />
            <col className="article-col-title" />
            <col className="article-col-status" />
            <col className="article-col-author" />
            <col className="article-col-action" />
          </colgroup>

          <thead>
          <tr>
            <th>Mã bài</th>
            <th>Tên bài</th>
            <th className="status-heading">Trạng thái</th>
            <th>Người viết</th>
            <th className="action-heading">Thao tác</th>
          </tr>
          </thead>

          <tbody>
          {articles.map((article) => (
              <tr key={article.code}>
                <td className="code-cell" data-label="Mã bài">
                  #{article.code}
                </td>
                <td className="title-cell" data-label="Tên bài">
                  {article.title}
                </td>
                <td className="status-cell" data-label="Trạng thái">
                  <StatusBadge status={article.status} />
                </td>
                <td className="author-cell" data-label="Người viết">
                  {article.authorName}
                </td>
                <td className="action-cell" data-label="Thao tác">
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
