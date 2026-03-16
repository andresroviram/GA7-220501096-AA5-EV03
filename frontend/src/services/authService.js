import axios from 'axios';

/**
 * authService — servicio de autenticación del frontend.
 *
 * Centraliza todas las operaciones relacionadas con la sesión del usuario:
 * comunicación con la API, almacenamiento del token y consulta del estado.
 *
 * El token JWT se guarda en localStorage para persistir entre recargas de página.
 * En aplicaciones de mayor criticidad puede usarse una cookie HttpOnly.
 */

/** URL base del módulo de autenticación en el backend (vía proxy de Vite) */
const AUTH_API_URL = '/api/auth';

const authService = {
  /**
   * Envía las credenciales al endpoint POST /auth/login.
   * Si el servidor responde con un token, lo almacena en localStorage.
   *
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña en texto plano (se envía por HTTPS en producción)
   * @returns {Promise<{access_token: string, username: string}>} Datos de sesión
   * @throws {AxiosError} Si las credenciales son incorrectas (401) o hay error de red
   */
  async login(username, password) {
    const response = await axios.post(`${AUTH_API_URL}/login`, {
      username,
      password,
    });

    // Guardar token y nombre de usuario para uso posterior
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', response.data.username);
    }

    return response.data;
  },

  /**
   * Cierra la sesión actual eliminando los datos del localStorage.
   * El token queda inválido en el cliente (el servidor lo rechazará si se reutiliza
   * después de que expire, o si se implementa una lista negra en el backend).
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  /**
   * Comprueba si hay una sesión activa basándose en la presencia del token.
   * No verifica la validez o expiración del token (eso lo hace el backend).
   *
   * @returns {boolean} true si existe un token guardado
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Devuelve el nombre del usuario en sesión.
   *
   * @returns {string|null} Nombre de usuario o null si no hay sesión
   */
  getCurrentUser() {
    return localStorage.getItem('username');
  },

  /**
   * Devuelve el token JWT almacenado, útil para incluirlo
   * en el header Authorization de peticiones a rutas protegidas.
   *
   * @returns {string|null} Token JWT o null
   */
  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;
