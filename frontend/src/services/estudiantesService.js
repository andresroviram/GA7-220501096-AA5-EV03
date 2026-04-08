import api from './api';
import { getPadreCorreo } from '../utils/sessionUser';

const isDev = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Devuelve la lista de estudiantes/alumnos.
 * En desarrollo usa los datos mock; en producción llama al backend.
 */
export async function getEstudiantes(idGrupo) {
  if (isDev) {
    const { estudiantes, getEstudiantesByPadre } = await import('../data/mockEstudiantes.js');
    const correo_padre = getPadreCorreo();
    let result = correo_padre
      ? getEstudiantesByPadre(correo_padre)
      : estudiantes;
    if (idGrupo) result = result.filter((e) => e.grupo === idGrupo);
    return result;
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

/**
 * Devuelve solo los estudiantes vinculados al padre autenticado.
 * En dev filtra por correo_padre; en prod llama a GET /alumnos/mis-hijos.
 */
export async function getMisHijos() {
  if (isDev) {
    const { getEstudiantesByPadre } = await import('../data/mockEstudiantes.js');
    const { getPadreCorreo } = await import('../utils/sessionUser.js');
    const correo = getPadreCorreo();
    return correo ? getEstudiantesByPadre(correo) : [];
  }
  const res = await api.get('/alumnos/mis-hijos');
  return res.data;
}

/** Lista usuarios con tipo 'padre/acudiente'. */
export async function getPadres() {
  if (isDev) {
    const { padres } = await import('../data/mockEstudiantes.js');
    return padres;
  }
  const res = await api.get('/usuarios', { params: { tipo: 'padre' } });
  return res.data;
}
