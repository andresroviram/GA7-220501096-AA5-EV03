import api from './api';

const MODULOS = ['Dashboard', 'Docentes', 'Estudiantes', 'Calificaciones', 'Grupos/Horarios', 'Materias', 'Reportes', 'Configuraciones'];

const MOCK_ROLES = [
  {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso completo al sistema',
    permisos: MODULOS.map((m) => ({ modulo: m, acceso: true })),
  },
  {
    id: 2,
    nombre: 'Docente',
    descripcion: 'Gestión de calificaciones y grupos',
    permisos: MODULOS.map((m) => ({
      modulo: m,
      acceso: ['Dashboard', 'Estudiantes', 'Calificaciones', 'Grupos/Horarios', 'Materias', 'Reportes'].includes(m),
    })),
  },
  {
    id: 3,
    nombre: 'Estudiante',
    descripcion: 'Consulta de notas y horarios',
    permisos: MODULOS.map((m) => ({
      modulo: m,
      acceso: ['Dashboard', 'Calificaciones', 'Grupos/Horarios'].includes(m),
    })),
  },
  {
    id: 4,
    nombre: 'Padre/Tutor',
    descripcion: 'Seguimiento de acudidos',
    permisos: MODULOS.map((m) => ({
      modulo: m,
      acceso: ['Dashboard', 'Estudiantes', 'Calificaciones', 'Grupos/Horarios', 'Reportes'].includes(m),
    })),
  },
];

const isDev = import.meta.env.DEV;

/** Obtiene todos los roles con sus permisos. */
export async function getRoles() {
  if (isDev) return MOCK_ROLES;
  const res = await api.get('/roles');
  return res.data;
}

/**
 * Actualiza los permisos de un rol.
 * @param {number} rolId
 * @param {{ modulo: string; acceso: boolean }[]} permisos
 */
export async function updateRolPermisos(rolId, permisos) {
  if (isDev) return MOCK_ROLES.find((r) => r.id === rolId);
  const res = await api.put(`/roles/${rolId}/permisos`, { permisos });
  return res.data;
}
