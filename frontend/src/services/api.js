import axios from 'axios';

/**
 * Instancia de Axios configurada con la URL base del backend.
 * El proxy de Vite redirige /api → http://localhost:3000 en desarrollo.
 * En producción la variable VITE_API_URL debe apuntar al servidor real.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

/** Adjunta el JWT de localStorage en cada petición saliente */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Si el servidor responde 401, limpia la sesión local */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

export default api;
