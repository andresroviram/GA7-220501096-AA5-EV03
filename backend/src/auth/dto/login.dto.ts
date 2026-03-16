import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

/**
 * LoginDto — Data Transfer Object para la petición POST /auth/login.
 *
 * class-validator verifica automáticamente estas reglas gracias al
 * ValidationPipe global configurado en main.ts.
 */
export class LoginDto {
    /** Nombre de usuario — requerido, solo texto */
    @IsString({ message: 'El usuario debe ser texto' })
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    @MaxLength(50, { message: 'El usuario no puede superar 50 caracteres' })
    username: string;

    /**
     * Contraseña — requerida, mínimo 6 caracteres.
     * No se valida complejidad aquí; eso corresponde al módulo de registro
     * (fuera del alcance de esta evidencia).
     */
    @IsString({ message: 'La contraseña debe ser texto' })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}
