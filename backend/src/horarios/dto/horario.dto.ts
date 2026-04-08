import { IsString, IsNotEmpty, IsOptional, IsIn, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiaSemana } from '../horario.entity';

const DIAS: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateHorarioDto {
    @ApiProperty({ enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], example: 'Lunes' })
    @IsString() @IsIn(DIAS)
    dia_semana: DiaSemana;

    @ApiProperty({ example: '07:00', description: 'Hora de inicio (HH:MM)' })
    @IsString() @Matches(timeRegex, { message: 'hora_inicio debe ser HH:MM' })
    hora_inicio: string;

    @ApiProperty({ example: '09:00', description: 'Hora de fin (HH:MM)' })
    @IsString() @Matches(timeRegex, { message: 'hora_fin debe ser HH:MM' })
    hora_fin: string;
}

export class UpdateHorarioDto {
    @ApiPropertyOptional({ enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] })
    @IsOptional() @IsString() @IsIn(DIAS)
    dia_semana?: DiaSemana;

    @ApiPropertyOptional({ example: '07:00' })
    @IsOptional() @IsString() @Matches(timeRegex)
    hora_inicio?: string;

    @ApiPropertyOptional({ example: '09:00' })
    @IsOptional() @IsString() @Matches(timeRegex)
    hora_fin?: string;
}

export class CreateGrupoHorarioDto {
    @ApiProperty({ example: 1, description: 'ID del grupo' })
    @IsNotEmpty()
    id_grupo: number;

    @ApiProperty({ example: 1, description: 'ID del horario' })
    @IsNotEmpty()
    id_horario: number;

    @ApiPropertyOptional({ example: 'Matemáticas' })
    @IsOptional() @IsString() @MaxLength(100)
    materia?: string;

    @ApiPropertyOptional({ example: 'Carlos García' })
    @IsOptional() @IsString() @MaxLength(100)
    docente?: string;

    @ApiPropertyOptional({ example: 'Aula 101' })
    @IsOptional() @IsString() @MaxLength(20)
    aula?: string;
}

export class UpdateGrupoHorarioDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    id_grupo?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    id_horario?: number;

    @ApiPropertyOptional({ example: 'Matemáticas' })
    @IsOptional() @IsString() @MaxLength(100)
    materia?: string;

    @ApiPropertyOptional({ example: 'Carlos García' })
    @IsOptional() @IsString() @MaxLength(100)
    docente?: string;

    @ApiPropertyOptional({ example: 'Aula 101' })
    @IsOptional() @IsString() @MaxLength(20)
    aula?: string;

    @ApiPropertyOptional({ enum: ['Activo', 'Inactivo', 'Conflicto'] })
    @IsOptional() @IsString() @IsIn(['Activo', 'Inactivo', 'Conflicto'])
    estado?: string;
}
