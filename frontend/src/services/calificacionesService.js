import api from './api';

const isDev = import.meta.env.DEV;

/**
 * Devuelve la lista de calificaciones.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getCalificaciones() {
  if (isDev) {
    const { calificaciones } = await import('../data/mockCalificaciones.js');
    return calificaciones;
  }
  const res = await api.get('/calificaciones');
  return res.data;
}

/**
 * Devuelve los promedios por grupo para el widget de barras.
 * En desarrollo usa mock; en producción llama al endpoint de stats.
 */
export async function getPromediosPorGrupo() {
  if (isDev) {
    const { promediosPorGrupo } = await import('../data/mockCalificaciones.js');
    return promediosPorGrupo;
  }
  const res = await api.get('/calificaciones/stats/promedios');
  return res.data;
}

/** Crea una nueva calificación. */
export async function createCalificacion(data) {
  if (isDev) return { id: Date.now(), ...data };
  const res = await api.post('/calificaciones', data);
  return res.data;
}

/** Actualiza una calificación por ID. */
export async function updateCalificacion(id, data) {
  if (isDev) return { id, ...data };
  const res = await api.patch(`/calificaciones/${id}`, data);
  return res.data;
}

/** Elimina una calificación por ID. */
export async function deleteCalificacion(id) {
  if (isDev) return;
  await api.delete(`/calificaciones/${id}`);
}
