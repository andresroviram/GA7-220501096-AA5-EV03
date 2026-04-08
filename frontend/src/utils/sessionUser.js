/**
 * Helpers para leer el usuario de sesión activo.
 * Lee de localStorage (sesión persistente) o sessionStorage (sesión temporal).
 */

export function getSessionUser() {
  const raw = localStorage.getItem('user') ?? sessionStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Devuelve el correo del padre autenticado, o null si el usuario no es padre. */
export function getPadreCorreo() {
  const u = getSessionUser();
  return u?.tipo_usuario === 'padre' ? u.correo : null;
}

/** Devuelve el id numérico del padre autenticado, o null si no es padre. */
export function getPadreId() {
  const u = getSessionUser();
  return u?.tipo_usuario === 'padre' ? (u.id ?? null) : null;
}
