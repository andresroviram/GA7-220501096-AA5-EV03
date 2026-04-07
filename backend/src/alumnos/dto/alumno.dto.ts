import { IsString, IsNotEmpty, IsInt, MaxLength, IsDateString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreateAlumnoDto {
    @IsString() @IsNotEmpty() @MaxLength(50)
    nombre: string;

    @IsString() @IsNotEmpty() @MaxLength(50)
    apellido: string;

    @IsDateString({}, { message: 'fecha_nacimiento debe ser YYYY-MM-DD' })
    fecha_nacimiento: string;

    @IsInt()
    id_grupo: number;
}

export class UpdateAlumnoDto {
    @IsOptional() @IsString() @MaxLength(50)
    nombre?: string;

    @IsOptional() @IsString() @MaxLength(50)
    apellido?: string;

    @IsOptional() @IsDateString()
    fecha_nacimiento?: string;

    @IsOptional() @IsInt()
    id_grupo?: number;
}
