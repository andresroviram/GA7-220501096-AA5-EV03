import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './materia.entity';
import { CreateMateriaDto, UpdateMateriaDto } from './dto/materia.dto';

@Injectable()
export class MateriasService {
    constructor(
        @InjectRepository(Materia)
        private readonly repo: Repository<Materia>,
    ) { }

    findAll(departamento?: string, estado?: string): Promise<Materia[]> {
        const where: any = {};
        if (departamento) where.departamento = departamento;
        if (estado) where.estado = estado;
        return this.repo.find({ where });
    }

    async findOne(id: number): Promise<Materia> {
        const m = await this.repo.findOne({ where: { id_materia: id } });
        if (!m) throw new NotFoundException(`Materia #${id} no encontrada`);
        return m;
    }

    create(dto: CreateMateriaDto): Promise<Materia> {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateMateriaDto): Promise<Materia> {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.repo.delete(id);
    }

    /** Estadísticas agrupadas por departamento */
    async getMateriasPorDepto(): Promise<{ departamento: string; total: number }[]> {
        const all = await this.repo.find();
        const map: Record<string, number> = {};
        all.forEach((m) => {
            const d = m.departamento ?? 'Sin Dpto';
            map[d] = (map[d] ?? 0) + 1;
        });
        return Object.entries(map).map(([departamento, total]) => ({ departamento, total })).sort((a, b) => b.total - a.total);
    }
}
