import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { CreateCalificacionDto, UpdateCalificacionDto } from './dto/calificacion.dto';

@Injectable()
export class CalificacionesService {
    constructor(
        @InjectRepository(Calificacion)
        private readonly repo: Repository<Calificacion>,
    ) { }

    findAll(idAlumno?: number, idMateria?: number): Promise<Calificacion[]> {
        const where: any = {};
        if (idAlumno) where.id_alumno = idAlumno;
        if (idMateria) where.id_materia = idMateria;
        return this.repo.find({ where });
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
        const map: Record<string, number[]> = {};
        all.forEach((c) => {
            const key = `Grupo ${c.id_alumno}`; // simplificado; en prod join con alumno.grupo
            if (!map[key]) map[key] = [];
            map[key].push(c.valor);
        });
        return Object.entries(map).map(([grupo, values]) => ({
            grupo,
            promedio: Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10,
        }));
    }
}
