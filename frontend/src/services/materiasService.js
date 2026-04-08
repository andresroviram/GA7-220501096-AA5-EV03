import api from './api';

const isDev = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Devuelve la lista de materias.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getMaterias() {
  if (isDev) {
    const { materias } = await import('../data/mockMaterias.js');
    return materias;
  }
  const res = await api.get('/materias');
  return res.data;
}

/**
 * Devuelve el resumen de materias por departamento para el widget de barras.
 */
export async function getMateriasPorDepto() {
  if (isDev) {
    const { materiasPorDepto } = await import('../data/mockMaterias.js');
    return materiasPorDepto;
  }
  const res = await api.get('/materias/stats/por-departamento');
  return res.data;
}

/** Crea una nueva materia. */
export async function createMateria(data) {
  if (isDev) return { id: Date.now(), ...data };
  const res = await api.post('/materias', data);
  return res.data;
}

/** Actualiza una materia por ID. */
export async function updateMateria(id, data) {
  if (isDev) return { id, ...data };
  const res = await api.patch(`/materias/${id}`, data);
  return res.data;
}

/** Elimina una materia por ID. */
export async function deleteMateria(id) {
  if (isDev) return;
  await api.delete(`/materias/${id}`);
}
