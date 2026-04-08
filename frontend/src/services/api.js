import axios from 'axios';

/**
 * Instancia de Axios configurada con la URL base del backend.
 * El proxy de Vite redirige /api → http://localhost:3000 en desarrollo.
 * En producción la variable VITE_API_URL debe apuntar al servidor real.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

/** Adjunta el JWT de localStorage en cada petición saliente y
 * fuerza revalidación para evitar respuestas 304 del navegador. */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Previene que el navegador use la caché y devuelva 304 en lugar de datos frescos
  config.headers['Cache-Control'] = 'no-cache';
  config.headers['Pragma'] = 'no-cache';
  return config;
});

/** Si el servidor responde 401, limpia la sesión local */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      ['token', 'user', 'lastLogin', 'loginExpiry'].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    }
    return Promise.reject(error);
  },
);

export default api;
