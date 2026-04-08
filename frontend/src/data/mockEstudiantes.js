// ─── Mock de Estudiantes ─────────────────────────────────────────────────────

export const estudiantes = [
  { id: 'EST001', nombre: 'Ana García Rodríguez',    email: 'ana.garcia@estudiante.edu',    grupo: '3A', edad: 17, telefono: '+52 555-1001', direccion: 'Calle Principal 123, Col. Centro',   tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 9.8, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST002', nombre: 'Carlos López Martínez',   email: 'carlos.lopez@estudiante.edu',  grupo: '2B', edad: 16, telefono: '+52 555-1003', direccion: 'Av. Reforma 456, Col. Juárez',      tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 9.6, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST003', nombre: 'María Rodríguez Silva',   email: 'maria.rodriguez@estudiante.edu', grupo: '3A', edad: 17, telefono: '+52 555-1005', direccion: 'Calle Juárez 789, Col. Roma',    tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 9.5, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST004', nombre: 'Juan Pérez González',     email: 'juan.perez@estudiante.edu',    grupo: '1C', edad: 15, telefono: '+52 555-1007', direccion: 'Calle Morelos 321, Col. Polanco',   tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 9.3, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST005', nombre: 'Laura Martínez Torres',   email: 'laura.martinez@estudiante.edu', grupo: '2A', edad: 16, telefono: '+52 555-1009', direccion: 'Av. Hidalgo 654, Col. Narvarte',  tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 9.2, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST006', nombre: 'Pedro Sánchez Ruiz',      email: 'pedro.sanchez@estudiante.edu', grupo: '1A', edad: 15, telefono: '+52 555-1011', direccion: 'Calle Allende 987, Col. Del Valle', tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 8.5, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST007', nombre: 'Sofía Torres Mendoza',    email: 'sofia.torres@estudiante.edu',  grupo: '2B', edad: 16, telefono: '+52 555-1013', direccion: 'Av. Constitución 147, Col. Obrera', tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 8.8, estado: 'Activo',     correo_padre: ['juan.rodriguez@escuela.edu'] },
  { id: 'EST008', nombre: 'Diego Morales Castro',    email: 'diego.morales@estudiante.edu', grupo: '3A', edad: 17, telefono: '+52 555-1015', direccion: 'Calle Independencia 258, Col. Sur',  tutor: 'Juan Rodríguez',  tutorTelefono: '+52 555-0200', promedio: 8.2, estado: 'Suspendido', correo_padre: ['juan.rodriguez@escuela.edu'] },
];

/**
 * Devuelve los estudiantes bajo la tutela de un padre/acudiente.
 * Un padre puede ser acudiente de varios estudiantes.
 */
export function getEstudiantesByPadre(correo) {
  return estudiantes.filter((e) => e.correo_padre?.includes(correo));
}

export const padres = [
  { id: 1, nombre: 'Juan Rodríguez',  correo: 'juan.rodriguez@escuela.edu' },
  { id: 2, nombre: 'María Rodríguez', correo: 'maria.rodriguez@padre.edu' },
  { id: 3, nombre: 'José López',      correo: 'jose.lopez@padre.edu' },
  { id: 4, nombre: 'Carmen Silva',    correo: 'carmen.silva@padre.edu' },
  { id: 5, nombre: 'Ana González',    correo: 'ana.gonzalez@padre.edu' },
  { id: 6, nombre: 'Roberto Torres',  correo: 'roberto.torres@padre.edu' },
  { id: 7, nombre: 'Elena Ruiz',      correo: 'elena.ruiz@padre.edu' },
  { id: 8, nombre: 'Miguel Mendoza',  correo: 'miguel.mendoza@padre.edu' },
  { id: 9, nombre: 'Patricia Castro', correo: 'patricia.castro@padre.edu' },
];

export const GRUPOS_LIST = ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C'];
export const ESTADOS_LIST = ['Activo', 'Inactivo', 'Suspendido'];
export const RANGOS_EDAD  = ['13-14 años', '15-16 años', '17-18 años'];

export const GRUPOS_WIDGET = [
  'Grupo 1A', 'Grupo 1B', 'Grupo 1C',
  'Grupo 2A', 'Grupo 2B', 'Grupo 2C',
  'Grupo 3A', 'Grupo 3B', 'Grupo 3C',
];
