import axios from 'axios';

/** URL base del módulo de autenticación en el backend (vía proxy de Vite) */
const AUTH_API_URL = '/api/auth';

/** Usuarios de prueba disponibles solo en modo desarrollo */
const MOCK_USERS = [
  { correo: 'admin@escuela.edu',           password: 'Admin123!',   nombre: 'Admin Sistema',    tipo_usuario: 'administrativo' },
  { correo: 'maria.garcia@escuela.edu',    password: 'Docente123!', nombre: 'María García',      tipo_usuario: 'docente' },
  { correo: 'juan.rodriguez@escuela.edu',  password: 'Padre123!',   nombre: 'Juan Rodríguez',    tipo_usuario: 'padre' },
  { correo: 'laura.martinez@escuela.edu',  password: 'Docente123!', nombre: 'Laura Martínez',    tipo_usuario: 'docente' },
];

const authService = {
  /**
   * En desarrollo: valida contra MOCK_USERS sin necesidad de backend.
   * En producción: llama a POST /auth/login.
   */
  async login(correo, password) {
    if (import.meta.env.DEV) {
      const user = MOCK_USERS.find(
        (u) => u.correo === correo && u.password === password,
      );
      if (!user) {
        // Simula un 401 para que LoginForm muestre el mensaje correcto
        const err = new Error('Credenciales incorrectas');
        err.response = { status: 401 };
        throw err;
      }
      const data = {
        access_token: 'mock-token-dev',
        correo: user.correo,
        nombre: user.nombre,
        tipo_usuario: user.tipo_usuario,
      };
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        correo: data.correo,
        nombre: data.nombre,
        tipo_usuario: data.tipo_usuario,
      }));
      return data;
    }

    const response = await axios.post(`${AUTH_API_URL}/login`, { correo, password });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        correo: response.data.correo,
        nombre: response.data.nombre,
        tipo_usuario: response.data.tipo_usuario,
      }));
    }

    return response.data;
  },

  /** Cierra la sesión eliminando todos los datos del localStorage. */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /** @returns {boolean} true si existe un token guardado */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Devuelve el objeto de usuario almacenado en sesión.
   * @returns {{ correo: string, nombre: string, tipo_usuario: string } | null}
   */
  getCurrentUser() {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  /** @returns {string|null} Token JWT o null */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Registra un nuevo usuario mediante POST /auth/register.
   * @param {{ nombre: string, apellido: string, correo: string, password: string, tipo_usuario: string }} data
   */
  async register(data) {
    const response = await axios.post(`${AUTH_API_URL}/register`, data);
    return response.data;
  },
};

export default authService;
