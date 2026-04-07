import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn, MaxLength, Min, Max } from 'class-validator';

export class CreateMateriaDto {
    @IsString() @IsNotEmpty() @MaxLength(100)
    nombre: string;

    @IsOptional() @IsInt()
    id_docente?: number;

    @IsOptional() @IsString() @MaxLength(50)
    departamento?: string;

    @IsOptional() @IsInt() @Min(1) @Max(10)
    creditos?: number;
}

export class UpdateMateriaDto {
    @IsOptional() @IsString() @MaxLength(100)
    nombre?: string;

    @IsOptional() @IsInt()
    id_docente?: number;

    @IsOptional() @IsString() @MaxLength(50)
    departamento?: string;

    @IsOptional() @IsInt() @Min(1) @Max(10)
    creditos?: number;

    @IsOptional() @IsString() @IsIn(['Activo', 'Inactivo'])
    estado?: string;
}
