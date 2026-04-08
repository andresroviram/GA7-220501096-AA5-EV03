import { IsString, IsNumber, IsEmail, IsOptional, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConfigParamsDto {
    @ApiPropertyOptional({ example: 'Colegio San José', description: 'Nombre de la institución' })
    @IsOptional() @IsString() @MaxLength(200)
    institucion?: string;

    @ApiPropertyOptional({ example: '2026-I', description: 'Ciclo académico actual' })
    @IsOptional() @IsString() @MaxLength(50)
    cicloActual?: string;

    @ApiPropertyOptional({ example: 40, description: 'Máximo de estudiantes por grupo (1-200)' })
    @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(200)
    maxEstPorGrupo?: number;

    @ApiPropertyOptional({ example: 'contacto@escuela.edu' })
    @IsOptional() @IsEmail()
    correoContacto?: string;

    @ApiPropertyOptional({ example: 0, description: 'Nota mínima de la escala' })
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
    escalaMin?: number;

    @ApiPropertyOptional({ example: 10, description: 'Nota máxima de la escala' })
    @IsOptional() @Type(() => Number) @IsNumber() @Max(100)
    escalaMax?: number;

    @ApiPropertyOptional({ example: 6, description: 'Nota mínima para aprobar' })
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
    notaAprobatoria?: number;
}
