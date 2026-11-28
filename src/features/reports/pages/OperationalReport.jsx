import ReportPreview from './ReportPreview';
import { useEffect, useRef, useState } from 'react';
import service from '../services/operationalReportService';
import { localDate } from '../utils/reportUtils';
import { reportRange } from '../utils/reportPeriod';
import './OperationalReport.css';

const periods = { day: 'Ngày', month: 'Tháng', year: 'Năm' };

export default function OperationalReport() {
  const today = localDate();
  const [period, setPeriod] = useState('day');
  const [dates, setDates] = useState(() => ({
    day: today, month: today.slice(0, 7), year: today.slice(0, 4),
  }));
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const appleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const previewUrl = preview?.url;
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const pending = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function download(event) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setPreview(null);
    setExporting(true);
    setError('');
    setMessage('');
    try {
      const range = reportRange(period, dates[period], localDate());
      const file = await service.export(range);
      const signature = file instanceof Blob ? await file.slice(0, 4).arrayBuffer() : new ArrayBuffer(0);
      if (signature.byteLength !== 4 || new DataView(signature).getUint32(0) !== 0x504b0304) {
        setError('File Excel trả về không hợp lệ. Vui lòng thử lại.');
        return;
      }
      const filename = 'SSCare_Report_' + range.from + '_' + range.to + '.xlsx';
      if (appleMobile) {
        let sheet = null;
        try {
          const { readOperationalSheet } = await import('../utils/readOperationalSheet');
          sheet = await readOperationalSheet(file);
        } catch {
          setError('Không đọc được bản xem trước. Bạn vẫn có thể tải file Excel.');
        }
        if (!mounted.current) return;
        setPreview({ sheet, filename, url: URL.createObjectURL(file) });
        setMessage(filename);
        return;
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = filename;
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 60000);
      }
      setMessage('Đã tạo file ' + link.download);
    } catch (err) {
      setError(err.isAxiosError ? 'Xuất file chưa thành công. Vui lòng thử lại.' : err.message);
    } finally {
      pending.current = false;
      setExporting(false);
    }
  }

  return <main className="op-report op-export">
    <header className="op-heading"><h1>Báo cáo vận hành</h1></header>
    <form onSubmit={download} onChange={() => { setPreview(null); setError(''); setMessage(''); }}>
      <fieldset className="op-filters" disabled={exporting}>
        <label>Loại báo cáo<select defaultValue="operations"><option value="operations">Báo cáo vận hành hệ thống</option></select></label>
        <label>Kỳ báo cáo<select value={period} onChange={e => setPeriod(e.target.value)}>
          {Object.entries(periods).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select></label>
        <label>{periods[period]} báo cáo<input key={period} required type={{day:'date', month:'month', year:'number'}[period]}
          min={{day:'1900-01-01', month:'1900-01', year:'1900'}[period]}
          max={{day:today, month:today.slice(0, 7), year:today.slice(0, 4)}[period]}
          value={dates[period]} onChange={e => setDates({ ...dates, [period]: e.target.value })} /></label>
        <button type="submit" className="op-primary">{exporting ? 'Đang xuất…' : appleMobile ? 'Xem và tải Excel' : 'Xuất Excel'}</button>
      </fieldset>
      {error && <p role="alert" className="op-error">{error}</p>}
      <p role="status" aria-live="polite">{message}</p>
    </form>
    {preview && <>
      <a className="op-file-download" download={preview.filename} href={preview.url}>Tải Excel</a>
      {preview.sheet && <ReportPreview sheet={preview.sheet} />}
    </>}
  </main>;
}
