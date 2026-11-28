import JSZip from '../vendor/jszip';

const percent = new Intl.NumberFormat('vi-VN', { style: 'percent', maximumFractionDigits: 2 });

const sheetNamespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

function cellText(cell, column, isData) {
  if (cell.getAttribute('t') === 'inlineStr') return cell.getElementsByTagNameNS(sheetNamespace, 'is')[0]?.textContent ?? '';
  const value = cell.getElementsByTagNameNS(sheetNamespace, 'v')[0]?.textContent;
  if (!value || !isData) return value ?? '';
  const number = Number(value);
  if (column === 0 && Number.isFinite(number)) {
    // Mirror the exporter's adjustment for Excel's fictitious leap day in 1900.
    const date = new Date((number - (number < 60 ? 25568 : 25569)) * 86400000);
    return date.toISOString().slice(0, 10).split('-').reverse().join('/');
  }
  return column >= 30 && Number.isFinite(number) ? percent.format(number) : value;
}

export async function readOperationalSheet(file) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const sheet = zip.file('xl/worksheets/sheet1.xml');
  if (!sheet) throw new Error('Thiếu trang báo cáo vận hành.');
  const xml = new DOMParser().parseFromString(await sheet.async('string'), 'application/xml');
  const sheetData = xml.getElementsByTagNameNS(sheetNamespace, 'sheetData')[0];
  const rows = Array.from(sheetData?.children ?? []).filter(
      child => child.namespaceURI === sheetNamespace && child.localName === 'row',
  );
  function values(row, isData) {
    const cells = [];
    for (const cell of row.children) {
      const letters = cell.getAttribute('r').match(/^[A-Z]+/)[0];
      const column = Array.from(letters).reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
      cells[column] = cellText(cell, column, isData);
    }
    return cells;
  }
  const header = rows.find(row => row.getAttribute('r') === '4');
  if (!header) throw new Error('Thiếu tiêu đề báo cáo.');
  return {
    headers: values(header, false),
    rows: rows.filter(row => Number(row.getAttribute('r')) >= 5).map(row => values(row, true)),
  };
}