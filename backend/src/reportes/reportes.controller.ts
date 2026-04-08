import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReportesService } from './reportes.service';

@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
    constructor(private readonly service: ReportesService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
