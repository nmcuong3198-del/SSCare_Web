export function reportRange(period, value, today) {
  const patterns = { day: /^\d{4}-\d{2}-\d{2}$/, month: /^\d{4}-\d{2}$/, year: /^\d{4}$/ };
  if (!patterns[period]?.test(value)) throw new Error('Vui lòng chọn đầy đủ thời gian.');
  const from = period === 'year' ? value + '-01-01' : period === 'month' ? value + '-01' : value;
  const date = new Date(from + 'T00:00:00Z');
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== from || from < '1900-01-01') {
    throw new Error('Ngày đã chọn không hợp lệ.');
  }
  if (from > today) throw new Error('Vui lòng chọn thời gian từ hôm nay trở về trước.');
  let end = from;
  if (period === 'year') end = value + '-12-31';
  if (period === 'month') {
    date.setUTCMonth(date.getUTCMonth() + 1, 0);
    end = date.toISOString().slice(0, 10);
  }
  return { from, to: end > today ? today : end };
}
