import { IsString, IsNumber, IsEmail, IsOptional, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateConfigParamsDto {
    @IsOptional() @IsString() @MaxLength(200)
    institucion?: string;

    @IsOptional() @IsString() @MaxLength(50)
    cicloActual?: string;

    @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(200)
    maxEstPorGrupo?: number;

    @IsOptional() @IsEmail()
    correoContacto?: string;

    @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
    escalaMin?: number;

    @IsOptional() @Type(() => Number) @IsNumber() @Max(100)
    escalaMax?: number;

    @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
    notaAprobatoria?: number;
}
