import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

/**
 * JwtStrategy — estrategia de Passport para validar tokens JWT en rutas protegidas.
 *
 * Lee el token del header "Authorization: Bearer <token>",
 * lo verifica con el secreto y comprueba que el usuario siga activo.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            // Extrae el token del header Authorization como Bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Si el token ha expirado, Passport lo rechaza antes de llegar a validate()
            ignoreExpiration: false,
            // Secreto con el que se firmó el token (debe coincidir con AuthModule)
            secretOrKey: process.env.JWT_SECRET ?? 'secreto_jwt_cambiar_en_produccion',
        });
    }

    /**
     * Se ejecuta después de que Passport verifica la firma del token.
     * Devuelve el objeto que quedará disponible como req.user en los controladores.
     *
     * @param payload - Contenido decodificado del JWT { sub, username }
     */
    async validate(payload: { sub: number; correo: string; tipo: string }) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UnauthorizedException('Token inválido o usuario desactivado');
        return { userId: payload.sub, correo: payload.correo, tipo: payload.tipo };
    }
}
