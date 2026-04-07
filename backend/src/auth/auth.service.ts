import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { AutenticacionLog } from '../auth-log/autenticacion-log.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../users/dto/usuario.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/user.entity';

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
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
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

    /**
     * Genera un código de reset de 6 caracteres alfanuméricos, lo guarda en la
     * entidad del usuario con una ventana de 15 minutos y lo devuelve en la
     * respuesta.
     *
     * NOTA DE SEGURIDAD: En producción el token NO debe devolverse en la
     * respuesta HTTP — debe enviarse únicamente por correo electrónico.
     * Aquí se expone para facilitar el desarrollo sin servidor de correo.
     */
    async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
        const user = await this.usersService.findByCorreo(dto.correo);

        // Tip de seguridad: respuesta genérica para no revelar si el correo existe
        const genericOk = { message: 'Si el correo está registrado, recibirás el código de recuperación.' };

        if (!user) return genericOk;

        const token = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 caracteres hex
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await this.userRepo.update(user.id, {
            resetToken: token,
            resetTokenExpiry: expiry,
        });

        // En producción: aquí se envía el correo con el token y NO se devuelve
        return { ...genericOk, resetToken: token };
    }

    /**
     * Valida el token de reset y actualiza la contraseña del usuario.
     */
    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        const user = await this.userRepo.findOne({ where: { resetToken: dto.token } });

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new BadRequestException('El código es inválido o ha expirado.');
        }

        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.update(user.id, {
            password: hashed,
            resetToken: null,
            resetTokenExpiry: null,
        });

        return { message: 'Contraseña actualizada correctamente.' };
    }
}
