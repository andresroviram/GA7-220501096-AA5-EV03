import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/user.entity';
import { Alumno } from '../alumnos/alumno.entity';
import { Grupo } from '../grupos/grupo.entity';
import { Horario } from '../horarios/horario.entity';
import { GrupoHorario } from '../horarios/grupo-horario.entity';
import { Materia } from '../materias/materia.entity';
import { Calificacion } from '../calificaciones/calificacion.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Alumno, Grupo, Horario, GrupoHorario, Materia, Calificacion]),
    ],
    providers: [SeedService],
})
export class SeedModule { }
