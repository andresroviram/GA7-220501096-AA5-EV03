import api from './api';

const isDev = import.meta.env.DEV;

/**
 * Devuelve todos los bloques de horario enriquecidos con datos del grupo.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getHorarios() {
  if (isDev) {
    const { horarios } = await import('../data/mockGrupos.js');
    return horarios;
  }
  const res = await api.get('/horarios/bloques/all');
  return res.data;
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
