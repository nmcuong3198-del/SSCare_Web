import { useState } from 'react';

export default function ReportPreview({ sheet }) {
  const [page, setPage] = useState(0);
  const size = 31;
  const pages = Math.ceil(sheet.rows.length / size);
  return <section aria-label="Xem trước báo cáo vận hành">
    <div className="op-table-scroll" tabIndex={0}>
      <table>
        <thead><tr>{sheet.headers.map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead>
        <tbody>{sheet.rows.slice(page * size, (page + 1) * size).map(row =>
          <tr key={row[0]}><th scope="row">{row[0]}</th>{sheet.headers.slice(1).map((key, i) =>
            <td key={key}>{row[i + 1]}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {pages > 1 && <nav className="op-pagination" aria-label="Trang báo cáo">
      <button type="button" disabled={!page} onClick={() => setPage(page - 1)}>Trước</button>
      <span>{page + 1} / {pages}</span>
      <button type="button" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Sau</button>
    </nav>}
  </section>;
}
