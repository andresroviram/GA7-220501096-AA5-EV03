import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuración de Vite para el frontend React.
 *
 * Proxy: todas las peticiones a /api/* se redirigen al backend NestJS
 * en puerto 3000, eliminando problemas de CORS en desarrollo y
 * evitando exponer la URL real del backend en el código del cliente.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Redirige /api/* → http://localhost:3000/*
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
