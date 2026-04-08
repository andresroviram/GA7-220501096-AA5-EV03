import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGrupoDto {
    @ApiProperty({ example: '10A', description: 'Nombre del grupo' })
    @IsString() @IsNotEmpty() @MaxLength(20)
    nombre: string;

    @ApiProperty({ example: '10', description: 'Grado escolar' })
    @IsString() @IsNotEmpty() @MaxLength(10)
    grado: string;
}

export class UpdateGrupoDto {
    @ApiPropertyOptional({ example: '10B' })
    @IsOptional() @IsString() @MaxLength(20)
    nombre?: string;

    @ApiPropertyOptional({ example: '10' })
    @IsOptional() @IsString() @MaxLength(10)
    grado?: string;
}
