import api from './api';
import { getPadreCorreo } from '../utils/sessionUser';
import { isMockMode } from '../config/runtime';

const isDev = isMockMode;

const REPORT_TYPE_DETAILS = {
  1: { titulo: 'Calificaciones', descripcion: 'Reporte general de notas por grupo o materia', icono: 'file', filtros: ['grupo'] },
  2: { titulo: 'Estudiantes', descripcion: 'Listado de estudiantes registrados con estadísticas', icono: 'users', filtros: ['grupo'] },
  3: { titulo: 'Docentes', descripcion: 'Historial y estado del personal docente', icono: 'check', filtros: [] },
  4: { titulo: 'Horarios', descripcion: 'Distribución de horarios por grupo y aula', icono: 'calendar', filtros: ['grupo'] },
  6: { titulo: 'Rendimiento', descripcion: 'Indicadores de rendimiento académico general', icono: 'chart', filtros: [] },
};

function toReportType(tipo) {
  const details = REPORT_TYPE_DETAILS[tipo.id] ?? {};
  return {
    ...details,
    ...tipo,
    titulo: tipo.titulo ?? tipo.name ?? details.titulo ?? `Reporte ${tipo.id}`,
    descripcion: tipo.descripcion ?? details.descripcion ?? '',
    icono: tipo.icono ?? details.icono ?? 'file',
    filtros: tipo.filtros ?? details.filtros ?? [],
  };
}

export function filenameFromContentDisposition(contentDisposition, fallback) {
  if (typeof contentDisposition !== 'string') return fallback;

  const encodedMatch = contentDisposition.match(/filename\*\s*=\s*(?:[^']*'[^']*')?([^;]+)/i);
  const plainMatch = contentDisposition.match(/filename\s*=\s*(?:"([^"]+)"|([^;\s]+))/i);
  const rawFilename = encodedMatch?.[1] ?? plainMatch?.[1] ?? plainMatch?.[2];
  if (!rawFilename) return fallback;

  try {
    const filename = decodeURIComponent(rawFilename.trim().replace(/^"|"$/g, ''));
    return filename.replace(/[\\/:*?"<>|]/g, '_') || fallback;
  } catch {
    return fallback;
  }
}

/** Devuelve la lista de reportes recientes. */
export async function getReportesRecientes() {
  if (isDev) {
    const { reportesRecientes } = await import('../data/mockReportes.js');
    return reportesRecientes;
  }
  const res = await api.get('/reportes/historial');
  return res.data;
}

/** Devuelve los tipos de reporte disponibles. */
export async function getTiposReporte() {
  if (isDev) {
    const { tiposReporte } = await import('../data/mockReportes.js');
    return tiposReporte;
  }
  const res = await api.get('/reportes');
  return res.data.map(toReportType);
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
    let { rows, columns, titulo } = await getMockReporteData(tipoId);

    // Si el usuario es padre, filtrar solo sus estudiantes
    const correo_padre = getPadreCorreo();
    if (correo_padre && (tipoId === 1 || tipoId === 2)) {
      const { getEstudiantesByPadre } = await import('../data/mockEstudiantes.js');
      const ids = getEstudiantesByPadre(correo_padre).map((e) => e.id);
      if (tipoId === 1) {
        // Calificaciones: filtrar por estudiante_id
        rows = rows.filter((r) => ids.includes(r.estudiante_id));
      } else if (tipoId === 2) {
        // Estudiantes: filtrar por id
        rows = rows.filter((r) => ids.includes(r.id));
      }
    }

    const ts = new Date().toISOString().slice(0, 10);
    if (formato === 'excel') {
      downloadCSV(rows, columns, `reporte-${tipoId}-${ts}.csv`);
    } else {
      downloadPDF(rows, columns, titulo);
    }
    return;
  }
  const { grupo = '' } = params;
  const res = await api.get(`/reportes/${tipoId}/generate`, {
    params: { formato, grupo },
    responseType: 'blob',
  });
  const ext = formato === 'excel' ? 'xlsx' : 'pdf';
  const ts = new Date().toISOString().slice(0, 10);
  const { triggerBlobDownload } = await import('../utils/exportUtils.js');
  triggerBlobDownload(
    res.data,
    filenameFromContentDisposition(res.headers?.['content-disposition'], `reporte-${tipoId}-${ts}.${ext}`),
  );
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
  const ext = reporte.formato?.toLowerCase() === 'excel' ? 'xlsx' : 'pdf';
  const { triggerBlobDownload } = await import('../utils/exportUtils.js');
  triggerBlobDownload(
    res.data,
    filenameFromContentDisposition(res.headers?.['content-disposition'], `reporte-${reporte.id}.${ext}`),
  );
}
