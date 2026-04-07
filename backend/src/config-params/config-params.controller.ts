import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigParamsService } from './config-params.service';
import { UpdateConfigParamsDto } from './dto/config-params.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('configuracion')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('config/params')
export class ConfigParamsController {
    constructor(private readonly service: ConfigParamsService) { }

    @Get()
    get() {
        return this.service.get();
    }

    @Put()
    update(@Body() dto: UpdateConfigParamsDto) {
        return this.service.update(dto);
    }
}
