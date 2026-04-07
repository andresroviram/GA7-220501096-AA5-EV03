import { IsInt, IsNotEmpty, IsNumber, Min, Max, IsDateString, IsOptional } from 'class-validator';

export class CreateCalificacionDto {
    @IsInt() @IsNotEmpty()
    id_alumno: number;

    @IsInt() @IsNotEmpty()
    id_materia: number;

    @IsNumber() @Min(0) @Max(10)
    valor: number;

    @IsDateString({}, { message: 'fecha_registro debe ser YYYY-MM-DD' })
    fecha_registro: string;
}

export class UpdateCalificacionDto {
    @IsOptional() @IsNumber() @Min(0) @Max(10)
    valor?: number;

    @IsOptional() @IsDateString()
    fecha_registro?: string;
}
