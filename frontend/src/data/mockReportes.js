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

/**
 * Retorna datos mock (rows + columns + titulo) para generar un reporte simulado.
 */
export async function getMockReporteData(tipoId) {
  switch (tipoId) {
    case 1: {
      const { calificaciones } = await import('./mockCalificaciones.js');
      return {
        titulo: 'Reporte de Calificaciones',
        rows: calificaciones,
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'estudiante', label: 'Estudiante' },
          { key: 'materia', label: 'Materia' },
          { key: 'grupo', label: 'Grupo' },
          { key: 'calificacion', label: 'Calificación' },
          { key: 'fecha', label: 'Fecha' },
        ],
      };
    }
    case 2: {
      const { estudiantes } = await import('./mockEstudiantes.js');
      return {
        titulo: 'Listado de Estudiantes',
        rows: estudiantes,
        columns: [
          { key: 'id', label: 'Matrícula' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'grupo', label: 'Grupo' },
          { key: 'edad', label: 'Edad' },
          { key: 'promedio', label: 'Promedio' },
          { key: 'estado', label: 'Estado' },
        ],
      };
    }
    case 3: {
      const { docentes } = await import('./mockDocentes.js');
      return {
        titulo: 'Reporte de Docentes',
        rows: docentes,
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'departamento', label: 'Departamento' },
          { key: 'email', label: 'Email' },
          { key: 'estado', label: 'Estado' },
          { key: 'fechaIngreso', label: 'Fecha Ingreso' },
        ],
      };
    }
    case 4: {
      return {
        titulo: 'Distribución de Horarios',
        rows: [
          { grupo: '1A', materia: 'Matemáticas',  docente: 'Dr. Juan Pérez',     aula: 'A-101', horario: 'Lun 08:00-09:00' },
          { grupo: '1A', materia: 'Historia',     docente: 'Prof. Carlos López', aula: 'A-102', horario: 'Mar 09:00-10:00' },
          { grupo: '2B', materia: 'Ciencias',     docente: 'Dra. María García',  aula: 'B-201', horario: 'Mié 10:00-11:00' },
          { grupo: '3A', materia: 'Literatura',   docente: 'Lic. Ana Martínez',  aula: 'B-202', horario: 'Jue 11:00-12:00' },
        ],
        columns: [
          { key: 'grupo', label: 'Grupo' },
          { key: 'materia', label: 'Materia' },
          { key: 'docente', label: 'Docente' },
          { key: 'aula', label: 'Aula' },
          { key: 'horario', label: 'Horario' },
        ],
      };
    }
    case 5: {
      return {
        titulo: 'Registro de Asistencia',
        rows: [
          { estudiante: 'Ana García',      grupo: '3A', fecha: '2025-05-20', estado: 'Presente' },
          { estudiante: 'Carlos López',    grupo: '2B', fecha: '2025-05-20', estado: 'Presente' },
          { estudiante: 'María Rodríguez', grupo: '3A', fecha: '2025-05-20', estado: 'Ausente'  },
          { estudiante: 'Juan Pérez',      grupo: '1C', fecha: '2025-05-20', estado: 'Presente' },
        ],
        columns: [
          { key: 'estudiante', label: 'Estudiante' },
          { key: 'grupo',      label: 'Grupo'      },
          { key: 'fecha',      label: 'Fecha'      },
          { key: 'estado',     label: 'Estado'     },
        ],
      };
    }
    default: {
      return {
        titulo: 'Indicadores de Rendimiento Académico',
        rows: [
          { grupo: '1A', promedio: 8.2, aprobados: 28, reprobados: 4, periodo: '2025-I' },
          { grupo: '2B', promedio: 8.8, aprobados: 30, reprobados: 2, periodo: '2025-I' },
          { grupo: '3A', promedio: 9.1, aprobados: 32, reprobados: 1, periodo: '2025-I' },
          { grupo: '4A', promedio: 8.3, aprobados: 27, reprobados: 5, periodo: '2025-I' },
        ],
        columns: [
          { key: 'grupo',       label: 'Grupo'      },
          { key: 'promedio',    label: 'Promedio'   },
          { key: 'aprobados',   label: 'Aprobados'  },
          { key: 'reprobados',  label: 'Reprobados' },
          { key: 'periodo',     label: 'Período'    },
        ],
      };
    }
  }
}
