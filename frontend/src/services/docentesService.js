import api from './api';

const isDev = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Devuelve la lista de docentes.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getDocentes() {
  if (isDev) {
    const { docentes } = await import('../data/mockDocentes.js');
    return docentes;
  }
  const res = await api.get('/usuarios', { params: { tipo: 'docente' } });
  return res.data;
}

/**
 * Devuelve las estadísticas de docentes por departamento para el widget.
 * Siempre viene de los mocks (el backend no tiene este endpoint resumido).
 */
export async function getDocentesPorDepartamento() {
  const { docentesPorDepartamento } = await import('../data/mockDocentes.js');
  return docentesPorDepartamento;
}

export async function getEstadisticasDocentes() {
  const { estadisticasDocentes } = await import('../data/mockDocentes.js');
  return estadisticasDocentes;
}

/** Crea un nuevo docente (usuario con tipo docente). */
export async function createDocente(data) {
  if (isDev) return { id: Date.now(), ...data };
  const res = await api.post('/usuarios', { ...data, tipo_usuario: 'docente' });
  return res.data;
}

/** Actualiza un docente por ID. */
export async function updateDocente(id, data) {
  if (isDev) return { id, ...data };
  const res = await api.patch(`/usuarios/${id}`, data);
  return res.data;
}

/** Elimina un docente por ID. */
export async function deleteDocente(id) {
  if (isDev) return;
  await api.delete(`/usuarios/${id}`);
}
