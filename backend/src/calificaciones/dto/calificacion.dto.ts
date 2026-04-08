import { IsInt, IsNotEmpty, IsNumber, Min, Max, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalificacionDto {
    @ApiProperty({ example: 5, description: 'ID del alumno' })
    @IsInt() @IsNotEmpty()
    id_alumno: number;

    @ApiProperty({ example: 1, description: 'ID de la materia' })
    @IsInt() @IsNotEmpty()
    id_materia: number;

    @ApiProperty({ example: 8.5, description: 'Nota (0-10)' })
    @IsNumber() @Min(0) @Max(10)
    valor: number;

    @ApiProperty({ example: '2026-04-08', description: 'Fecha de registro (YYYY-MM-DD)' })
    @IsDateString({}, { message: 'fecha_registro debe ser YYYY-MM-DD' })
    fecha_registro: string;
}

export class UpdateCalificacionDto {
    @ApiPropertyOptional({ example: 9.0, description: 'Nueva nota (0-10)' })
    @IsOptional() @IsNumber() @Min(0) @Max(10)
    valor?: number;

    @ApiPropertyOptional({ example: '2026-04-08' })
    @IsOptional() @IsDateString()
    fecha_registro?: string;
}
