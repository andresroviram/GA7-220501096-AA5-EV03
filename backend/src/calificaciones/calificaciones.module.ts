import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './calificacion.entity';
import { Alumno } from '../alumnos/alumno.entity';
import { Materia } from '../materias/materia.entity';
import { Grupo } from '../grupos/grupo.entity';
import { CalificacionesService } from './calificaciones.service';
import { CalificacionesController } from './calificaciones.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Calificacion, Alumno, Materia, Grupo])],
    providers: [CalificacionesService],
    controllers: [CalificacionesController],
    exports: [CalificacionesService],
})
export class CalificacionesModule { }
