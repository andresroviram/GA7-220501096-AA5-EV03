import api from './api';
import { getPadreCorreo, getPadreId } from '../utils/sessionUser';

const isDev = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Devuelve todos los bloques de horario enriquecidos con datos del grupo.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getHorarios() {
  if (isDev) {
    const { horarios } = await import('../data/mockGrupos.js');
    const correo_padre = getPadreCorreo();
    if (correo_padre) {
      const { getEstudiantesByPadre } = await import('../data/mockEstudiantes.js');
      const grupos = [...new Set(getEstudiantesByPadre(correo_padre).map((e) => e.grupo))];
      return horarios.filter((h) => grupos.includes(h.grupo));
    }
    return horarios;
  }
  const res = await api.get('/horarios/bloques/all');
  const horarios = res.data;

  const idPadre = getPadreId();
  if (idPadre !== null) {
    // Para un padre: mostrar solo los horarios de los grupos de sus hijos
    const alumnosRes = await api.get('/alumnos');
    const grupos = [...new Set(
      alumnosRes.data
        .filter((a) => a.tutorId === idPadre)
        .map((a) => a.grupo)
    )];
    return horarios.filter((h) => grupos.includes(h.grupo));
  }

  return horarios;
}

/**
 * Devuelve las estadísticas de grupos/horarios para los widgets.
 */
export async function getEstadisticasGrupos() {
  if (isDev) {
    const { estadisticasGrupos } = await import('../data/mockGrupos.js');
    return estadisticasGrupos;
  }
  const res = await api.get('/horarios/bloques/estadisticas');
  return res.data;
}

/** Crea un nuevo bloque de grupo-horario. */
export async function createHorario(data) {
  if (isDev) return { id: Date.now(), ...data };
  const res = await api.post('/horarios/bloques', data);
  return res.data;
}

/** Actualiza un bloque de grupo-horario por ID. */
export async function updateHorario(id, data) {
  if (isDev) return { id, ...data };
  const res = await api.patch(`/horarios/bloques/${id}`, data);
  return res.data;
}

/** Elimina un bloque de grupo-horario por ID. */
export async function deleteHorario(id) {
  if (isDev) return;
  await api.delete(`/horarios/bloques/${id}`);
}

/** Recalcula y persiste los conflictos de horario en el backend. */
export async function recalcularConflictos() {
  if (isDev) return;
  const res = await api.post('/horarios/bloques/recalcular');
  return res.data;
}
