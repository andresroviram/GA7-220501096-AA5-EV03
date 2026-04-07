import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './horario.entity';
import { GrupoHorario } from './grupo-horario.entity';
import { Grupo } from '../grupos/grupo.entity';
import { CreateHorarioDto, UpdateHorarioDto, CreateGrupoHorarioDto, UpdateGrupoHorarioDto } from './dto/horario.dto';

@Injectable()
export class HorariosService {
    constructor(
        @InjectRepository(Horario)
        private readonly horarioRepo: Repository<Horario>,
        @InjectRepository(GrupoHorario)
        private readonly grupoHorarioRepo: Repository<GrupoHorario>,
        @InjectRepository(Grupo)
        private readonly grupoRepo: Repository<Grupo>,
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

        const horarios = await this.horarioRepo.find();
        const horarioMap = new Map(horarios.map((h) => [h.id_horario, h]));

        const grupos = await this.grupoRepo.find();
        const grupoMap = new Map(grupos.map((g) => [g.id_grupo, g.nombre]));

        // Devuelve la forma plana que coincide con mockGrupos.horarios
        return bloques.map((b) => {
            const h = horarioMap.get(b.id_horario);
            return {
                id: b.id_grupo_horario,
                grupo: grupoMap.get(b.id_grupo) ?? `Grupo #${b.id_grupo}`,
                materia: b.materia ?? '',
                docente: b.docente ?? '',
                dia: h?.dia_semana ?? '',
                horaInicio: h?.hora_inicio ?? '',
                horaFin: h?.hora_fin ?? '',
                aula: b.aula ?? '',
                estado: b.estado,
            };
        });
    }

    async findOneBloque(id: number): Promise<GrupoHorario> {
        const b = await this.grupoHorarioRepo.findOne({ where: { id_grupo_horario: id } });
        if (!b) throw new NotFoundException(`Bloque #${id} no encontrado`);
        return b;
    }

    async createBloque(dto: CreateGrupoHorarioDto): Promise<GrupoHorario> {
        const bloque = await this.grupoHorarioRepo.save(this.grupoHorarioRepo.create(dto));
        await this.recalcularConflictos();
        return this.findOneBloque(bloque.id_grupo_horario);
    }

    async updateBloque(id: number, dto: UpdateGrupoHorarioDto): Promise<GrupoHorario> {
        await this.findOneBloque(id);
        await this.grupoHorarioRepo.update(id, dto);
        await this.recalcularConflictos();
        return this.findOneBloque(id);
    }

    async removeBloque(id: number): Promise<void> {
        await this.findOneBloque(id);
        await this.grupoHorarioRepo.delete(id);
        await this.recalcularConflictos();
    }

    /** Helper: true si los intervalos [s1,e1) y [s2,e2) se solapan (strings HH:MM) */
    private overlaps(s1: string, e1: string, s2: string, e2: string): boolean {
        return s1 < e2 && s2 < e1;
    }

    /**
     * Recalcula el estado de conflicto para todos los bloques no-Inactivos.
     * Reglas: mismo día + horas solapadas + (misma aula O mismo docente).
     * Los bloques Inactivos se omiten y no se modifican.
     */
    async recalcularConflictos(): Promise<void> {
        const bloques = await this.grupoHorarioRepo.find();
        const horarios = await this.horarioRepo.find();
        const horarioMap = new Map(horarios.map((h) => [h.id_horario, h]));

        const activos = bloques.filter((b) => b.estado !== 'Inactivo');
        const conflictIds = new Set<number>();

        for (let i = 0; i < activos.length; i++) {
            for (let j = i + 1; j < activos.length; j++) {
                const a = activos[i];
                const b = activos[j];
                const ha = horarioMap.get(a.id_horario);
                const hb = horarioMap.get(b.id_horario);
                if (!ha || !hb || ha.dia_semana !== hb.dia_semana) continue;
                if (!this.overlaps(ha.hora_inicio, ha.hora_fin, hb.hora_inicio, hb.hora_fin)) continue;
                if (a.aula && b.aula && a.aula === b.aula) {
                    conflictIds.add(a.id_grupo_horario);
                    conflictIds.add(b.id_grupo_horario);
                }
                if (a.docente && b.docente && a.docente === b.docente) {
                    conflictIds.add(a.id_grupo_horario);
                    conflictIds.add(b.id_grupo_horario);
                }
            }
        }

        await Promise.all(
            activos.map((b) => {
                const nuevoEstado = conflictIds.has(b.id_grupo_horario) ? 'Conflicto' : 'Activo';
                if (b.estado !== nuevoEstado) {
                    return this.grupoHorarioRepo.update(b.id_grupo_horario, { estado: nuevoEstado });
                }
                return Promise.resolve();
            }),
        );
    }

    /** Recalcula conflictos y devuelve la lista actualizada de bloques. */
    async recalcular(): Promise<any[]> {
        await this.recalcularConflictos();
        return this.findAllBloques();
    }

    /** Estadísticas para el widget del frontend */
    async getEstadisticas() {
        const bloques = await this.grupoHorarioRepo.find();
        const totalGrupos = [...new Set(bloques.map((b) => b.id_grupo))].length;
        const aulasEnUso = [...new Set(bloques.filter((b) => b.aula).map((b) => b.aula!))].length;
        const conflictos = bloques.filter((b) => b.estado === 'Conflicto').length;

        return {
            totalGrupos,
            totalHorarios: bloques.length,
            conflictos,
            aulasEnUso,
        };
    }
}
