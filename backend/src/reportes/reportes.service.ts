import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from './reporte.entity';

@Injectable()
export class ReportesService {
    constructor(
        @InjectRepository(Reporte)
        private readonly repo: Repository<Reporte>,
    ) { }

    findAll(): Promise<Reporte[]> {
        return this.repo.find({ order: { fecha: 'DESC' } });
    }
}
