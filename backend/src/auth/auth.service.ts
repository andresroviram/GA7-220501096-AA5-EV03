import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AutenticacionLog } from '../auth-log/autenticacion-log.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../users/dto/usuario.dto';

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
        @InjectRepository(AutenticacionLog)
        private readonly logRepo: Repository<AutenticacionLog>,
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
    async login(loginDto: LoginDto) {
        const { correo, password } = loginDto;
        const user = await this.usersService.findByCorreo(correo);
        const passwordValid = user ? await bcrypt.compare(password, user.password) : false;

        // Registrar intento en el log
        if (user) {
            await this.logRepo.save(
                this.logRepo.create({
                    id_usuario: user.id,
                    resultado: passwordValid ? 'exitoso' : 'fallido',
                }),
            );
        }

        if (!user || !passwordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: user.id, correo: user.correo, tipo: user.tipo_usuario };
        return {
            access_token: this.jwtService.sign(payload),
            correo: user.correo,
            nombre: `${user.nombre} ${user.apellido}`,
            tipo_usuario: user.tipo_usuario,
            telefono: user.telefono ?? null,
        };
    }

    async register(dto: CreateUsuarioDto) {
        return this.usersService.createUser(dto);
    }
}
