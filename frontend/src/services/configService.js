import api from './api';

const MOCK_PARAMS = {
  institucion: 'Institución Educativa Demo',
  cicloActual: '2025-I',
  maxEstPorGrupo: 35,
  correoContacto: 'admin@institucion.edu',
  escalaMin: 0,
  escalaMax: 10,
  notaAprobatoria: 6,
};

const isDev = import.meta.env.DEV;

/** Obtiene los parámetros globales del sistema. */
export async function getParams() {
  if (isDev) return { ...MOCK_PARAMS };
  const res = await api.get('/config/params');
  return res.data;
}

/** Guarda los parámetros globales del sistema. */
export async function updateParams(data) {
  if (isDev) return { ...MOCK_PARAMS, ...data };
  const res = await api.put('/config/params', data);
  return res.data;
}
