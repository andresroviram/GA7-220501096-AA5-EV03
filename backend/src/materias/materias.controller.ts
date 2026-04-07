import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto, UpdateMateriaDto } from './dto/materia.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('materias')
export class MateriasController {
    constructor(private readonly service: MateriasService) { }

    @Get()
    findAll(@Query('departamento') depto?: string, @Query('estado') estado?: string) {
        return this.service.findAll(depto, estado);
    }

    @Get('stats/por-departamento')
    getMateriasPorDepto() { return this.service.getMateriasPorDepto(); }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

    @Post()
    create(@Body() dto: CreateMateriaDto) { return this.service.create(dto); }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMateriaDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
