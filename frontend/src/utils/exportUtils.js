/**
 * Descarga un array de objetos como CSV (compatible con Excel, con BOM UTF-8).
 * @param {object[]} rows
 * @param {{ key: string, label: string }[]} columns
 * @param {string} filename — ej: 'estudiantes.csv'
 */
export function downloadCSV(rows, columns, filename) {
  const header = columns.map((c) => `"${c.label}"`).join(',');
  const body = rows.map((r) =>
    columns
      .map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );
  // BOM \uFEFF para que Excel muestre tildes correctamente
  const csv = '\uFEFF' + [header, ...body].join('\r\n');
  _triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
}

/**
 * Abre una ventana de impresión con una tabla HTML formateada (simula exportación PDF).
 * @param {object[]} rows
 * @param {{ key: string, label: string }[]} columns
 * @param {string} title
 */
export function downloadPDF(rows, columns, title) {
  const thead = `<tr>${columns.map((c) => `<th>${c.label}</th>`).join('')}</tr>`;
  const tbody = rows
    .map((r) => `<tr>${columns.map((c) => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`)
    .join('');

  const fechaStr = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1A2E25; padding: 24px; }
    h1   { font-size: 16px; margin-bottom: 4px; color: #1A2E25; }
    p.sub { font-size: 11px; color: #6B7C74; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #2A9D6F; color: #fff; padding: 7px 10px; text-align: left; font-size: 11px; }
    td { padding: 6px 10px; border-bottom: 1px solid #E0ECE6; font-size: 11px; }
    tr:nth-child(even) td { background: #F5FAF7; }
    @media print { body { margin: 0; padding: 16px; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="sub">Generado: ${fechaStr} — Sistema Integral Académico</p>
  <table>
    <thead>${thead}</thead>
    <tbody>${tbody}</tbody>
  </table>
  <script>window.onload = function () { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

/**
 * Descarga un Blob recibido del backend (PDF real o Excel/xlsx).
 * @param {Blob} blob
 * @param {string} filename
 */
export function triggerBlobDownload(blob, filename) {
  _triggerDownload(blob, filename);
}

function _triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
