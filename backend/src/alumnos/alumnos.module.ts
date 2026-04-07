import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './alumno.entity';
import { Grupo } from '../grupos/grupo.entity';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Alumno, Grupo])],
    providers: [AlumnosService],
    controllers: [AlumnosController],
    exports: [AlumnosService],
})
export class AlumnosModule { }
