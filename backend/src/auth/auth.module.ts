import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * AuthModule — encapsula toda la lógica de autenticación.
 *
 * Componentes:
 *  - PassportModule: integra estrategias de autenticación (jwt por defecto)
 *  - JwtModule: configura firma y verificación de tokens JWT
 *  - JwtStrategy: implementa la validación del token Bearer
 *  - AuthController: expone POST /auth/login
 *  - AuthService: valida credenciales y genera tokens
 */
@Module({
    imports: [
        // UsersModule exporta UsersService que usamos para buscar usuarios
        UsersModule,

        // Registra la estrategia 'jwt' como autenticación por defecto
        PassportModule.register({ defaultStrategy: 'jwt' }),

        // Configura el módulo JWT con el secreto y la duración del token
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'secreto_jwt_cambiar_en_produccion',
            signOptions: { expiresIn: '1h' }, // El token expira en 1 hora
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy, // Registrar la estrategia para que Passport la use
    ],
})
export class AuthModule { }
