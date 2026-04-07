import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './grupo.entity';
import { CreateGrupoDto, UpdateGrupoDto } from './dto/grupo.dto';

@Injectable()
export class GruposService {
    constructor(
        @InjectRepository(Grupo)
        private readonly repo: Repository<Grupo>,
    ) { }

    findAll(): Promise<Grupo[]> {
        return this.repo.find();
    }

    async findOne(id: number): Promise<Grupo> {
        const grupo = await this.repo.findOne({ where: { id_grupo: id } });
        if (!grupo) throw new NotFoundException(`Grupo #${id} no encontrado`);
        return grupo;
    }

    create(dto: CreateGrupoDto): Promise<Grupo> {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateGrupoDto): Promise<Grupo> {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.repo.delete(id);
    }
}
