import { useEffect, useState } from 'react';
import service from '../services/operationalReportService';
import './OperationalReport.css';

const errorMessage = e => e?.response?.data?.detail || e?.response?.data?.message || 'Không tải được dữ liệu. Vui lòng thử lại.';

export default function ViolationReports() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('OPEN');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const busy = loading || saving;

  useEffect(() => {
    let live = true;
    service.support(status, page)
      .then(result => { if (live) setRows(result); })
      .catch(e => {
        if (live) {
          setRows([]);
          setError(errorMessage(e));
        }
      })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [status, page, revision]);

  const startListChange = () => {
    setLoading(true);
    setError('');
    setSelected(null);
  };

  const changePage = next => {
    startListChange();
    setPage(next);
  };

  const review = async next => {
    setSaving(true);
    setError('');
    try {
      await service.review(selected.id, next, selected.report_status, note);
      startListChange();
      setRevision(v => v + 1);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };
  return <main className="op-report"><section className="op-support"><h2>Xử lý báo cáo vi phạm</h2><p>Yêu cầu đã đóng không được mở lại. Chỉ chuyển trạng thái sau khi đã xử lý nghiệp vụ.</p>
    <select aria-label="Trạng thái vi phạm" value={status} disabled={saving} onChange={e=>{startListChange();setStatus(e.target.value);setPage(0);}}>{['ALL','OPEN','REVIEWING','RESOLVED','REJECTED'].map(s=><option key={s}>{s}</option>)}</select>
    {error&&<p role="alert" className="op-error">{error}</p>}{busy&&<p role="status">Đang tải…</p>}
    <div className="op-table-scroll"><table><thead><tr><th>Ngày tạo</th><th>Loại</th><th>Tiêu đề</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleString('vi-VN')}</td><td>{r.violation_type}</td><td>{r.subject||'—'}</td><td>{r.report_status}</td><td>{['OPEN','REVIEWING'].includes(r.report_status)&&<button disabled={busy} onClick={()=>{setSelected(r);setNote(r.review_note||'');}}>Xử lý</button>}</td></tr>)}</tbody></table>{!busy&&!rows.length&&<p>Không có yêu cầu phù hợp.</p>}</div>
    <div className="op-pagination"><button disabled={busy||page===0} onClick={()=>changePage(page - 1)}>Trước</button><span>Trang {page+1}</span><button disabled={busy||rows.length<50} onClick={()=>changePage(page + 1)}>Sau</button></div>
    {selected&&<div className="op-review"><h3>{selected.subject||selected.violation_type}</h3><p style={{whiteSpace:"pre-wrap"}}>{selected.description}</p><label>Ghi chú xử lý<textarea maxLength={500} value={note} onChange={e=>setNote(e.target.value)} /></label><button disabled={busy} onClick={()=>setSelected(null)}>Hủy</button>{selected.report_status==='OPEN'&&<button disabled={busy} onClick={()=>review('REVIEWING')}>Đang xử lý</button>}<button disabled={busy} onClick={()=>review('REJECTED')}>Từ chối</button><button className="op-primary" disabled={busy} onClick={()=>review('RESOLVED')}>Đã xử lý</button></div>}
  </section></main>;
}
