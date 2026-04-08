import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMateriaDto {
    @ApiProperty({ example: 'Matemáticas', description: 'Nombre de la materia' })
    @IsString() @IsNotEmpty() @MaxLength(100)
    nombre: string;

    @ApiPropertyOptional({ example: 2, description: 'ID del docente asignado' })
    @IsOptional() @IsInt()
    id_docente?: number;

    @ApiPropertyOptional({ example: 'Ciencias Exactas' })
    @IsOptional() @IsString() @MaxLength(50)
    departamento?: string;

    @ApiPropertyOptional({ example: 4, description: 'Créditos (1-10)' })
    @IsOptional() @IsInt() @Min(1) @Max(10)
    creditos?: number;
}

export class UpdateMateriaDto {
    @ApiPropertyOptional({ example: 'Matemáticas' })
    @IsOptional() @IsString() @MaxLength(100)
    nombre?: string;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional() @IsInt()
    id_docente?: number;

    @ApiPropertyOptional({ example: 'Ciencias Exactas' })
    @IsOptional() @IsString() @MaxLength(50)
    departamento?: string;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional() @IsInt() @Min(1) @Max(10)
    creditos?: number;

    @ApiPropertyOptional({ enum: ['Activo', 'Inactivo'] })
    @IsOptional() @IsString() @IsIn(['Activo', 'Inactivo'])
    estado?: string;
}
