import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from './alumno.entity';
import { CreateAlumnoDto, UpdateAlumnoDto } from './dto/alumno.dto';

@Injectable()
export class AlumnosService {
    constructor(
        @InjectRepository(Alumno)
        private readonly repo: Repository<Alumno>,
    ) { }

    findAll(idGrupo?: number): Promise<Alumno[]> {
        if (idGrupo) return this.repo.find({ where: { id_grupo: idGrupo } });
        return this.repo.find();
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
