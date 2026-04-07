import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsuarioDto, UpdateUsuarioDto, TipoUsuario } from './dto/usuario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('usuarios')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Get()
    findAll(@Query('tipo') tipo?: TipoUsuario) {
        return this.service.findAll(tipo);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.service.createUser(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
        return this.service.updateUser(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.removeUser(id);
    }
}
