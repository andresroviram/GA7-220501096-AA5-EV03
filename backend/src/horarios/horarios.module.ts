import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './horario.entity';
import { GrupoHorario } from './grupo-horario.entity';
import { Grupo } from '../grupos/grupo.entity';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Horario, GrupoHorario, Grupo])],
    providers: [HorariosService],
    controllers: [HorariosController],
    exports: [HorariosService],
})
export class HorariosModule { }
