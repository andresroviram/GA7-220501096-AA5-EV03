// ─── Datos mock del Dashboard ─────────────────────────────────────────────────
// Todos los valores se derivan de los otros mocks para mantener una única
// fuente de verdad. Cuando se conecte el backend, solo se reemplazan los
// imports por llamadas API.

import { estudiantes }         from './mockEstudiantes';
import { docentes }            from './mockDocentes';
import { materias }            from './mockMaterias';
import { estadisticasGrupos }  from './mockGrupos';
import { promediosPorGrupo }   from './mockCalificaciones';

// ── Stat cards ────────────────────────────────────────────────────────────────
export const stats = [
  {
    id: 1,
    label: 'Estudiantes Registrados',
    value: estudiantes.length,
  },
  {
    id: 2,
    label: 'Docentes Activos',
    value: docentes.filter((d) => d.estado === 'Activo').length,
  },
  {
    id: 3,
    label: 'Materias Activas',
    value: materias.filter((m) => m.estado === 'Activo').length,
  },
  {
    id: 4,
    label: 'Grupos Activos',
    value: estadisticasGrupos.totalGrupos,
  },
];

// ── Top 5 alumnos por promedio ────────────────────────────────────────────────
export const topStudents = [...estudiantes]
  .sort((a, b) => b.promedio - a.promedio)
  .slice(0, 5)
  .map((est, i) => ({
    id: i + 1,
    name: est.nombre.split(' ').slice(0, 2).join(' '),
    group: `Grupo ${est.grupo}`,
    score: est.promedio,
  }));

// ── Promedio por grupo — deduplicado, para el widget de barras ────────────────
const _seen = new Set();
const _dedupedPromedios = promediosPorGrupo.filter(({ grupo }) => {
  if (_seen.has(grupo)) return false;
  _seen.add(grupo);
  return true;
});

// Formato largo "Grupo 1A" para GroupAverageChart
export const groupAverages = _dedupedPromedios.map(({ grupo, promedio }) => ({
  grupo: `Grupo ${grupo}`,
  promedio,
}));

// Formato corto "1A" para el eje X de AcademicPerformanceChart
export const academicPerformance = _dedupedPromedios.map(({ grupo, promedio }) => ({
  grupo,
  promedio,
}));

// ── Distribución de estudiantes por grado ────────────────────────────────────
const _gradeCounts = {};
estudiantes.forEach(({ grupo }) => {
  const grade = grupo.charAt(0);
  _gradeCounts[grade] = (_gradeCounts[grade] || 0) + 1;
});

const _LABELS  = { '1': '1er Grado', '2': '2do Grado', '3': '3er Grado', '4': '4to Grado', '5': '5to Grado', '6': '6to Grado' };
const _COLORS  = ['#2A9D6F', '#4DD4A8', '#1A6B4A', '#E63946', '#F4A261', '#E9C46A'];

export const gradeDistribution = Object.entries(_gradeCounts).map(([grade, value], i) => ({
  name:  _LABELS[grade] ?? `Grado ${grade}`,
  value,
  color: _COLORS[i % _COLORS.length],
}));

