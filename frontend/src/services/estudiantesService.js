import api from './api';

const isDev = import.meta.env.DEV;

/**
 * Devuelve la lista de estudiantes/alumnos.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getEstudiantes(idGrupo) {
  if (isDev) {
    const { estudiantes } = await import('../data/mockEstudiantes.js');
    return idGrupo
      ? estudiantes.filter((e) => e.grupo === idGrupo)
      : estudiantes;
  }
  const params = idGrupo ? { idGrupo } : {};
  const res = await api.get('/alumnos', { params });
  return res.data;
}

/** Crea un nuevo alumno. */
export async function createEstudiante(data) {
  if (isDev) return { id: Date.now(), ...data };
  const res = await api.post('/alumnos', data);
  return res.data;
}

/** Actualiza un alumno por ID. */
export async function updateEstudiante(id, data) {
  if (isDev) return { id, ...data };
  const res = await api.patch(`/alumnos/${id}`, data);
  return res.data;
}

/** Elimina un alumno por ID. */
export async function deleteEstudiante(id) {
  if (isDev) return;
  await api.delete(`/alumnos/${id}`);
}
