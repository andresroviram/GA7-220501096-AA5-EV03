import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Alumno } from '../alumnos/alumno.entity';
import { Grupo } from '../grupos/grupo.entity';
import { Horario } from '../horarios/horario.entity';
import { GrupoHorario } from '../horarios/grupo-horario.entity';
import { Materia } from '../materias/materia.entity';
import { Calificacion } from '../calificaciones/calificacion.entity';
import { Rol } from '../roles/rol.entity';
import { Permiso } from '../roles/permiso.entity';

/**
 * Usuarios demo — estos son los que se muestran en la tarjeta de login.
 * Los docentes incluyen campos extra (cedula, departamento, fecha_ingreso).
 */
const DEMO_USERS: Array<{
    nombre: string; apellido: string; correo: string; telefono: string;
    password: string; tipo_usuario: 'administrativo' | 'docente' | 'padre';
    cedula?: string; departamento?: string; fecha_ingreso?: string;
}> = [
        { nombre: 'Carlos', apellido: 'Admin', correo: 'admin@escuela.edu', telefono: '+52 555-0100', password: 'Admin123!', tipo_usuario: 'administrativo' },
        // Docentes — coinciden con mockDocentes del frontend
        { nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@escuela.edu', telefono: '+52 555-0101', password: 'Docente123!', tipo_usuario: 'docente', cedula: '123456789', departamento: 'Matemáticas', fecha_ingreso: '2020-08-15' },
        { nombre: 'María', apellido: 'García', correo: 'maria.garcia@escuela.edu', telefono: '+52 555-0102', password: 'Docente123!', tipo_usuario: 'docente', cedula: '234567890', departamento: 'Ciencias', fecha_ingreso: '2019-09-01' },
        { nombre: 'Carlos', apellido: 'López', correo: 'carlos.lopez@escuela.edu', telefono: '+52 555-0103', password: 'Docente123!', tipo_usuario: 'docente', cedula: '345678901', departamento: 'Humanidades', fecha_ingreso: '2021-02-10' },
        { nombre: 'Ana', apellido: 'Martínez', correo: 'ana.martinez@escuela.edu', telefono: '+52 555-0104', password: 'Docente123!', tipo_usuario: 'docente', cedula: '456789012', departamento: 'Idiomas', fecha_ingreso: '2018-03-20' },
        { nombre: 'Roberto', apellido: 'Silva', correo: 'roberto.silva@escuela.edu', telefono: '+52 555-0105', password: 'Docente123!', tipo_usuario: 'docente', cedula: '567890123', departamento: 'Edu. Física', fecha_ingreso: '2022-01-15' },
        { nombre: 'Laura', apellido: 'Torres', correo: 'laura.torres@escuela.edu', telefono: '+52 555-0106', password: 'Docente123!', tipo_usuario: 'docente', cedula: '67890123', departamento: 'Matemáticas', fecha_ingreso: '2020-11-05' },
        // Padre de familia
        { nombre: 'Juan', apellido: 'Rodríguez', correo: 'juan.rodriguez@escuela.edu', telefono: '+52 555-0200', password: 'Padre123!', tipo_usuario: 'padre' },
    ];

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(User) private readonly usuarioRepo: Repository<User>,
        @InjectRepository(Alumno) private readonly alumnoRepo: Repository<Alumno>,
        @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
        @InjectRepository(Horario) private readonly horarioRepo: Repository<Horario>,
        @InjectRepository(GrupoHorario) private readonly grupoHorarioRepo: Repository<GrupoHorario>,
        @InjectRepository(Materia) private readonly materiaRepo: Repository<Materia>,
        @InjectRepository(Calificacion) private readonly califRepo: Repository<Calificacion>,
        @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
        @InjectRepository(Permiso) private readonly permisoRepo: Repository<Permiso>,
    ) { }

    async onModuleInit() {
        // Espera a que TypeORM haya sincronizado el esquema antes de consultar
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }
        const count = await this.usuarioRepo.count();
        if (count > 0) return; // Ya hay datos, no re-sembrar
        await this.seed();
    }

    async seed() {
        this.logger.log('🌱 Sembrando datos de demostración...');

        /* ── Usuarios ── */
        const usuariosSaved: User[] = [];
        for (const u of DEMO_USERS) {
            const hashed = await bcrypt.hash(u.password, 10);
            const saved = await this.usuarioRepo.save(
                this.usuarioRepo.create({
                    ...u,
                    password: hashed,
                    cedula: u.cedula ?? null,
                    departamento: u.departamento ?? null,
                    fecha_ingreso: u.fecha_ingreso ?? null,
                }),
            );
            usuariosSaved.push(saved);
        }
        // Índices: 0=admin, 1=Juan Pérez, 2=María García, 3=Carlos López,
        //          4=Ana Martínez, 5=Roberto Silva, 6=Laura Torres, 7=padre
        const [, dJuanPerez, dMariaGarcia, dCarlosLopez, dAnaMartinez, dRobertoSilva, dLauraTorres] = usuariosSaved;

        /* ── Grupos (coinciden con los grupos del mockEstudiantes) ── */
        const [g1A, g1B, g1C, g2A, g2B, g3A] = await this.grupoRepo.save([
            { nombre: '1A', grado: '1°' },
            { nombre: '1B', grado: '1°' },
            { nombre: '1C', grado: '1°' },
            { nombre: '2A', grado: '2°' },
            { nombre: '2B', grado: '2°' },
            { nombre: '3A', grado: '3°' },
        ]);

        /* ── Alumnos (idénticos al mockEstudiantes) ── */
        await this.alumnoRepo.save([
            { nombre: 'Ana', apellido: 'García Rodríguez', fecha_nacimiento: '2009-03-15', id_grupo: g3A.id_grupo, email: 'ana.garcia@estudiante.edu', telefono: '+52 555-1001', direccion: 'Calle Principal 123, Col. Centro', tutor: 'María Rodríguez', tutor_telefono: '+52 555-1002', promedio: 9.8, estado: 'Activo' },
            { nombre: 'Carlos', apellido: 'López Martínez', fecha_nacimiento: '2010-05-10', id_grupo: g2B.id_grupo, email: 'carlos.lopez@estudiante.edu', telefono: '+52 555-1003', direccion: 'Av. Reforma 456, Col. Juárez', tutor: 'José López', tutor_telefono: '+52 555-1004', promedio: 9.6, estado: 'Activo' },
            { nombre: 'María', apellido: 'Rodríguez Silva', fecha_nacimiento: '2009-07-22', id_grupo: g3A.id_grupo, email: 'maria.rodriguez@estudiante.edu', telefono: '+52 555-1005', direccion: 'Calle Juárez 789, Col. Roma', tutor: 'Carmen Silva', tutor_telefono: '+52 555-1006', promedio: 9.5, estado: 'Activo' },
            { nombre: 'Juan', apellido: 'Pérez González', fecha_nacimiento: '2011-01-18', id_grupo: g1C.id_grupo, email: 'juan.perez@estudiante.edu', telefono: '+52 555-1007', direccion: 'Calle Morelos 321, Col. Polanco', tutor: 'Ana González', tutor_telefono: '+52 555-1008', promedio: 9.3, estado: 'Activo' },
            { nombre: 'Laura', apellido: 'Martínez Torres', fecha_nacimiento: '2010-09-30', id_grupo: g2A.id_grupo, email: 'laura.martinez@estudiante.edu', telefono: '+52 555-1009', direccion: 'Av. Hidalgo 654, Col. Narvarte', tutor: 'Roberto Torres', tutor_telefono: '+52 555-1010', promedio: 9.2, estado: 'Activo' },
            { nombre: 'Pedro', apellido: 'Sánchez Ruiz', fecha_nacimiento: '2011-04-12', id_grupo: g1A.id_grupo, email: 'pedro.sanchez@estudiante.edu', telefono: '+52 555-1011', direccion: 'Calle Allende 987, Col. Del Valle', tutor: 'Elena Ruiz', tutor_telefono: '+52 555-1012', promedio: 8.5, estado: 'Activo' },
            { nombre: 'Sofía', apellido: 'Torres Mendoza', fecha_nacimiento: '2010-11-05', id_grupo: g2B.id_grupo, email: 'sofia.torres@estudiante.edu', telefono: '+52 555-1013', direccion: 'Av. Constitución 147, Col. Obrera', tutor: 'Miguel Mendoza', tutor_telefono: '+52 555-1014', promedio: 8.8, estado: 'Activo' },
            { nombre: 'Diego', apellido: 'Morales Castro', fecha_nacimiento: '2009-06-25', id_grupo: g3A.id_grupo, email: 'diego.morales@estudiante.edu', telefono: '+52 555-1015', direccion: 'Calle Independencia 258, Col. Sur', tutor: 'Patricia Castro', tutor_telefono: '+52 555-1016', promedio: 8.2, estado: 'Suspendido' },
        ]);

        /* ── Materias (idénticas al mockMaterias) ── */
        const [mat1, mat2, mat3, mat4, mat5, mat6, mat7] = await this.materiaRepo.save([
            { nombre: 'Matemáticas', departamento: 'Ciencias Exactas', creditos: 5, id_docente: dJuanPerez.id, estado: 'Activo' },
            { nombre: 'Historia', departamento: 'Humanidades', creditos: 4, id_docente: dCarlosLopez.id, estado: 'Activo' },
            { nombre: 'Ciencias', departamento: 'Ciencias Nat.', creditos: 5, id_docente: dMariaGarcia.id, estado: 'Activo' },
            { nombre: 'Literatura', departamento: 'Humanidades', creditos: 3, id_docente: dAnaMartinez.id, estado: 'Activo' },
            { nombre: 'Física', departamento: 'Ciencias Exactas', creditos: 5, id_docente: dLauraTorres.id, estado: 'Activo' },
            { nombre: 'Geografía', departamento: 'Ciencias Soc.', creditos: 3, id_docente: dCarlosLopez.id, estado: 'Activo' },
            { nombre: 'Filosofía', departamento: 'Humanidades', creditos: 3, id_docente: dRobertoSilva.id, estado: 'Activo' },
            { nombre: 'Química', departamento: 'Ciencias Nat.', creditos: 5, id_docente: null, estado: 'Inactivo' },
        ]);

        /* ── Horarios base (slots únicos de dia + hora) ── */
        const [h1, h2, h3, h4, h5, h6, h7, h8] = await this.horarioRepo.save([
            { dia_semana: 'Lunes', hora_inicio: '08:00', hora_fin: '09:30' },
            { dia_semana: 'Lunes', hora_inicio: '09:00', hora_fin: '10:30' },
            { dia_semana: 'Martes', hora_inicio: '08:00', hora_fin: '09:30' },
            { dia_semana: 'Miércoles', hora_inicio: '09:00', hora_fin: '10:30' },
            { dia_semana: 'Jueves', hora_inicio: '07:00', hora_fin: '08:30' },
            { dia_semana: 'Viernes', hora_inicio: '10:00', hora_fin: '11:30' },
            { dia_semana: 'Lunes', hora_inicio: '12:00', hora_fin: '13:30' },
            { dia_semana: 'Martes', hora_inicio: '11:00', hora_fin: '12:30' },
        ]);

        /* ── Bloques Grupo-Horario (idénticos al mockGrupos.horarios) ── */
        await this.grupoHorarioRepo.save([
            { id_grupo: g1A.id_grupo, id_horario: h1.id_horario, materia: mat1.nombre, docente: 'Juan Pérez', aula: 'Aula 101', estado: 'Activo' },
            { id_grupo: g1B.id_grupo, id_horario: h2.id_horario, materia: mat2.nombre, docente: 'Carlos López', aula: 'Aula 101', estado: 'Activo' },
            { id_grupo: g2B.id_grupo, id_horario: h3.id_horario, materia: mat3.nombre, docente: 'María García', aula: 'Lab 1', estado: 'Activo' },
            { id_grupo: g2B.id_grupo, id_horario: h4.id_horario, materia: mat4.nombre, docente: 'Ana Martínez', aula: 'Aula 203', estado: 'Activo' },
            { id_grupo: g3A.id_grupo, id_horario: h5.id_horario, materia: mat5.nombre, docente: 'Laura Torres', aula: 'Lab 2', estado: 'Activo' },
            { id_grupo: g3A.id_grupo, id_horario: h6.id_horario, materia: mat1.nombre, docente: 'Juan Pérez', aula: 'Aula 101', estado: 'Activo' },
            { id_grupo: g1C.id_grupo, id_horario: h7.id_horario, materia: mat7.nombre, docente: 'Roberto Silva', aula: 'Aula 301', estado: 'Activo' },
            { id_grupo: g2A.id_grupo, id_horario: h8.id_horario, materia: mat6.nombre, docente: 'Carlos López', aula: 'Aula 205', estado: 'Activo' },
        ]);

        /* ── Calificaciones (basadas en mockCalificaciones) ── */
        const alumnos = await this.alumnoRepo.find();
        const [a1, a2, a3, a4, a5, a6] = alumnos;
        await this.califRepo.save([
            { id_alumno: a1.id_alumno, id_materia: mat1.id_materia, valor: 8.5, fecha_registro: '2025-05-15' },
            { id_alumno: a2.id_alumno, id_materia: mat2.id_materia, valor: 9.0, fecha_registro: '2025-05-16' },
            { id_alumno: a3.id_alumno, id_materia: mat3.id_materia, valor: 7.5, fecha_registro: '2025-05-17' },
            { id_alumno: a4.id_alumno, id_materia: mat4.id_materia, valor: 8.0, fecha_registro: '2025-05-18' },
            { id_alumno: a5.id_alumno, id_materia: mat1.id_materia, valor: 9.2, fecha_registro: '2025-05-19' },
            { id_alumno: a6.id_alumno, id_materia: mat5.id_materia, valor: 7.0, fecha_registro: '2025-05-20' },
        ]);

        this.logger.log('✅ Seed completado.');
        this.logger.log('');
        this.logger.log('  Cuentas de acceso:');
        for (const u of DEMO_USERS) {
            this.logger.log(`    [${u.tipo_usuario}] ${u.correo}  /  ${u.password}`);
        }
        this.logger.log('');

        /* ── Roles y permisos ── */
        const MODULOS = ['Dashboard', 'Docentes', 'Estudiantes', 'Calificaciones', 'Grupos/Horarios', 'Materias', 'Reportes', 'Configuraciones'];
        const ROLES_SEED: Array<{ nombre: string; descripcion: string; permisos: Record<string, boolean> }> = [
            {
                nombre: 'Administrador',
                descripcion: 'Acceso completo al sistema',
                permisos: MODULOS.reduce((a, m) => ({ ...a, [m]: true }), {}),
            },
            {
                nombre: 'Docente',
                descripcion: 'Gestión de calificaciones y grupos',
                permisos: { Dashboard: true, Docentes: false, Estudiantes: true, Calificaciones: true, 'Grupos/Horarios': true, Materias: true, Reportes: true, Configuraciones: false },
            },
            {
                nombre: 'Estudiante',
                descripcion: 'Consulta de notas y horarios',
                permisos: { Dashboard: true, Docentes: false, Estudiantes: false, Calificaciones: true, 'Grupos/Horarios': true, Materias: false, Reportes: false, Configuraciones: false },
            },
            {
                nombre: 'Padre/Tutor',
                descripcion: 'Seguimiento de acudidos',
                permisos: { Dashboard: true, Docentes: false, Estudiantes: true, Calificaciones: true, 'Grupos/Horarios': true, Materias: false, Reportes: true, Configuraciones: false },
            },
        ];

        for (const rd of ROLES_SEED) {
            const rol = await this.rolRepo.save(
                this.rolRepo.create({ nombre: rd.nombre, descripcion: rd.descripcion }),
            );
            const permisosSeed = MODULOS.map((m) =>
                this.permisoRepo.create({ id_rol: rol.id, modulo: m, acceso: rd.permisos[m] ?? false }),
            );
            await this.permisoRepo.save(permisosSeed);
        }
    }
}
