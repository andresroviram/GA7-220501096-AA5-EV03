import { BadRequestException, Controller, Get, Param, Query, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReportesService } from './reportes.service';

@ApiTags('reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
    constructor(private readonly service: ReportesService) { }

    @Get()
    findAll(@Request() req: any) {
        return this.service.listSupportedTypes(req.user);
    }

    @Get('historial')
    findHistory(@Request() req: any) {
        return this.service.findHistory(req.user);
    }

    @Get(':tipoId/generate')
    async generate(
        @Param('tipoId') tipoId: string,
        @Query('formato') formato: string,
        @Query('grupo') grupo: string | undefined,
        @Query('periodo') periodo: string | undefined,
        @Request() req: any,
        @Res() res: Response,
    ) {
        const typeId = this.parsePositiveInteger(tipoId, 'tipoId');
        const report = await this.service.generate(typeId, formato, grupo, periodo, req.user);
        return this.sendFile(res, report);
    }

    @Get(':reporteId/download')
    async download(@Param('reporteId') reporteId: string, @Request() req: any, @Res() res: Response) {
        const report = await this.service.download(this.parsePositiveInteger(reporteId, 'reporteId'), req.user);
        return this.sendFile(res, report);
    }

    private parsePositiveInteger(value: string, field: string): number {
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new BadRequestException(`${field} debe ser un entero positivo`);
        }
        return parsed;
    }

    private sendFile(res: Response, report: { content: Buffer; contentType: string; filename: string }) {
        res.set({
            'Content-Type': report.contentType,
            'Content-Disposition': `attachment; filename="${report.filename}"`,
            'Content-Length': report.content.length.toString(),
        });
        return res.send(report.content);
    }
}
