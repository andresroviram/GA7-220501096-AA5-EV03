import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from './alumno.entity';
import { Grupo } from '../grupos/grupo.entity';
import { CreateAlumnoDto, UpdateAlumnoDto } from './dto/alumno.dto';

@Injectable()
export class AlumnosService {
    constructor(
        @InjectRepository(Alumno)
        private readonly repo: Repository<Alumno>,
        @InjectRepository(Grupo)
        private readonly grupoRepo: Repository<Grupo>,
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

    create(dto: CreateAlumnoDto): Promise<Alumno> {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateAlumnoDto): Promise<Alumno> {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.repo.delete(id);
    }
}
