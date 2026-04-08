import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Alumno } from './alumno.entity';
import { Grupo } from '../grupos/grupo.entity';
import { RelacionPadres } from '../relacion-padres/relacion-padres.entity';
import { CreateAlumnoDto, UpdateAlumnoDto } from './dto/alumno.dto';

@Injectable()
export class AlumnosService {
    constructor(
        @InjectRepository(Alumno)
        private readonly repo: Repository<Alumno>,
        @InjectRepository(Grupo)
        private readonly grupoRepo: Repository<Grupo>,
        @InjectRepository(RelacionPadres)
        private readonly relacionRepo: Repository<RelacionPadres>,
    ) { }

    private calcularEdad(fechaNacimiento: string): number {
        const hoy = new Date();
        const nac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nac.getFullYear();
        const m = hoy.getMonth() - nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    }

    private async toDisplay(alumnos: Alumno[]): Promise<any[]> {
        const grupos = await this.grupoRepo.find();
        const grupoMap = new Map(grupos.map((g) => [g.id_grupo, g.nombre]));

        const ids = alumnos.map((a) => a.id_alumno);
        const relaciones = ids.length > 0
            ? await this.relacionRepo.find({ where: { id_alumno: In(ids) } })
            : [];
        const padreMap = new Map(relaciones.map((r) => [r.id_alumno, r.id_padre]));

        return alumnos.map((a) => ({
            id: a.id_alumno,
            nombre: `${a.nombre} ${a.apellido}`,
            email: a.email ?? '',
            grupo: grupoMap.get(a.id_grupo) ?? '',
            edad: this.calcularEdad(a.fecha_nacimiento),
            telefono: a.telefono ?? '',
            direccion: a.direccion ?? '',
            tutor: a.tutor ?? '',
            tutorTelefono: a.tutor_telefono ?? '',
            tutorId: padreMap.get(a.id_alumno) ?? null,
            promedio: a.promedio ?? 0,
            estado: a.estado ?? 'Activo',
        }));
    }

    async findAll(idGrupo?: number): Promise<any[]> {
        const rows = idGrupo
            ? await this.repo.find({ where: { id_grupo: idGrupo } })
            : await this.repo.find();
        return this.toDisplay(rows);
    }

    async findOne(id: number): Promise<Alumno> {
        const alumno = await this.repo.findOne({ where: { id_alumno: id } });
        if (!alumno) throw new NotFoundException(`Alumno #${id} no encontrado`);
        return alumno;
    }

    async create(dto: CreateAlumnoDto): Promise<any> {
        const { id_padre, ...alumnoFields } = dto;
        const alumno = await this.repo.save(this.repo.create(alumnoFields));
        if (id_padre) {
            await this.relacionRepo.save({ id_padre, id_alumno: alumno.id_alumno, parentesco: 'padre' });
        }
        return (await this.toDisplay([alumno]))[0];
    }

    async update(id: number, dto: UpdateAlumnoDto): Promise<any> {
        await this.findOne(id);

        const { id_padre, grupo, ...rest } = dto;

        // Resolver nombre de grupo a id_grupo si se envió grupo como string
        const alumnoFields: Partial<Alumno> = { ...rest };
        if (grupo) {
            const grupoEntity = await this.grupoRepo.findOne({ where: { nombre: grupo } });
            if (grupoEntity) alumnoFields.id_grupo = grupoEntity.id_grupo;
        }

        if (Object.keys(alumnoFields).length > 0) {
            await this.repo.update(id, alumnoFields);
        }

        // Gestionar relacion_padres si se envió id_padre
        if (id_padre !== undefined) {
            await this.relacionRepo.delete({ id_alumno: id });
            if (id_padre !== null) {
                await this.relacionRepo.save({ id_padre, id_alumno: id, parentesco: 'padre' });
            }
        }

        const updated = await this.findOne(id);
        return (await this.toDisplay([updated]))[0];
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.relacionRepo.delete({ id_alumno: id });
        await this.repo.delete(id);
    }
}
