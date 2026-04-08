import axios from 'axios';

/** URL base del módulo de autenticación — usa backend real en producción si VITE_API_URL está definida */
const AUTH_API_URL = `${import.meta.env.VITE_API_URL ?? '/api'}/auth`;

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

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Guarda los datos de sesión en el storage correcto según "remember". */
function saveSession(data, remember) {
  const storage = remember ? localStorage : sessionStorage;
  if (remember) {
    localStorage.setItem('loginExpiry', String(Date.now() + THIRTY_DAYS_MS));
  } else {
    // Si antes tenía sesión persistente, la limpiamos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('loginExpiry');
  }
  storage.setItem('token', data.access_token);
  storage.setItem('lastLogin', new Date().toISOString());
  storage.setItem('user', JSON.stringify({
    correo: data.correo,
    nombre: data.nombre,
    tipo_usuario: data.tipo_usuario,
    telefono: data.telefono ?? null,
  }));
}

const authService = {
  async login(correo, password, remember = false) {
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
      saveSession(data, remember);
      return data;
    }

    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, { correo, password });

      if (response.data.access_token) {
        saveSession(response.data, remember);
      }

      return response.data;
    } catch (err) {
      // Si el error es de red (sin backend disponible) intentar con mock local
      if (!err.response) {
        const user = MOCK_USERS.find(
          (u) => u.correo === correo && u.password === password,
        );
        if (!user) {
          const authErr = new Error('Credenciales incorrectas');
          authErr.response = { status: 401 };
          throw authErr;
        }
        const MOCK_PHONES = {
          'admin@escuela.edu':          '+52 555-0100',
          'maria.garcia@escuela.edu':   '+52 555-0102',
          'juan.rodriguez@escuela.edu': '+52 555-0200',
          'laura.martinez@escuela.edu': '+52 555-0106',
        };
        const data = {
          access_token: 'mock-token-fallback',
          correo: user.correo,
          nombre: user.nombre,
          tipo_usuario: user.tipo_usuario,
          telefono: MOCK_PHONES[user.correo] || null,
        };
        saveSession(data, remember);
        return data;
      }
      throw err;
    }
  },

  /** Cierra la sesión eliminando datos de ambos storages. */
  logout() {
    ['token', 'user', 'lastLogin', 'loginExpiry'].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  },

  /**
   * @returns {boolean} true si hay sesión válida (no expirada).
   * Comprueba sessionStorage primero; luego localStorage con expiración.
   */
  isAuthenticated() {
    if (sessionStorage.getItem('token')) return true;
    const token = localStorage.getItem('token');
    if (!token) return false;
    const expiry = Number(localStorage.getItem('loginExpiry') ?? 0);
    if (expiry && Date.now() > expiry) {
      // Sesión expirada — limpiar
      ['token', 'user', 'lastLogin', 'loginExpiry'].forEach((k) => localStorage.removeItem(k));
      return false;
    }
    return true;
  },

  /**
   * Devuelve el objeto de usuario almacenado en sesión (session o local).
   * @returns {{ correo: string, nombre: string, tipo_usuario: string } | null}
   */
  getCurrentUser() {
    const raw = sessionStorage.getItem('user') ?? localStorage.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  /** @returns {string|null} Token JWT o null */
  getToken() {
    return sessionStorage.getItem('token') ?? localStorage.getItem('token');
  },

  /**
   * Registra un nuevo usuario mediante POST /auth/register.
   * @param {{ nombre: string, apellido: string, correo: string, password: string, tipo_usuario: string }} data
   */
  async register(data) {
    const response = await axios.post(`${AUTH_API_URL}/register`, data);
    return response.data;
  },

  /**
   * Solicita el código de recuperación de contraseña.
   * En modo mock genera un código ficticio para no requerir backend.
   * @param {string} correo
   * @returns {{ message: string, resetToken?: string }}
   */
  async forgotPassword(correo) {
    if (USE_MOCK) {
      const knownEmails = [
        'admin@escuela.edu',
        'maria.garcia@escuela.edu',
        'juan.rodriguez@escuela.edu',
        'laura.martinez@escuela.edu',
      ];
      // Respuesta genérica (no revela si el correo existe)
      const message = 'Si el correo está registrado, recibirás el código de recuperación.';
      if (knownEmails.includes(correo.toLowerCase().trim())) {
        return { message, resetToken: 'A1B2C3' }; // token fijo para dev/mock
      }
      return { message };
    }
    const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { correo });
    return response.data;
  },

  /**
   * Restablece la contraseña usando el token recibido.
   * @param {string} token   Código de 6 caracteres
   * @param {string} newPassword
   */
  async resetPassword(token, newPassword) {
    if (USE_MOCK) {
      if (token !== 'A1B2C3') {
        const err = new Error('El código es inválido o ha expirado.');
        err.response = { status: 400, data: { message: 'El código es inválido o ha expirado.' } };
        throw err;
      }
      return { message: 'Contraseña actualizada correctamente.' };
    }
    const response = await axios.post(`${AUTH_API_URL}/reset-password`, { token, newPassword });
    return response.data;
  },
};

export default authService;
