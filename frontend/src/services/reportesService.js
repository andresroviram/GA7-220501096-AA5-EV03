import api from './api';

const isDev = import.meta.env.DEV;

/**
 * Devuelve la lista de reportes recientes.
 * En desarrollo usa los datos mock; en producción llamaría a un endpoint futuro.
 */
export async function getReportesRecientes() {
  if (isDev) {
    const { reportesRecientes } = await import('../data/mockReportes.js');
    return reportesRecientes;
  }
  // Endpoint reservado para cuando se implemente en el backend
  const res = await api.get('/reportes');
  return res.data;
}

/**
 * Devuelve los tipos de reporte disponibles.
 */
export async function getTiposReporte() {
  const { tiposReporte } = await import('../data/mockReportes.js');
  return tiposReporte;
}
