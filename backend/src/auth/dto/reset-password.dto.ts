import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ description: 'Código de 6 caracteres recibido por correo' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    token: string;

    @ApiProperty({ description: 'Nueva contraseña (mínimo 8 caracteres)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    newPassword: string;
}
