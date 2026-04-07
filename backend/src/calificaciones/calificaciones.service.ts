import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { Alumno } from '../alumnos/alumno.entity';
import { Materia } from '../materias/materia.entity';
import { Grupo } from '../grupos/grupo.entity';
import { CreateCalificacionDto, UpdateCalificacionDto } from './dto/calificacion.dto';

@Injectable()
export class CalificacionesService {
    constructor(
        @InjectRepository(Calificacion)
        private readonly repo: Repository<Calificacion>,
        @InjectRepository(Alumno)
        private readonly alumnoRepo: Repository<Alumno>,
        @InjectRepository(Materia)
        private readonly materiaRepo: Repository<Materia>,
        @InjectRepository(Grupo)
        private readonly grupoRepo: Repository<Grupo>,
    ) { }

    async findAll(idAlumno?: number, idMateria?: number): Promise<any[]> {
        const where: any = {};
        if (idAlumno) where.id_alumno = idAlumno;
        if (idMateria) where.id_materia = idMateria;
        const calificaciones = await this.repo.find({ where });

        const alumnos = await this.alumnoRepo.find();
        const materias = await this.materiaRepo.find();
        const grupos = await this.grupoRepo.find();

        const alumnoMap = new Map(alumnos.map((a) => [a.id_alumno, a]));
        const materiaMap = new Map(materias.map((m) => [m.id_materia, m]));
        const grupoMap = new Map(grupos.map((g) => [g.id_grupo, g.nombre]));

        return calificaciones.map((c) => {
            const alumno = alumnoMap.get(c.id_alumno);
            const materia = materiaMap.get(c.id_materia);
            const grupoNombre = alumno ? (grupoMap.get(alumno.id_grupo) ?? '') : '';
            return {
                id: c.id_calificacion,
                estudiante: alumno ? `${alumno.nombre} ${alumno.apellido}` : `Alumno #${c.id_alumno}`,
                materia: materia?.nombre ?? `Materia #${c.id_materia}`,
                grupo: grupoNombre,
                calificacion: c.valor,
                fecha: c.fecha_registro,
            };
        });
    }

    async findOne(id: number): Promise<Calificacion> {
        const c = await this.repo.findOne({ where: { id_calificacion: id } });
        if (!c) throw new NotFoundException(`Calificación #${id} no encontrada`);
        return c;
    }

    create(dto: CreateCalificacionDto): Promise<Calificacion> {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateCalificacionDto): Promise<Calificacion> {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.repo.delete(id);
    }

    /** Promedios por grupo (para la gráfica del frontend) */
    async getPromediosPorGrupo(): Promise<{ grupo: string; promedio: number }[]> {
        const all = await this.repo.find();
        const alumnos = await this.alumnoRepo.find();
        const grupos = await this.grupoRepo.find();

        const alumnoMap = new Map(alumnos.map((a) => [a.id_alumno, a]));
        const grupoMap = new Map(grupos.map((g) => [g.id_grupo, g.nombre]));

        const map: Record<string, number[]> = {};
        all.forEach((c) => {
            const alumno = alumnoMap.get(c.id_alumno);
            const grupoNombre = alumno ? (grupoMap.get(alumno.id_grupo) ?? 'Sin grupo') : 'Sin grupo';
            if (!map[grupoNombre]) map[grupoNombre] = [];
            map[grupoNombre].push(c.valor);
        });
        return Object.entries(map).map(([grupo, values]) => ({
            grupo,
            promedio: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
        }));
    }
}
