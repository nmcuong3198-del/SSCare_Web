import { useEffect, useMemo, useState } from 'react';
import service from '../services/operationalReportService';
import { defaultFilter, delta, formatValue, localDate, validateFilter } from '../utils/reportUtils';
import './OperationalReport.css';

const EMPTY_DEFINITIONS = [];
const statusNames = { UNAVAILABLE: 'Chưa thu thập', PARTIAL: 'Thiếu một phần', PROVISIONAL: 'Đang cập nhật', RECORDED: 'Đã ghi nhận' };
const errorMessage = e => e?.response?.data?.detail || e?.response?.data?.message || 'Không tải được dữ liệu. Vui lòng thử lại.';
function initialFilter() {
  const fallback = defaultFilter(); const p = new URLSearchParams(window.location.search);
  const f = { ...fallback, from: p.get('from') || fallback.from, to: p.get('to') || fallback.to, platforms: p.getAll('platforms'), versions: p.getAll('versions'), sources: p.getAll('sources'), campaigns: p.getAll('campaigns'), userType: p.get('userType') || 'ALL', comparePrevious: p.get('comparePrevious') === 'true' };
  return validateFilter(f) ? fallback : f;
}
export default function OperationalReport() {
  const [filter, setFilter] = useState(initialFilter);
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); const [versionOptions, setVersionOptions] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [group, setGroup] = useState('Tất cả'); const [page, setPage] = useState(0);
  const [tab, setTab] = useState('report'); const [note, setNote] = useState(null);
  const [saving, setSaving] = useState(false); const [exporting, setExporting] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [applied, setApplied] = useState(filter);
  useEffect(() => { service.filters().then(r => { setVersionOptions(r.versions || []); setCampaignOptions(r.campaigns || []); }).catch(() => {}); }, []);
  useEffect(() => {
    const controller = new AbortController();
    service.get(applied, controller.signal).then(result => {
      if (!controller.signal.aborted) { setData(result); setPage(0); }
    }).catch(e => { if (!controller.signal.aborted) { setError(errorMessage(e)); setData(null); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [applied, refresh]);
  const definitions = data?.definitions ?? EMPTY_DEFINITIONS;
  const columns = definitions.filter(d => group === 'Tất cả' || d.group === group);
  const daily = data?.daily || []; const visible = daily.slice(page * 15, (page + 1) * 15);
  const selected = useMemo(() => new Map(definitions.map(d => [d.key, d])), [definitions]);
  const reloadReport = () => {
    setLoading(true);
    setError('');
    setRefresh(v => v + 1);
  };
  const apply = e => {
    e.preventDefault(); const message = validateFilter(filter); if (message) { setError(message); return; }
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k,v]) => Array.isArray(v) ? v.forEach(x => params.append(k,x)) : params.set(k,String(v)));
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
    setLoading(true);
    setError('');
    setApplied({ ...filter }); setNote(null);
  };
  const saveNote = async () => {
    setSaving(true); try { await service.saveNote(note.date, note.note, note.noteVersion); setNote(null); reloadReport(); }
    catch (e) { setNote(current => current && ({ ...current, error: errorMessage(e) })); } finally { setSaving(false); }
  };
  const exportReport = async () => {
    setExporting(true); setError(''); try {
      const blob = await service.export(applied); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `SSCare_Report_${applied.from}_${applied.to}.xlsx`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setError(errorMessage(e)); } finally { setExporting(false); }
  };
  return <main className="op-report">
    <div className="op-heading"><div><span className="op-eyebrow">SSCARE · QUẢN TRỊ</span><h1>Báo cáo vận hành</h1><p>Theo dõi sử dụng ứng dụng và chất lượng dịch vụ theo ngày.</p></div>
      <button className="op-primary" disabled={loading || !data || exporting} onClick={exportReport}>{exporting ? 'Đang xuất…' : 'Xuất Excel'}</button></div>
    <div className="op-tabs"><button aria-pressed={tab === 'report'} onClick={() => setTab('report')}>Tổng quan vận hành</button><button aria-pressed={tab === 'support'} onClick={() => setTab('support')}>Xử lý báo cáo vi phạm</button></div>
    {error && <div role="alert" className="op-error">{error} <button onClick={reloadReport}>Tải lại</button></div>}
    {tab === 'support' ? <SupportPanel onChanged={reloadReport} /> : <>
    <form className="op-filters" onSubmit={apply}>
      <label>Từ ngày<input type="date" value={filter.from} max={localDate()} required onChange={e => setFilter({ ...filter, from: e.target.value })} /></label>
      <label>Đến ngày<input type="date" value={filter.to} max={localDate()} required onChange={e => setFilter({ ...filter, to: e.target.value })} /></label>
      <label>Nền tảng<select multiple value={filter.platforms} onChange={e => setFilter({ ...filter, platforms: Array.from(e.target.selectedOptions, o => o.value) })}>{['ANDROID','IOS','WEB','UNKNOWN'].map(p => <option key={p}>{p}</option>)}</select><small>Không chọn = tất cả</small></label>
      <label>Phiên bản app<select multiple value={filter.versions} onChange={e => setFilter({ ...filter, versions: Array.from(e.target.selectedOptions, o => o.value) })}>{versionOptions.map(v => <option key={v}>{v}</option>)}</select><small>Không chọn = tất cả</small></label>
      <label>Nguồn đăng ký<select multiple value={filter.sources} onChange={e => setFilter({...filter,sources:Array.from(e.target.selectedOptions,o=>o.value)})}>{Object.entries({ORGANIC:'Tự tìm thấy',FACEBOOK:'Facebook',TIKTOK:'TikTok',PARTNER:'Đối tác',CAMPAIGN:'Mã chiến dịch',OTHER:'Khác',UNKNOWN:'Chưa xác định'}).map(([value,name])=><option key={value} value={value}>{name}</option>)}</select><small>Không chọn = tất cả</small></label>
      <label>Chiến dịch<select multiple value={filter.campaigns} onChange={e => setFilter({...filter,campaigns:Array.from(e.target.selectedOptions,o=>o.value)})}>{campaignOptions.map(c=><option key={c}>{c}</option>)}</select><small>Không chọn = tất cả</small></label>
      <label>Loại người dùng<select value={filter.userType} onChange={e => setFilter({ ...filter, userType: e.target.value })}><option value="ALL">Tất cả</option><option value="NEW">Đăng ký trong kỳ</option><option value="RETURNING">Đăng ký trước kỳ</option></select></label>
      <label className="op-check"><input type="checkbox" checked={filter.comparePrevious} onChange={e => setFilter({ ...filter, comparePrevious: e.target.checked })} />So sánh kỳ trước</label>
      <div className="op-filter-actions"><button className="op-primary" type="submit">Áp dụng</button><button type="button" onClick={() => setFilter(defaultFilter())}>Đặt lại</button></div>
    </form>
    {loading ? <div className="op-loading" role="status">Đang tổng hợp dữ liệu…</div> : data && <>
      <div className="op-data-note"><strong>{statusNames[data.status]}</strong> · Múi giờ {data.timezone} · Cập nhật {new Date(data.dataAsOf).toLocaleString('vi-VN')}<br />{data.notice}<br />Bắt đầu ghi nhận: {new Date(data.trackingSince).toLocaleString('vi-VN')}. “—” là chưa có dữ liệu hoặc chỉ số không áp dụng cho bộ lọc. Mẫu số bằng 0 hiển thị 0%. Xuất Excel lấy snapshot mới tại thời điểm xuất.</div>
      <section className="op-kpis">{['accountsTotal','accountsNew','activeUsers','childrenNew','checkinsCompleted','contentUsers','pushSuccess','affectedUsers'].map(key => <article key={key} title={selected.get(key)?.description}><span>{selected.get(key)?.label}</span><strong>{formatValue(data.summary[key])}</strong>{data.previous && <small>{delta(data.summary[key], data.previous.summary[key])}</small>}</article>)}</section>
      <Trend daily={daily} />
      <div className="op-table-heading"><h2>Chi tiết theo ngày</h2><label>Nhóm chỉ tiêu <select value={group} onChange={e => setGroup(e.target.value)}>{['Tất cả', ...new Set(definitions.map(d => d.group))].map(g => <option key={g}>{g}</option>)}</select></label></div>
      <div className="op-table-scroll"><table><thead><tr><th>Ngày</th><th>Dữ liệu</th>{columns.map(d => <th key={d.key} title={d.description}>{d.label}</th>)}<th>Ghi chú</th></tr></thead><tbody>{visible.map(row => <tr key={row.date}><th>{row.date}</th><td><span className={`op-status op-${row.status.toLowerCase()}`}>{statusNames[row.status]}</span></td>{columns.map(d => <td key={d.key}>{formatValue(row[d.key], d.aggregation === 'RATIO')}</td>)}<td><button className="op-note-button" onClick={() => setNote({ ...row })}>{row.note || 'Thêm ghi chú'}</button></td></tr>)}</tbody></table></div>
      <div className="op-pagination"><span>{daily.length} ngày · Các chỉ số “người” được đếm duy nhất toàn kỳ.</span><button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Trước</button><span>{page + 1}/{Math.max(1,Math.ceil(daily.length / 15))}</span><button disabled={(page + 1) * 15 >= daily.length} onClick={() => setPage(p => p + 1)}>Sau</button></div>
      <details className="op-definitions"><summary>Định nghĩa chỉ tiêu và cách tính</summary>{definitions.map(d => <p key={d.key}><strong>{d.label}:</strong> {d.description}</p>)}<p>Tỷ lệ theo kỳ có thể vượt 100% do khác tập người hoặc khác ngày phát sinh; không tự giới hạn về 100%.</p></details>
    </>}
    </>}
    {note && <div className="op-modal" role="dialog" aria-modal="true" aria-labelledby="op-note-title"><div><h2 id="op-note-title">Ghi chú ngày {note.date}</h2><p>Ghi chú toàn hệ thống. Không nhập dữ liệu cá nhân hoặc nội dung sức khỏe.</p>{note.error && <p role="alert">{note.error}</p>}<textarea autoFocus maxLength={2000} value={note.note} onChange={e => setNote({ ...note, note: e.target.value })} /><small>{note.note.length}/2000</small><div className="op-modal-actions"><button disabled={saving} onClick={() => setNote(null)}>Đóng</button><button className="op-primary" disabled={saving} onClick={saveNote}>{saving ? 'Đang lưu…' : 'Lưu ghi chú'}</button></div></div></div>}
  </main>;
}
function Trend({ daily }) {
  const series = [{ key: 'activeUsers', label: 'Người hoạt động', color: '#228353' }, { key: 'checkinsCompleted', label: 'Check-in hoàn thành', color: '#5578bf' }];
  const max = Math.max(1, ...daily.flatMap(d => series.map(s => Number(d[s.key]) || 0)));
  return <section className="op-trend"><h2>Xu hướng sử dụng</h2><div className="op-legend">{series.map(s => <span key={s.key} style={{ color: s.color }}>● {s.label}</span>)}</div>
    <svg viewBox="0 0 900 200" role="img" aria-label="Xu hướng người hoạt động và check-in theo ngày"><line x1="35" y1="170" x2="880" y2="170" stroke="#d9e2dc" /><text x="2" y="20" fontSize="12">{max}</text><text x="12" y="170" fontSize="12">0</text>{series.map(s => {
      let path = ''; let previous = false;
      daily.forEach((d,i) => { if (d[s.key] == null) { previous = false; return; } const x=35+i*845/Math.max(1,daily.length-1),y=170-150*d[s.key]/max;path += `${previous?'L':'M'}${x},${y} `;previous=true; });
      return <path key={s.key} d={path} stroke={s.color} strokeWidth="2.5" fill="none" />;
    })}<text x="35" y="195" fontSize="12">{daily[0]?.date}</text><text x="800" y="195" fontSize="12">{daily.at(-1)?.date}</text></svg></section>;
}
function SupportPanel({ onChanged }) {
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
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };
  return <section className="op-support"><h2>Xử lý báo cáo vi phạm</h2><p>Yêu cầu đã đóng không được mở lại. Chỉ chuyển trạng thái sau khi đã xử lý nghiệp vụ.</p>
    <select aria-label="Trạng thái vi phạm" value={status} disabled={saving} onChange={e=>{startListChange();setStatus(e.target.value);setPage(0);}}>{['ALL','OPEN','REVIEWING','RESOLVED','REJECTED'].map(s=><option key={s}>{s}</option>)}</select>
    {error&&<p role="alert" className="op-error">{error}</p>}{busy&&<p role="status">Đang tải…</p>}
    <div className="op-table-scroll"><table><thead><tr><th>Ngày tạo</th><th>Loại</th><th>Tiêu đề</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleString('vi-VN')}</td><td>{r.violation_type}</td><td>{r.subject||'—'}</td><td>{r.report_status}</td><td>{['OPEN','REVIEWING'].includes(r.report_status)&&<button disabled={busy} onClick={()=>{setSelected(r);setNote(r.review_note||'');}}>Xử lý</button>}</td></tr>)}</tbody></table>{!busy&&!rows.length&&<p>Không có yêu cầu phù hợp.</p>}</div>
    <div className="op-pagination"><button disabled={busy||page===0} onClick={()=>changePage(page - 1)}>Trước</button><span>Trang {page+1}</span><button disabled={busy||rows.length<50} onClick={()=>changePage(page + 1)}>Sau</button></div>
    {selected&&<div className="op-review"><h3>{selected.subject||selected.violation_type}</h3><p style={{whiteSpace:"pre-wrap"}}>{selected.description}</p><label>Ghi chú xử lý<textarea maxLength={500} value={note} onChange={e=>setNote(e.target.value)} /></label><button disabled={busy} onClick={()=>setSelected(null)}>Hủy</button>{selected.report_status==='OPEN'&&<button disabled={busy} onClick={()=>review('REVIEWING')}>Đang xử lý</button>}<button disabled={busy} onClick={()=>review('REJECTED')}>Từ chối</button><button className="op-primary" disabled={busy} onClick={()=>review('RESOLVED')}>Đã xử lý</button></div>}
  </section>;
}
