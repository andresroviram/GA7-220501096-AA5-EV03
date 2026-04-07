import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../users/dto/usuario.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

/**
 * AuthController — expone los endpoints HTTP del módulo de autenticación.
 *
 * Rutas disponibles:
 *   POST /auth/login  →  Inicio de sesión con usuario y contraseña
 */
/** Agrupa los endpoints de autenticación bajo la etiqueta "auth" en Swagger */
@ApiTags('auth')
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
    @ApiOperation({ summary: 'Iniciar sesión', description: 'Valida usuario y contraseña contra la base de datos y retorna un token JWT.' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login exitoso — retorna el token JWT.', schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', username: 'admin' } } })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    /**
     * POST /auth/register
     * Crea una nueva cuenta de usuario.
     * Responde 201 con los datos del usuario creado (sin contraseña).
     * Responde 409 si el correo ya está registrado.
     */
    @Post('register')
    @ApiOperation({ summary: 'Registrar usuario', description: 'Crea una nueva cuenta con los datos del formulario de registro.' })
    @ApiBody({ type: CreateUsuarioDto })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
    @ApiResponse({ status: 409, description: 'El correo ya está registrado.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    async register(@Body() dto: CreateUsuarioDto) {
        return this.authService.register(dto);
    }

    /**
     * POST /auth/forgot-password
     * Genera un código de reset y lo devuelve en la respuesta (dev mode).
     * En producción el token se enviaría únicamente por correo.
     */
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'Código generado (dev: incluido en respuesta).' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    /**
     * POST /auth/reset-password
     * Valida el token y actualiza la contraseña.
     */
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Restablecer contraseña con el código recibido' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Contraseña actualizada.' })
    @ApiResponse({ status: 400, description: 'Token inválido o expirado.' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }
}
