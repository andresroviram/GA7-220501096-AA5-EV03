import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import PDFDocument = require('pdfkit');
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Alumno } from '../alumnos/alumno.entity';
import { Calificacion } from '../calificaciones/calificacion.entity';
import { Grupo } from '../grupos/grupo.entity';
import { GrupoHorario } from '../horarios/grupo-horario.entity';
import { Horario } from '../horarios/horario.entity';
import { Materia } from '../materias/materia.entity';
import { RelacionPadres } from '../relacion-padres/relacion-padres.entity';
import { User } from '../users/user.entity';
import { Reporte } from './reporte.entity';

type AuthenticatedUser = { userId: number; correo?: string; tipo?: string };
type ReportRow = Record<string, string | number | null>;
type GeneratedReport = { content: Buffer; contentType: string; filename: string };
type ReportScope = { alumnoIds?: number[]; grupoIds?: number[]; docenteId?: number };

const MAX_REPORT_ROWS = 5000;
const QUERY_LIMIT = MAX_REPORT_ROWS + 1;
const REPORT_TYPES = [
    { id: 1, name: 'Calificaciones' },
    { id: 2, name: 'Estudiantes' },
    { id: 3, name: 'Docentes' },
    { id: 4, name: 'Horarios' },
    { id: 6, name: 'Rendimiento' },
] as const;
const LEGACY_TYPE_IDS: Record<string, number> = { calificaciones: 1, estudiantes: 2, docentes: 3, horarios: 4, rendimiento: 6 };

