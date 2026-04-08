import api from './api';
import { getPadreCorreo } from '../utils/sessionUser';

const isDev = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Devuelve la lista de calificaciones.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getCalificaciones() {
  if (isDev) {
    const { calificaciones } = await import('../data/mockCalificaciones.js');
    const correo_padre = getPadreCorreo();
    if (correo_padre) {
      const { getEstudiantesByPadre } = await import('../data/mockEstudiantes.js');
      const ids = getEstudiantesByPadre(correo_padre).map((e) => e.id);
      return calificaciones.filter((c) => ids.includes(c.estudiante_id));
    }
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
