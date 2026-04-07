import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto, UpdateCalificacionDto } from './dto/calificacion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('calificaciones')
export class CalificacionesController {
    constructor(private readonly service: CalificacionesService) { }

    @Get()
    findAll(
        @Query('idAlumno') idAlumno?: string,
        @Query('idMateria') idMateria?: string,
    ) {
        return this.service.findAll(
            idAlumno ? parseInt(idAlumno) : undefined,
            idMateria ? parseInt(idMateria) : undefined,
        );
    }

    @Get('stats/promedios')
    getPromedios() { return this.service.getPromediosPorGrupo(); }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

    @Post()
    create(@Body() dto: CreateCalificacionDto) { return this.service.create(dto); }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCalificacionDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
