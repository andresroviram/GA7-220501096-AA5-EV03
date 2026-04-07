import { IsString, IsNotEmpty, IsOptional, IsIn, Matches, MaxLength } from 'class-validator';
import { DiaSemana } from '../horario.entity';

const DIAS: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateHorarioDto {
    @IsString() @IsIn(DIAS)
    dia_semana: DiaSemana;

    @IsString() @Matches(timeRegex, { message: 'hora_inicio debe ser HH:MM' })
    hora_inicio: string;

    @IsString() @Matches(timeRegex, { message: 'hora_fin debe ser HH:MM' })
    hora_fin: string;
}

export class UpdateHorarioDto {
    @IsOptional() @IsString() @IsIn(DIAS)
    dia_semana?: DiaSemana;

    @IsOptional() @IsString() @Matches(timeRegex)
    hora_inicio?: string;

    @IsOptional() @IsString() @Matches(timeRegex)
    hora_fin?: string;
}

export class CreateGrupoHorarioDto {
    @IsNotEmpty()
    id_grupo: number;

    @IsNotEmpty()
    id_horario: number;

    @IsOptional() @IsString() @MaxLength(100)
    materia?: string;

    @IsOptional() @IsString() @MaxLength(100)
    docente?: string;

    @IsOptional() @IsString() @MaxLength(20)
    aula?: string;
}

export class UpdateGrupoHorarioDto {
    @IsOptional()
    id_grupo?: number;

    @IsOptional()
    id_horario?: number;

    @IsOptional() @IsString() @MaxLength(100)
    materia?: string;

    @IsOptional() @IsString() @MaxLength(100)
    docente?: string;

    @IsOptional() @IsString() @MaxLength(20)
    aula?: string;

    @IsOptional() @IsString() @IsIn(['Activo', 'Inactivo', 'Conflicto'])
    estado?: string;
}
