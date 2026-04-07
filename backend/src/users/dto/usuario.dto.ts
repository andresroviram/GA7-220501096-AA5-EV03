import { IsString, IsNotEmpty, IsEmail, MaxLength, IsIn, IsOptional, MinLength } from 'class-validator';

export type TipoUsuario = 'administrativo' | 'docente' | 'padre';

export class CreateUsuarioDto {
    @IsString() @IsNotEmpty() @MaxLength(50)
    nombre: string;

    @IsString() @IsNotEmpty() @MaxLength(50)
    apellido: string;

    @IsEmail({}, { message: 'El correo no es válido' })
    correo: string;

    @IsString() @MinLength(6)
    password: string;

    @IsIn(['administrativo', 'docente', 'padre'])
    tipo_usuario: TipoUsuario;

    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;
}

export class UpdateUsuarioDto {
    @IsOptional() @IsString() @MaxLength(50)
    nombre?: string;

    @IsOptional() @IsString() @MaxLength(50)
    apellido?: string;

    @IsOptional() @IsEmail()
    correo?: string;

    @IsOptional() @IsIn(['administrativo', 'docente', 'padre'])
    tipo_usuario?: TipoUsuario;

    @IsOptional() @IsString() @MaxLength(20)
    telefono?: string;

    @IsOptional()
    isActive?: boolean;
}
