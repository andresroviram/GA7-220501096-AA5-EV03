import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

/** Usuarios demo — estos son los que se muestran en la tarjeta de login del frontend */
const DEMO_USERS = [
    { nombre: 'Carlos', apellido: 'Admin', correo: 'admin@escuela.edu', telefono: '+52 555-0100', password: 'Admin123!', tipo_usuario: 'administrativo' as const },
    { nombre: 'María', apellido: 'García', correo: 'maria.garcia@escuela.edu', telefono: '+52 555-0102', password: 'Docente123!', tipo_usuario: 'docente' as const },
    { nombre: 'Juan', apellido: 'Rodríguez', correo: 'juan.rodriguez@escuela.edu', telefono: '+52 555-0200', password: 'Padre123!', tipo_usuario: 'padre' as const },
    { nombre: 'Laura', apellido: 'Martínez', correo: 'laura.martinez@escuela.edu', telefono: '+52 555-0106', password: 'Docente123!', tipo_usuario: 'docente' as const },
];

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
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
                this.usuarioRepo.create({ ...u, password: hashed }),
            );
            usuariosSaved.push(saved);
        }
        const [, docente1, , docente2] = usuariosSaved;

        /* ── Grupos ── */
        const [g1, g2, g3] = await this.grupoRepo.save([
            { nombre: '1A', grado: '1°' },
            { nombre: '1B', grado: '1°' },
            { nombre: '2A', grado: '2°' },
        ]);

        /* ── Alumnos ── */
        await this.alumnoRepo.save([
            { nombre: 'Sofía', apellido: 'López', fecha_nacimiento: '2010-03-15', id_grupo: g1.id_grupo },
            { nombre: 'Andrés', apellido: 'Pérez', fecha_nacimiento: '2010-07-22', id_grupo: g1.id_grupo },
            { nombre: 'Valentina', apellido: 'Gómez', fecha_nacimiento: '2010-11-05', id_grupo: g2.id_grupo },
            { nombre: 'Miguel', apellido: 'Torres', fecha_nacimiento: '2009-01-18', id_grupo: g2.id_grupo },
            { nombre: 'Camila', apellido: 'Ramírez', fecha_nacimiento: '2009-06-30', id_grupo: g3.id_grupo },
            { nombre: 'Sebastián', apellido: 'Morales', fecha_nacimiento: '2009-09-14', id_grupo: g3.id_grupo },
        ]);

        /* ── Horarios base ── */
        const [h1, h2, h3, h4] = await this.horarioRepo.save([
            { dia_semana: 'Lunes', hora_inicio: '07:00', hora_fin: '08:00' },
            { dia_semana: 'Lunes', hora_inicio: '08:00', hora_fin: '09:00' },
            { dia_semana: 'Martes', hora_inicio: '07:00', hora_fin: '08:00' },
            { dia_semana: 'Miércoles', hora_inicio: '09:00', hora_fin: '10:00' },
        ]);

        /* ── Materias ── */
        const [mat1, mat2, mat3, mat4] = await this.materiaRepo.save([
            { nombre: 'Matemáticas', departamento: 'Ciencias Exactas', creditos: 5, id_docente: docente1.id, estado: 'Activo' },
            { nombre: 'Física', departamento: 'Ciencias Exactas', creditos: 4, id_docente: docente1.id, estado: 'Activo' },
            { nombre: 'Español', departamento: 'Humanidades', creditos: 4, id_docente: docente2.id, estado: 'Activo' },
            { nombre: 'Historia', departamento: 'Humanidades', creditos: 3, id_docente: docente2.id, estado: 'Activo' },
        ]);

        /* ── Bloques Grupo-Horario ── */
        await this.grupoHorarioRepo.save([
            { id_grupo: g1.id_grupo, id_horario: h1.id_horario, materia: mat1.nombre, docente: `${docente1.nombre} ${docente1.apellido}`, aula: 'A-101', estado: 'Activo' },
            { id_grupo: g1.id_grupo, id_horario: h2.id_horario, materia: mat3.nombre, docente: `${docente2.nombre} ${docente2.apellido}`, aula: 'A-102', estado: 'Activo' },
            { id_grupo: g2.id_grupo, id_horario: h1.id_horario, materia: mat2.nombre, docente: `${docente1.nombre} ${docente1.apellido}`, aula: 'A-101', estado: 'Conflicto' },
            { id_grupo: g2.id_grupo, id_horario: h3.id_horario, materia: mat4.nombre, docente: `${docente2.nombre} ${docente2.apellido}`, aula: 'B-201', estado: 'Activo' },
            { id_grupo: g3.id_grupo, id_horario: h4.id_horario, materia: mat1.nombre, docente: `${docente1.nombre} ${docente1.apellido}`, aula: 'A-103', estado: 'Activo' },
        ]);

        /* ── Calificaciones ── */
        const alumnos = await this.alumnoRepo.find();
        const materias = [mat1, mat2, mat3];
        for (const alumno of alumnos.slice(0, 4)) {
            for (const mat of materias) {
                await this.califRepo.save({
                    id_alumno: alumno.id_alumno,
                    id_materia: mat.id_materia,
                    valor: +(Math.random() * 3 + 7).toFixed(1), // entre 7.0 y 10.0
                    fecha_registro: '2025-03-15',
                });
            }
        }

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
