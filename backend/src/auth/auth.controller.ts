import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * AuthController — expone los endpoints HTTP del módulo de autenticación.
 *
 * Rutas disponibles:
 *   POST /auth/login  →  Inicio de sesión con usuario y contraseña
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /auth/login
     *
     * Recibe las credenciales del usuario, las delega al servicio de autenticación
     * y devuelve un token JWT si son válidas.
     *
     * @param loginDto - Cuerpo de la petición validado automáticamente por el DTO
     * @returns { access_token: string, username: string }
     *
     * Código 200 → login exitoso (no 201, ya que no se crea un recurso nuevo)
     * Código 401 → credenciales incorrectas
     * Código 400 → datos de entrada inválidos (validación del DTO)
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
