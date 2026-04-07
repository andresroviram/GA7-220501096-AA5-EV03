import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto, UpdateHorarioDto, CreateGrupoHorarioDto, UpdateGrupoHorarioDto } from './dto/horario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('horarios')
export class HorariosController {
    constructor(private readonly service: HorariosService) { }

    /* ── Horarios base ── */
    @Get()
    findAll() { return this.service.findAllHorarios(); }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOneHorario(id); }

    @Post()
    create(@Body() dto: CreateHorarioDto) { return this.service.createHorario(dto); }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHorarioDto) {
        return this.service.updateHorario(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.service.removeHorario(id); }

    /* ── Bloques Grupo-Horario ── */
    @Get('bloques/all')
    findAllBloques(@Query('idGrupo') idGrupo?: string) {
        return this.service.findAllBloques(idGrupo ? parseInt(idGrupo) : undefined);
    }

    @Get('bloques/estadisticas')
    getEstadisticas() { return this.service.getEstadisticas(); }

    @Post('bloques')
    createBloque(@Body() dto: CreateGrupoHorarioDto) { return this.service.createBloque(dto); }

    @Patch('bloques/:id')
    updateBloque(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGrupoHorarioDto) {
        return this.service.updateBloque(id, dto);
    }

    @Delete('bloques/:id')
    removeBloque(@Param('id', ParseIntPipe) id: number) { return this.service.removeBloque(id); }
}
