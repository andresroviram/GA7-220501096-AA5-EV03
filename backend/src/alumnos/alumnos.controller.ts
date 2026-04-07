import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto, UpdateAlumnoDto } from './dto/alumno.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('alumnos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('alumnos')
export class AlumnosController {
    constructor(private readonly service: AlumnosService) { }

    @Get()
    findAll(@Query('idGrupo') idGrupo?: string) {
        return this.service.findAll(idGrupo ? parseInt(idGrupo) : undefined);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateAlumnoDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAlumnoDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
