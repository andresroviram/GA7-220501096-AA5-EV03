import { IsString, IsBoolean, IsArray, IsOptional, MaxLength, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PermisoItemDto {
    @IsString() @MaxLength(60)
    modulo: string;

    @IsBoolean()
    acceso: boolean;
}

export class UpdateRolPermisosDto {
    /** Lista completa de permisos para el rol */
    @IsArray() @ArrayNotEmpty() @ValidateNested({ each: true }) @Type(() => PermisoItemDto)
    permisos: PermisoItemDto[];

    @IsOptional() @IsString() @MaxLength(200)
    descripcion?: string;
}
