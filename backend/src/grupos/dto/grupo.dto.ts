import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateGrupoDto {
    @IsString() @IsNotEmpty() @MaxLength(20)
    nombre: string;

    @IsString() @IsNotEmpty() @MaxLength(10)
    grado: string;
}

export class UpdateGrupoDto {
    @IsOptional() @IsString() @MaxLength(20)
    nombre?: string;

    @IsOptional() @IsString() @MaxLength(10)
    grado?: string;
}
