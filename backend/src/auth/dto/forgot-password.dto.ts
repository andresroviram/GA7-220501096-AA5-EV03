import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'usuario@escuela.edu', description: 'Correo de la cuenta a recuperar' })
    @IsEmail({}, { message: 'Correo electrónico no válido' })
    @IsNotEmpty()
    correo: string;
}
