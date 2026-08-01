import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reporte } from './reporte.entity';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Alumno } from '../alumnos/alumno.entity';
import { Calificacion } from '../calificaciones/calificacion.entity';
import { Grupo } from '../grupos/grupo.entity';
import { GrupoHorario } from '../horarios/grupo-horario.entity';
import { Horario } from '../horarios/horario.entity';
import { Materia } from '../materias/materia.entity';
import { RelacionPadres } from '../relacion-padres/relacion-padres.entity';
import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Reporte, Alumno, Calificacion, Grupo, GrupoHorario, Horario, Materia, RelacionPadres, User,
    ])],
    providers: [ReportesService],
    controllers: [ReportesController],
    exports: [ReportesService],
})
export class ReportesModule { }
