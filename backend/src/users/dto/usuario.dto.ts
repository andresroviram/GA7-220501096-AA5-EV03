import { IsString, IsNotEmpty, IsEmail, MaxLength, IsIn, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type TipoUsuario = 'administrativo' | 'docente' | 'padre';

export class CreateUsuarioDto {
    @ApiProperty({ example: 'Carlos', description: 'Nombre del usuario' })
    @IsString() @IsNotEmpty() @MaxLength(50)
    nombre: string;

    @ApiProperty({ example: 'García', description: 'Apellido del usuario' })
    @IsString() @IsNotEmpty() @MaxLength(50)
    apellido: string;

    @ApiProperty({ example: 'carlos@escuela.edu', description: 'Correo electrónico único' })
    @IsEmail({}, { message: 'El correo no es válido' })
    correo: string;

    @ApiProperty({ example: 'Admin123!', description: 'Contraseña (mínimo 6 caracteres)' })
    @IsString() @MinLength(6)
    password: string;

    @ApiProperty({ enum: ['administrativo', 'docente', 'padre'], description: 'Rol del usuario' })
    @IsIn(['administrativo', 'docente', 'padre'])
    tipo_usuario: TipoUsuario;

    @ApiPropertyOptional({ example: '+57 300 000 0000', description: 'Teléfono de contacto' })
    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;
}

export class UpdateUsuarioDto {
    @ApiPropertyOptional({ example: 'Carlos' })
    @IsOptional() @IsString() @MaxLength(50)
    nombre?: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional() @IsString() @MaxLength(50)
    apellido?: string;

    @ApiPropertyOptional({ example: 'carlos@escuela.edu' })
    @IsOptional() @IsEmail()
    correo?: string;

    @ApiPropertyOptional({ enum: ['administrativo', 'docente', 'padre'] })
    @IsOptional() @IsIn(['administrativo', 'docente', 'padre'])
    tipo_usuario?: TipoUsuario;

    @ApiPropertyOptional({ example: '+57 300 000 0000' })
    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;

    @ApiPropertyOptional({ example: true, description: 'Estado activo del usuario' })
    @IsOptional()
    isActive?: boolean;
}
