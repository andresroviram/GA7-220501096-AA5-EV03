// ─── Mock de Reportes ─────────────────────────────────────────────────────────

export const reportesRecientes = [
  { id: 1, tipo: 'Calificaciones',  descripcion: 'Reporte general de calificaciones',      fecha: '2025-05-20', generadoPor: 'Admin', formato: 'PDF' },
  { id: 2, tipo: 'Estudiantes',     descripcion: 'Listado de estudiantes activos',          fecha: '2025-05-18', generadoPor: 'Admin', formato: 'Excel' },
  { id: 3, tipo: 'Docentes',        descripcion: 'Historial de docentes por departamento',  fecha: '2025-05-15', generadoPor: 'Admin', formato: 'PDF' },
  { id: 4, tipo: 'Asistencia',      descripcion: 'Reporte de asistencia Grupo 3A',          fecha: '2025-05-10', generadoPor: 'Admin', formato: 'PDF' },
];

export const tiposReporte = [
  { id: 1, titulo: 'Calificaciones',  descripcion: 'Reporte general de notas por grupo o materia',          icono: 'file',     filtros: ['grupo', 'periodo'] },
  { id: 2, titulo: 'Estudiantes',     descripcion: 'Listado de estudiantes registrados con estadísticas',   icono: 'users',    filtros: ['grupo'] },
  { id: 3, titulo: 'Docentes',        descripcion: 'Historial y estado del personal docente',               icono: 'check',    filtros: ['periodo'] },
  { id: 4, titulo: 'Horarios',        descripcion: 'Distribución de horarios por grupo y aula',             icono: 'calendar', filtros: ['grupo'] },
  { id: 5, titulo: 'Asistencia',      descripcion: 'Registro de asistencia por estudiante o grupo',         icono: 'grid',     filtros: ['grupo', 'periodo'] },
  { id: 6, titulo: 'Rendimiento',     descripcion: 'Indicadores de rendimiento académico general',          icono: 'chart',    filtros: ['periodo'] },
];
