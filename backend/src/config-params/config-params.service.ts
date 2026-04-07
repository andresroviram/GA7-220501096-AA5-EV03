import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigParams } from './config-params.entity';
import { UpdateConfigParamsDto } from './dto/config-params.dto';

const DEFAULTS: Partial<ConfigParams> = {
    id: 1,
    institucion: 'Institución Educativa',
    cicloActual: '2025-I',
    maxEstPorGrupo: 35,
    correoContacto: '',
    escalaMin: 0,
    escalaMax: 10,
    notaAprobatoria: 6,
};

@Injectable()
export class ConfigParamsService {
    constructor(
        @InjectRepository(ConfigParams)
        private readonly repo: Repository<ConfigParams>,
    ) { }

    /** Retorna los parámetros globales, creando la fila por defecto si no existe. */
    async get(): Promise<ConfigParams> {
        let row = await this.repo.findOne({ where: { id: 1 } });
        if (!row) {
            row = this.repo.create(DEFAULTS);
            row = await this.repo.save(row);
        }
        return row;
    }

    /** Actualiza los parámetros globales (upsert sobre id=1). */
    async update(dto: UpdateConfigParamsDto): Promise<ConfigParams> {
        await this.repo.upsert({ id: 1, ...dto }, ['id']);
        return this.get();
    }
}
