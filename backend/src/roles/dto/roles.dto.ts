import { IsString, IsBoolean, IsArray, IsOptional, MaxLength, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermisoItemDto {
    @ApiProperty({ example: 'calificaciones', description: 'Nombre del módulo' })
    @IsString() @MaxLength(60)
    modulo: string;

    @ApiProperty({ example: true, description: 'Si el rol tiene acceso al módulo' })
    @IsBoolean()
    acceso: boolean;
}

export class UpdateRolPermisosDto {
    /** Lista completa de permisos para el rol */
    @ApiProperty({ type: [PermisoItemDto], description: 'Lista completa de permisos para el rol' })
    @IsArray() @ArrayNotEmpty() @ValidateNested({ each: true }) @Type(() => PermisoItemDto)
    permisos: PermisoItemDto[];

    @ApiPropertyOptional({ example: 'Rol con acceso a reportes y calificaciones' })
    @IsOptional() @IsString() @MaxLength(200)
    descripcion?: string;
}
