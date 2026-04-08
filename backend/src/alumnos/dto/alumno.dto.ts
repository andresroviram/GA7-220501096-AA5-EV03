import { IsString, IsNotEmpty, IsInt, MaxLength, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateAlumnoDto {
    @IsString() @IsNotEmpty() @MaxLength(50)
    nombre: string;

    @IsString() @IsNotEmpty() @MaxLength(50)
    apellido: string;

    @IsDateString({}, { message: 'fecha_nacimiento debe ser YYYY-MM-DD' })
    fecha_nacimiento: string;

    @IsInt()
    id_grupo: number;

    @IsOptional() @IsString() @MaxLength(100)
    email?: string;

    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;

    @IsOptional() @IsString() @MaxLength(200)
    direccion?: string;

    @IsOptional() @IsString() @MaxLength(100)
    tutor?: string;

    @IsOptional() @IsString() @MaxLength(20)
    tutor_telefono?: string;

    @IsOptional() @IsNumber()
    promedio?: number;

    @IsOptional() @IsString() @MaxLength(20)
    estado?: string;

    /** ID del usuario padre/acudiente para crear la relación en relacion_padres */
    @IsOptional() @IsInt()
    id_padre?: number;
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

    /** Nombre del grupo (ej: "3A"). El servicio resuelve el id_grupo correspondiente. */
    @IsOptional() @IsString() @MaxLength(20)
    grupo?: string;

    @IsOptional() @IsString() @MaxLength(100)
    email?: string;

    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;

    @IsOptional() @IsString() @MaxLength(200)
    direccion?: string;

    @IsOptional() @IsString() @MaxLength(100)
    tutor?: string;

    @IsOptional() @IsString() @MaxLength(20)
    tutor_telefono?: string;

    @IsOptional() @IsNumber()
    promedio?: number;

    @IsOptional() @IsString() @MaxLength(20)
    estado?: string;

    /** ID del usuario padre/acudiente. null para eliminar la relación. */
    @IsOptional() @IsInt()
    id_padre?: number;
}
