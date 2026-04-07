import api from './api';

const isDev = import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true';

/** Devuelve la lista de reportes recientes. */
export async function getReportesRecientes() {
  if (isDev) {
    const { reportesRecientes } = await import('../data/mockReportes.js');
    return reportesRecientes;
  }
  const res = await api.get('/reportes');
  return res.data;
}

/** Devuelve los tipos de reporte disponibles. */
export async function getTiposReporte() {
  const { tiposReporte } = await import('../data/mockReportes.js');
  return tiposReporte;
}

/**
 * Genera y descarga un reporte.
 * @param {number} tipoId — id del tipo de reporte
 * @param {'pdf'|'excel'} formato
 * @param {{ grupo?: string, periodo?: string }} params
 */
export async function generarReporte(tipoId, formato, params = {}) {
  if (isDev) {
    const { getMockReporteData } = await import('../data/mockReportes.js');
    const { downloadCSV, downloadPDF } = await import('../utils/exportUtils.js');
    const { rows, columns, titulo } = await getMockReporteData(tipoId);
    const ts = new Date().toISOString().slice(0, 10);
    if (formato === 'excel') {
      downloadCSV(rows, columns, `reporte-${tipoId}-${ts}.csv`);
    } else {
      downloadPDF(rows, columns, titulo);
    }
    return;
  }
  const { grupo = '', periodo = '' } = params;
  const res = await api.get(`/reportes/${tipoId}/generate`, {
    params: { formato, grupo, periodo },
    responseType: 'blob',
  });
  const ext = formato === 'excel' ? 'xlsx' : 'pdf';
  const ts = new Date().toISOString().slice(0, 10);
  const { triggerBlobDownload } = await import('../utils/exportUtils.js');
  triggerBlobDownload(res.data, `reporte-${tipoId}-${ts}.${ext}`);
}

/**
 * Descarga un reporte existente de la lista de recientes.
 * @param {object} reporte — fila del listado de recientes
 */
export async function descargarReporte(reporte) {
  if (isDev) {
    const { downloadCSV } = await import('../utils/exportUtils.js');
    downloadCSV(
      [reporte],
      [
        { key: 'id',          label: 'ID'           },
        { key: 'tipo',        label: 'Tipo'         },
        { key: 'descripcion', label: 'Descripción'  },
        { key: 'fecha',       label: 'Fecha'        },
        { key: 'generadoPor', label: 'Generado por' },
        { key: 'formato',     label: 'Formato'      },
      ],
      `reporte-${reporte.id}-${reporte.fecha}.csv`
    );
    return;
  }
  const res = await api.get(`/reportes/${reporte.id}/download`, { responseType: 'blob' });
  const ext = reporte.formato === 'Excel' ? 'xlsx' : 'pdf';
  const { triggerBlobDownload } = await import('../utils/exportUtils.js');
  triggerBlobDownload(res.data, `reporte-${reporte.id}.${ext}`);
}
