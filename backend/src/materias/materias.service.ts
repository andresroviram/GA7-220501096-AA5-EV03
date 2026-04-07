import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './materia.entity';
import { User } from '../users/user.entity';
import { GrupoHorario } from '../horarios/grupo-horario.entity';
import { Grupo } from '../grupos/grupo.entity';
import { CreateMateriaDto, UpdateMateriaDto } from './dto/materia.dto';

@Injectable()
export class MateriasService {
    constructor(
        @InjectRepository(Materia)
        private readonly repo: Repository<Materia>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(GrupoHorario)
        private readonly bloqueRepo: Repository<GrupoHorario>,
        @InjectRepository(Grupo)
        private readonly grupoRepo: Repository<Grupo>,
    ) { }

    async findAll(departamento?: string, estado?: string): Promise<any[]> {
        const where: any = {};
        if (departamento) where.departamento = departamento;
        if (estado) where.estado = estado;
        const materias = await this.repo.find({ where });

        const docentes = await this.userRepo.find({ where: { tipo_usuario: 'docente' } });
        const docenteMap = new Map(docentes.map((u) => [u.id, `${u.nombre} ${u.apellido}`]));

        const bloques = await this.bloqueRepo.find();
        const grupos = await this.grupoRepo.find();
        const grupoMap = new Map(grupos.map((g) => [g.id_grupo, g.nombre]));

        return materias.map((m) => {
            const docenteNombre = m.id_docente ? docenteMap.get(m.id_docente) ?? '' : '';
            const gruposDeMateria = [
                ...new Set(
                    bloques
                        .filter((b) => b.materia === m.nombre)
                        .map((b) => grupoMap.get(b.id_grupo) ?? '')
                        .filter(Boolean),
                ),
            ];
            return {
                id: m.id_materia,
                nombre: m.nombre,
                departamento: m.departamento ?? '',
                creditos: m.creditos,
                docente: docenteNombre,
                grupos: gruposDeMateria,
                estado: m.estado,
            };
        });
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
