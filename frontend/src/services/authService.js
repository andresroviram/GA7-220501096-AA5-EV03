import axios from 'axios';

/** URL base del módulo de autenticación en el backend (vía proxy de Vite) */
const AUTH_API_URL = '/api/auth';

/**
 * Cuando VITE_USE_MOCK=true en .env.development se usan estos usuarios
 * locales sin necesidad de levantar el backend.
 *
 * Para cambiar de modo editar frontend/.env.development:
 *   VITE_USE_MOCK=true   → sin backend (mock)
 *   VITE_USE_MOCK=false  → backend real en localhost:3000
 */
const MOCK_USERS = [
  { correo: 'admin@escuela.edu',           password: 'Admin123!',   nombre: 'Carlos Admin',     tipo_usuario: 'administrativo' },
  { correo: 'maria.garcia@escuela.edu',    password: 'Docente123!', nombre: 'María García',      tipo_usuario: 'docente' },
  { correo: 'juan.rodriguez@escuela.edu',  password: 'Padre123!',   nombre: 'Juan Rodríguez',    tipo_usuario: 'padre' },
  { correo: 'laura.martinez@escuela.edu',  password: 'Docente123!', nombre: 'Laura Martínez',    tipo_usuario: 'docente' },
];

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const authService = {
  async login(correo, password) {
    if (USE_MOCK) {
      const user = MOCK_USERS.find(
        (u) => u.correo === correo && u.password === password,
      );
      if (!user) {
        const err = new Error('Credenciales incorrectas');
        err.response = { status: 401 };
        throw err;
      }
      const MOCK_PHONES = {
        'admin@escuela.edu':          '+52 555-0100',
        'maria.garcia@escuela.edu':   '+52 555-0102',
        'juan.rodriguez@escuela.edu': '+52 555-0200',
        'laura.martinez@escuela.edu': '+52 555-0106',
      };
      const data = {
        access_token: 'mock-token-dev',
        correo: user.correo,
        nombre: user.nombre,
        tipo_usuario: user.tipo_usuario,
        telefono: MOCK_PHONES[user.correo] || null,
      };
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        correo: data.correo,
        nombre: data.nombre,
        tipo_usuario: data.tipo_usuario,
        telefono: data.telefono,
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
        telefono: response.data.telefono ?? null,
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
