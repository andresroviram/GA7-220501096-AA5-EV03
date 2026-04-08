import { IsString, IsNotEmpty, IsInt, MaxLength, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlumnoDto {
    @ApiProperty({ example: 'Juan', description: 'Nombre del alumno' })
    @IsString() @IsNotEmpty() @MaxLength(50)
    nombre: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del alumno' })
    @IsString() @IsNotEmpty() @MaxLength(50)
    apellido: string;

    @ApiProperty({ example: '2010-05-15', description: 'Fecha de nacimiento (YYYY-MM-DD)' })
    @IsDateString({}, { message: 'fecha_nacimiento debe ser YYYY-MM-DD' })
    fecha_nacimiento: string;

    @ApiProperty({ example: 1, description: 'ID del grupo al que pertenece el alumno' })
    @IsInt()
    id_grupo: number;

    @ApiPropertyOptional({ example: 'juan@email.com' })
    @IsOptional() @IsString() @MaxLength(100)
    email?: string;

    @ApiPropertyOptional({ example: '+57 300 000 0000' })
    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;

    @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
    @IsOptional() @IsString() @MaxLength(200)
    direccion?: string;

    @ApiPropertyOptional({ example: 'María García', description: 'Nombre del tutor' })
    @IsOptional() @IsString() @MaxLength(100)
    tutor?: string;

    @ApiPropertyOptional({ example: '+57 300 111 2222' })
    @IsOptional() @IsString() @MaxLength(20)
    tutor_telefono?: string;

    @ApiPropertyOptional({ example: 8.5, description: 'Promedio académico' })
    @IsOptional() @IsNumber()
    promedio?: number;

    @ApiPropertyOptional({ example: 'Activo' })
    @IsOptional() @IsString() @MaxLength(20)
    estado?: string;

    /** ID del usuario padre/acudiente para crear la relación en relacion_padres */
    @ApiPropertyOptional({ example: 3, description: 'ID del usuario con tipo_usuario=padre' })
    @IsOptional() @IsInt()
    id_padre?: number;
}

export class UpdateAlumnoDto {
    @ApiPropertyOptional({ example: 'Juan' })
    @IsOptional() @IsString() @MaxLength(50)
    nombre?: string;

    @ApiPropertyOptional({ example: 'Pérez' })
    @IsOptional() @IsString() @MaxLength(50)
    apellido?: string;

    @ApiPropertyOptional({ example: '2010-05-15' })
    @IsOptional() @IsDateString()
    fecha_nacimiento?: string;

    @ApiPropertyOptional({ example: 1, description: 'ID del grupo' })
    @IsOptional() @IsInt()
    id_grupo?: number;

    /** Nombre del grupo (ej: "3A"). El servicio resuelve el id_grupo correspondiente. */
    @ApiPropertyOptional({ example: '10A', description: 'Nombre del grupo (alternativo a id_grupo)' })
    @IsOptional() @IsString() @MaxLength(20)
    grupo?: string;

    @ApiPropertyOptional({ example: 'juan@email.com' })
    @IsOptional() @IsString() @MaxLength(100)
    email?: string;

    @ApiPropertyOptional({ example: '+57 300 000 0000' })
    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;

    @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
    @IsOptional() @IsString() @MaxLength(200)
    direccion?: string;

    @ApiPropertyOptional({ example: 'María García' })
    @IsOptional() @IsString() @MaxLength(100)
    tutor?: string;

    @ApiPropertyOptional({ example: '+57 300 111 2222' })
    @IsOptional() @IsString() @MaxLength(20)
    tutor_telefono?: string;

    @ApiPropertyOptional({ example: 8.5 })
    @IsOptional() @IsNumber()
    promedio?: number;

    @ApiPropertyOptional({ example: 'Activo' })
    @IsOptional() @IsString() @MaxLength(20)
    estado?: string;

    /** ID del usuario padre/acudiente. null para eliminar la relación. */
    @ApiPropertyOptional({ example: 3, description: 'ID del usuario padre. null para eliminar la relación' })
    @IsOptional() @IsInt()
    id_padre?: number;
}
