import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

/**
 * AuthService — lógica de negocio del módulo de autenticación.
 *
 * Responsabilidad única: validar credenciales y, si son correctas,
 * emitir un token JWT firmado.
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Valida las credenciales enviadas por el usuario y genera un token JWT.
     *
     * Pasos:
     *  1. Buscar el usuario en la base de datos por nombre de usuario.
     *  2. Comparar la contraseña recibida con el hash almacenado usando bcrypt.
     *  3. Si todo es correcto, construir y firmar el JWT.
     *  4. Si algo falla, lanzar UnauthorizedException con mensaje genérico
     *     (no revelar si el usuario existe o no — previene enumeración de usuarios).
     *
     * @param loginDto - Datos validados por el DTO (username + password)
     * @returns Objeto con el token JWT y el nombre de usuario
     * @throws UnauthorizedException si las credenciales son incorrectas
     */
    async login(loginDto: LoginDto): Promise<{ access_token: string; username: string }> {
        const { username, password } = loginDto;

        // Paso 1: Buscar usuario activo en la base de datos
        const user = await this.usersService.findByUsername(username);

        // Paso 2: Verificar existencia y comparar contraseña con el hash almacenado.
        // bcrypt.compare es resistente a timing attacks gracias a su implementación constante.
        const passwordValid = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !passwordValid) {
            // Mensaje genérico para no revelar cuál campo es incorrecto
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Paso 3: Crear el payload del token.
        // "sub" es el identificador estándar JWT (sujeto).
        const payload = { username: user.username, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
            username: user.username,
        };
    }
}
