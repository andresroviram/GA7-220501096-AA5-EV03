// ─── Mock de Grupos y Horarios ───────────────────────────────────────────────

export const horarios = [
  { id: 1, grupo: '1A', materia: 'Matemáticas',  docente: 'Dr. Juan Pérez',      dia: 'Lunes',     horaInicio: '08:00', horaFin: '09:30', aula: 'Aula 101', estado: 'Activo' },
  { id: 2, grupo: '1B', materia: 'Historia',      docente: 'Prof. Carlos López',  dia: 'Lunes',     horaInicio: '09:00', horaFin: '10:30', aula: 'Aula 101', estado: 'Activo' },
  { id: 3, grupo: '2B', materia: 'Ciencias',      docente: 'Dra. María García',   dia: 'Martes',    horaInicio: '08:00', horaFin: '09:30', aula: 'Lab 1',    estado: 'Activo' },
  { id: 4, grupo: '2B', materia: 'Literatura',    docente: 'Lic. Ana Martínez',   dia: 'Miércoles', horaInicio: '09:00', horaFin: '10:30', aula: 'Aula 203', estado: 'Activo' },
  { id: 5, grupo: '3A', materia: 'Física',        docente: 'Dra. Laura Torres',   dia: 'Jueves',    horaInicio: '07:00', horaFin: '08:30', aula: 'Lab 2',    estado: 'Activo' },
  { id: 6, grupo: '3A', materia: 'Matemáticas',   docente: 'Dr. Juan Pérez',      dia: 'Viernes',   horaInicio: '10:00', horaFin: '11:30', aula: 'Aula 101', estado: 'Activo' },
  { id: 7, grupo: '1C', materia: 'Filosofía',     docente: 'Prof. Roberto Silva', dia: 'Lunes',     horaInicio: '12:00', horaFin: '13:30', aula: 'Aula 301', estado: 'Activo' },
  { id: 8, grupo: '2A', materia: 'Geografía',     docente: 'Prof. Carlos López',  dia: 'Martes',    horaInicio: '11:00', horaFin: '12:30', aula: 'Aula 205', estado: 'Activo' },
];

export const GRUPOS_LIST  = ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B'];
export const DIAS_LIST    = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const AULAS_LIST   = ['Aula 101', 'Aula 102', 'Aula 203', 'Aula 205', 'Aula 301', 'Lab 1', 'Lab 2'];
export const HORAS_LIST   = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

export const estadisticasGrupos = {
  totalGrupos:    8,
  totalHorarios:  horarios.length,
  conflictos:     horarios.filter((h) => h.estado === 'Conflicto').length,
  aulasEnUso:     5,
};
