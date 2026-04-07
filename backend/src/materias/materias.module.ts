import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './materia.entity';
import { User } from '../users/user.entity';
import { GrupoHorario } from '../horarios/grupo-horario.entity';
import { Grupo } from '../grupos/grupo.entity';
import { MateriasService } from './materias.service';
import { MateriasController } from './materias.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Materia, User, GrupoHorario, Grupo])],
    providers: [MateriasService],
    controllers: [MateriasController],
    exports: [MateriasService],
})
export class MateriasModule { }
