export function localDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
}
export function defaultFilter() {
  const today = localDate();
  const end = new Date(`${today}T12:00:00+07:00`); 
  const start = new Date(end); start.setDate(start.getDate() - 29);
  return { from: localDate(start), to: localDate(end), platforms: [], versions: [], sources: [], campaigns: [], userType: 'ALL', comparePrevious: false };
}
export function validateFilter(f) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.from) || !/^\d{4}-\d{2}-\d{2}$/.test(f.to)) return 'Chọn đầy đủ từ ngày và đến ngày.';
  for (const value of [f.from, f.to]) {
    const parsed = new Date(value);
    if (!Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0,10) !== value) return 'Ngày không tồn tại.';
  }
  const days = (Date.parse(f.to) - Date.parse(f.from)) / 86400000;
  if (!Number.isFinite(days) || days < 0 || days > 365 || f.to > localDate()) return 'Khoảng ngày không hợp lệ. Tối đa 366 ngày, không chọn ngày tương lai.';
  return '';
}
export function queryString(f) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(f)) {
    if (Array.isArray(value)) value.forEach(v => params.append(key, v));
    else params.set(key, String(value));
  }
  return params.toString();
}
export function formatValue(value, ratio = false) {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  return new Intl.NumberFormat('vi-VN', ratio ? { style: 'percent', maximumFractionDigits: 1 } : { maximumFractionDigits: 0 }).format(value);
}
export function delta(current, previous, ratio = false) {
  if (current == null || previous == null) return 'Chưa đủ dữ liệu so sánh';
  const diff = current - previous;
  if (ratio) return `${diff > 0 ? '+' : ''}${(diff * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} điểm %`;
  if (previous === 0) return `${diff > 0 ? '+' : ''}${formatValue(diff)} · kỳ trước bằng 0`;
  return `${diff > 0 ? '+' : ''}${formatValue(diff)} (${formatValue(diff / previous, true)})`;
}
