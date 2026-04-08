/**
 * Mapa de permisos por rol.
 * Cada clave corresponde al valor de `tipo_usuario` en el token.
 * El valor es el conjunto de rutas (sin "/") a las que tiene acceso.
 */
export const ROLE_PERMISSIONS = {
  administrativo: [
    'dashboard', 'estudiantes', 'docentes', 'grupos',
    'materias', 'calificaciones', 'reportes', 'configuraciones', 'roles',
  ],
  docente: [
    'dashboard', 'estudiantes', 'grupos',
    'materias', 'calificaciones', 'reportes',
  ],
  padre: [
    'dashboard', 'calificaciones', 'grupos', 'reportes',
  ],
};

/**
 * Devuelve true si el rol tiene acceso a la ruta dada.
 * @param {string} role - tipo_usuario del usuario
 * @param {string} route - segmento de ruta sin "/" (ej. 'docentes')
 */
export function canAccess(role, route) {
  const allowed = ROLE_PERMISSIONS[role] ?? [];
  return allowed.includes(route);
}

/**
 * Devuelve la lista de rutas permitidas para el rol.
 * @param {string} role
 * @returns {string[]}
 */
export function allowedRoutes(role) {
  return ROLE_PERMISSIONS[role] ?? [];
}
