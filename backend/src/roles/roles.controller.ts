import { Controller, Get, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { UpdateRolPermisosDto } from './dto/roles.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly service: RolesService) { }

    /** GET /roles — lista todos los roles con sus permisos */
    @Get()
    findAll() {
        return this.service.findAll();
    }

    /** PUT /roles/:id/permisos — actualiza permisos de un rol */
    @Put(':id/permisos')
    updatePermisos(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRolPermisosDto,
    ) {
        return this.service.updatePermisos(id, dto);
    }
}