@Injectable()
export class ReportesService {
    constructor(
        @InjectRepository(Reporte) private readonly repo: Repository<Reporte>,
        @InjectRepository(Alumno) private readonly alumnoRepo: Repository<Alumno>,
        @InjectRepository(Calificacion) private readonly calificacionRepo: Repository<Calificacion>,
        @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
        @InjectRepository(GrupoHorario) private readonly grupoHorarioRepo: Repository<GrupoHorario>,
        @InjectRepository(Horario) private readonly horarioRepo: Repository<Horario>,
        @InjectRepository(Materia) private readonly materiaRepo: Repository<Materia>,
        @InjectRepository(RelacionPadres) private readonly relacionPadresRepo: Repository<RelacionPadres>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    listSupportedTypes(user: AuthenticatedUser) {
        this.assertAllowedRole(user);
        return REPORT_TYPES.filter((type) => !this.isParent(user) || type.id !== 3).map((type) => ({ ...type }));
    }

    findHistory(user: AuthenticatedUser): Promise<Reporte[]> {
        this.assertAllowedRole(user);
        const options: any = { order: { fecha: 'DESC' } };
        if (user.tipo !== 'administrativo') options.where = { generadoPorId: user.userId };
        return this.repo.find(options);
    }

    async generate(tipoId: number, formato: string, grupo: string | undefined, periodo: string | undefined, user: AuthenticatedUser): Promise<GeneratedReport> {
        this.assertAllowedRole(user);
        this.rejectPeriodo(periodo);
        const type = this.getType(tipoId);
        this.rejectParentDocentes(type.id, user);
        const scope = await this.getScope(user);
        const grupoId = await this.resolveGroup(grupo, scope);
        const rows = await this.getRows(type.id, grupoId, scope);
        const report = await this.render(type.name, this.normalizeFormat(formato), rows, grupoId);
        await this.repo.save(this.repo.create({
            tipo: type.name, tipoId: type.id, descripcion: this.description(type.name, grupoId),
            fecha: new Date().toISOString().slice(0, 10), generadoPor: user.correo ?? `Usuario #${user.userId}`,
            generadoPorId: user.userId, formato: this.normalizeFormat(formato).toUpperCase(), grupoId: grupoId ?? null,
            archivo: report.content,
        }));
        return report;
    }

    async download(reporteId: number, user: AuthenticatedUser): Promise<GeneratedReport> {
        this.assertAllowedRole(user);
        const metadata = await this.repo.findOne({
            where: { id: reporteId },
            select: ['id', 'tipo', 'tipoId', 'generadoPorId', 'formato', 'archivo'],
        });
        if (!metadata) throw new NotFoundException(`Reporte #${reporteId} no encontrado`);
        const tipoId = metadata.tipoId ?? LEGACY_TYPE_IDS[metadata.tipo?.toLowerCase() ?? ''];
        if (!tipoId) throw new BadRequestException('El reporte no corresponde a un tipo soportado');
        this.rejectParentDocentes(tipoId, user);
        if (user.tipo !== 'administrativo' && metadata.generadoPorId !== user.userId) throw new ForbiddenException('Solo puedes descargar reportes generados por tu cuenta');
        if (!metadata.archivo) throw new NotFoundException('El archivo histórico no está disponible');
        const format = this.normalizeFormat(metadata.formato);
        const type = this.getType(tipoId);
        return {
            content: metadata.archivo,
            filename: `${type.name.toLowerCase()}-${metadata.id}.${format === 'excel' ? 'xlsx' : 'pdf'}`,
            contentType: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
    }

    private getType(id: number) {
        const type = REPORT_TYPES.find((item) => item.id === id);
        if (!type) throw new BadRequestException('Tipo de reporte no soportado');
        return type;
    }

    private normalizeFormat(formato?: string): 'pdf' | 'excel' {
        const format = formato?.toLowerCase();
        if (format !== 'pdf' && format !== 'excel') throw new BadRequestException('formato debe ser pdf o excel');
        return format;
    }

    private rejectPeriodo(periodo?: string) {
        if (periodo?.trim()) throw new BadRequestException('periodo no está soportado en reportes de producción');
    }

    private assertAllowedRole(user: AuthenticatedUser) {
        if (!['administrativo', 'docente', 'padre'].includes(user.tipo ?? '')) throw new ForbiddenException('Tu rol no tiene acceso a reportes');
    }

    private isParent(user: AuthenticatedUser) { return user.tipo === 'padre'; }

    private rejectParentDocentes(tipoId: number, user: AuthenticatedUser) {
        if (tipoId === 3 && this.isParent(user)) throw new ForbiddenException('No tienes acceso al reporte de docentes');
    }

    private async getScope(user: AuthenticatedUser): Promise<ReportScope> {
        if (user.tipo === 'administrativo') return {};
        if (this.isParent(user)) {
            const relations = await this.relacionPadresRepo.find({ where: { id_padre: user.userId }, order: { id_alumno: 'ASC' } });
            const alumnoIds = relations.map((relation) => relation.id_alumno);
            if (!alumnoIds.length) return { alumnoIds: [], grupoIds: [] };
            const alumnos = await this.alumnoRepo.find({ where: { id_alumno: In(alumnoIds) }, order: { id_alumno: 'ASC' } });
            return { alumnoIds, grupoIds: [...new Set(alumnos.map((alumno) => alumno.id_grupo))] };
        }
        const materias = await this.materiaRepo.find({ where: { id_docente: user.userId }, order: { id_materia: 'ASC' } });
        const names = materias.map((materia) => materia.nombre);
        const blocks = names.length
            ? await this.grupoHorarioRepo.find({ where: { materia: In(names) }, order: { id_grupo_horario: 'ASC' } })
            : [];
        return { grupoIds: [...new Set(blocks.map((block) => block.id_grupo))], docenteId: user.userId };
    }

    private async resolveGroup(grupo: string | undefined, scope: ReportScope): Promise<number | undefined> {
        const value = grupo?.trim();
        if (!value) return undefined;
        const isNumericId = /^\d+$/.test(value);
        const group = isNumericId
            ? await this.grupoRepo.findOne({ where: { id_grupo: Number(value) } })
            : await this.grupoRepo.findOne({ where: { nombre: value } });
        if (!group) throw new BadRequestException('grupo no corresponde a un grupo existente');
        this.validateGroupScope(group.id_grupo, scope);
        return group.id_grupo;
    }

    private validateGroupScope(grupoId: number | undefined, scope: ReportScope) {
        if (grupoId !== undefined && scope.grupoIds && !scope.grupoIds.includes(grupoId)) throw new ForbiddenException('No tienes acceso a este grupo');
    }

    private ensureRowLimit(rows: ReportRow[]) {
        if (rows.length > MAX_REPORT_ROWS) throw new UnprocessableEntityException(`El reporte excede el máximo de ${MAX_REPORT_ROWS} filas`);
        return rows;
    }

    private async getRows(tipoId: number, grupoId: number | undefined, scope: ReportScope): Promise<ReportRow[]> {
        switch (tipoId) {
            case 3: return this.getDocenteRows(scope);
            case 4: return this.getHorarioRows(grupoId, scope);
            case 1: case 2: case 6: break;
            default: throw new BadRequestException('Tipo de reporte no soportado');
        }
        const where: any = {};
        if (grupoId !== undefined) where.id_grupo = grupoId;
        else if (scope.grupoIds) where.id_grupo = In(scope.grupoIds);
        if (scope.alumnoIds) where.id_alumno = In(scope.alumnoIds);
        const alumnos = await this.alumnoRepo.find({ where, take: QUERY_LIMIT, order: { id_alumno: 'ASC' } });
        const referencedGroupIds = [...new Set(alumnos.map((alumno) => alumno.id_grupo))];
        const grupos = referencedGroupIds.length ? await this.grupoRepo.find({ where: { id_grupo: In(referencedGroupIds) } }) : [];
        const grupoMap = new Map(grupos.map((grupo) => [grupo.id_grupo, grupo]));

        if (tipoId === 2) return this.ensureRowLimit(alumnos.map((alumno) => ({ Estudiante: `${alumno.nombre} ${alumno.apellido}`, Grupo: grupoMap.get(alumno.id_grupo)?.nombre ?? '', Estado: alumno.estado, Promedio: alumno.promedio ?? null })));

        if (tipoId === 1 || tipoId === 6) {
            if (tipoId === 1 && alumnos.length > MAX_REPORT_ROWS) throw new UnprocessableEntityException(`El reporte excede el máximo de ${MAX_REPORT_ROWS} filas`);
            const alumnoIds = alumnos.map((alumno) => alumno.id_alumno);
            const calificaciones = alumnoIds.length ? await this.calificacionRepo.find({ where: { id_alumno: In(alumnoIds) }, take: QUERY_LIMIT, order: { id_calificacion: 'ASC' } }) : [];
            const materiaIds = [...new Set(calificaciones.map((calificacion) => calificacion.id_materia))];
            const materias = materiaIds.length ? await this.materiaRepo.find({ where: { id_materia: In(materiaIds) } }) : [];
            const alumnoMap = new Map(alumnos.map((alumno) => [alumno.id_alumno, alumno]));
            const materiaMap = new Map(materias.map((materia) => [materia.id_materia, materia.nombre]));
            if (tipoId === 1) return this.ensureRowLimit(calificaciones.map((calificacion) => {
                const alumno = alumnoMap.get(calificacion.id_alumno);
                return { Estudiante: alumno ? `${alumno.nombre} ${alumno.apellido}` : `Alumno #${calificacion.id_alumno}`, Grupo: alumno ? grupoMap.get(alumno.id_grupo)?.nombre ?? '' : '', Materia: materiaMap.get(calificacion.id_materia) ?? `Materia #${calificacion.id_materia}`, Calificacion: calificacion.valor, Fecha: calificacion.fecha_registro };
            }));
            const values = new Map<number, number[]>();
            calificaciones.forEach((calificacion) => values.set(calificacion.id_alumno, [...(values.get(calificacion.id_alumno) ?? []), calificacion.valor]));
            return this.ensureRowLimit(alumnos.map((alumno) => {
                const grades = values.get(alumno.id_alumno) ?? [];
                const average = grades.length ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : null;
                return { Estudiante: `${alumno.nombre} ${alumno.apellido}`, Grupo: grupoMap.get(alumno.id_grupo)?.nombre ?? '', Promedio: average === null ? null : Math.round(average * 100) / 100, Calificaciones: grades.length };
            }));
        }

        throw new BadRequestException('Tipo de reporte no soportado');
    }

    private async getHorarioRows(grupoId: number | undefined, scope: ReportScope): Promise<ReportRow[]> {
        const groupIds = grupoId ? [grupoId] : scope.grupoIds;
        const blockWhere: FindOptionsWhere<GrupoHorario> = {};
        if (groupIds) blockWhere.id_grupo = In(groupIds);
        const blocks = groupIds?.length === 0 ? [] : await this.grupoHorarioRepo.find({ where: blockWhere, take: QUERY_LIMIT, order: { id_grupo_horario: 'ASC' } });
        const referencedGroupIds = [...new Set(blocks.map((block) => block.id_grupo))];
        const grupos = referencedGroupIds.length ? await this.grupoRepo.find({ where: { id_grupo: In(referencedGroupIds) } }) : [];
        const grupoMap = new Map(grupos.map((group) => [group.id_grupo, group]));
        const scheduleIds = [...new Set(blocks.map((block) => block.id_horario))];
        const schedules = scheduleIds.length ? await this.horarioRepo.find({ where: { id_horario: In(scheduleIds) } }) : [];
        const scheduleMap = new Map(schedules.map((schedule) => [schedule.id_horario, schedule]));
        return this.ensureRowLimit(blocks.map((block) => {
            const schedule = scheduleMap.get(block.id_horario);
            return { Grupo: grupoMap.get(block.id_grupo)?.nombre ?? '', Materia: block.materia ?? '', Docente: block.docente ?? '', Dia: schedule?.dia_semana ?? '', Inicio: schedule?.hora_inicio ?? '', Fin: schedule?.hora_fin ?? '', Aula: block.aula ?? '', Estado: block.estado };
        }));
    }

    private async getDocenteRows(scope: ReportScope): Promise<ReportRow[]> {
        const where: FindOptionsWhere<User> = { tipo_usuario: 'docente' };
        if (scope.docenteId) where.id = scope.docenteId;
        const docentes = await this.userRepo.find({ where, take: QUERY_LIMIT, order: { id: 'ASC' } });
        return this.ensureRowLimit(docentes.map((docente) => ({ Docente: `${docente.nombre} ${docente.apellido}`, Departamento: docente.departamento ?? '' })));
    }

    private async render(title: string, format: 'pdf' | 'excel', rows: ReportRow[], grupoId?: number): Promise<GeneratedReport> {
        const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        const subtitle = grupoId ? `Grupo: ${grupoId}` : '';
        const content = format === 'pdf' ? await this.createPdf(title, subtitle, rows) : await this.createExcel(title, subtitle, rows);
        return { content, filename, contentType: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }

    private createPdf(title: string, subtitle: string, rows: ReportRow[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const document = new PDFDocument({ margin: 40, size: 'A4' }); const chunks: Buffer[] = [];
            document.on('data', (chunk: Buffer) => chunks.push(chunk)); document.on('end', () => resolve(Buffer.concat(chunks))); document.on('error', reject);
            document.fontSize(18).text(title); document.fontSize(10).fillColor('#555').text(subtitle || 'Reporte académico'); document.moveDown();
            if (!rows.length) document.fillColor('#000').text('No hay datos disponibles para los filtros seleccionados.');
            rows.forEach((row, index) => { document.fillColor('#000').fontSize(9).text(Object.entries(row).map(([key, item]) => `${key}: ${item ?? '—'}`).join(' | ')); if (index < rows.length - 1) document.moveDown(0.35); });
            document.end();
        });
    }

    private async createExcel(title: string, subtitle: string, rows: ReportRow[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet(title.slice(0, 31)); sheet.addRow([title]); sheet.addRow([subtitle || 'Reporte académico']);
        const headers = Object.keys(rows[0] ?? {});
        if (headers.length) { sheet.addRow(headers); rows.forEach((row) => sheet.addRow(headers.map((header) => row[header]))); sheet.getRow(3).font = { bold: true }; sheet.columns = headers.map((header) => ({ key: header, width: Math.max(14, header.length + 2) })); }
        else sheet.addRow(['No hay datos disponibles para los filtros seleccionados.']);
        return Buffer.from(await workbook.xlsx.writeBuffer());
    }

    private description(type: string, grupoId?: number): string { return [type, grupoId ? `grupo ${grupoId}` : ''].filter(Boolean).join(' - '); }
}
