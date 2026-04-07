import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './horario.entity';
import { GrupoHorario } from './grupo-horario.entity';
import { CreateHorarioDto, UpdateHorarioDto, CreateGrupoHorarioDto, UpdateGrupoHorarioDto } from './dto/horario.dto';

@Injectable()
export class HorariosService {
    constructor(
        @InjectRepository(Horario)
        private readonly horarioRepo: Repository<Horario>,
        @InjectRepository(GrupoHorario)
        private readonly grupoHorarioRepo: Repository<GrupoHorario>,
    ) { }

    /* ── Horarios base ── */
    findAllHorarios(): Promise<Horario[]> { return this.horarioRepo.find(); }

    async findOneHorario(id: number): Promise<Horario> {
        const h = await this.horarioRepo.findOne({ where: { id_horario: id } });
        if (!h) throw new NotFoundException(`Horario #${id} no encontrado`);
        return h;
    }

    createHorario(dto: CreateHorarioDto): Promise<Horario> {
        return this.horarioRepo.save(this.horarioRepo.create(dto));
    }

    async updateHorario(id: number, dto: UpdateHorarioDto): Promise<Horario> {
        await this.findOneHorario(id);
        await this.horarioRepo.update(id, dto);
        return this.findOneHorario(id);
    }

    async removeHorario(id: number): Promise<void> {
        await this.findOneHorario(id);
        await this.horarioRepo.delete(id);
    }

    /* ── Grupo-Horario (bloques) ── */
    async findAllBloques(idGrupo?: number): Promise<any[]> {
        const bloques = await this.grupoHorarioRepo.find(
            idGrupo ? { where: { id_grupo: idGrupo } } : {},
        );

        // Enriquecer con datos del horario base
        const horarios = await this.horarioRepo.find();
        const horarioMap = new Map(horarios.map((h) => [h.id_horario, h]));

        return bloques.map((b) => ({
            ...b,
            horario: horarioMap.get(b.id_horario) ?? null,
        }));
    }

    async findOneBloque(id: number): Promise<GrupoHorario> {
        const b = await this.grupoHorarioRepo.findOne({ where: { id_grupo_horario: id } });
        if (!b) throw new NotFoundException(`Bloque #${id} no encontrado`);
        return b;
    }

    createBloque(dto: CreateGrupoHorarioDto): Promise<GrupoHorario> {
        return this.grupoHorarioRepo.save(this.grupoHorarioRepo.create(dto));
    }

    async updateBloque(id: number, dto: UpdateGrupoHorarioDto): Promise<GrupoHorario> {
        await this.findOneBloque(id);
        await this.grupoHorarioRepo.update(id, dto);
        return this.findOneBloque(id);
    }

    async removeBloque(id: number): Promise<void> {
        await this.findOneBloque(id);
        await this.grupoHorarioRepo.delete(id);
    }

    /** Estadísticas para el widget del frontend */
    async getEstadisticas() {
        const bloques = await this.grupoHorarioRepo.find();
        const grupos = [...new Set(bloques.map((b) => b.id_grupo))];
        const aulas = [...new Set(bloques.filter((b) => b.aula).map((b) => b.aula!))];
        const conflictos = bloques.filter((b) => b.estado === 'Conflicto').length;

        const porDia: Record<string, number> = {};
        const horarios = await this.horarioRepo.find();
        const horarioMap = new Map(horarios.map((h) => [h.id_horario, h]));
        bloques.forEach((b) => {
            const dia = horarioMap.get(b.id_horario)?.dia_semana ?? 'Desconocido';
            porDia[dia] = (porDia[dia] ?? 0) + 1;
        });

        return {
            total: bloques.length,
            grupos: grupos.length,
            aulas: aulas.length,
            conflictos,
            porDia,
        };
    }
}
