import { BadRequestException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { ReportesService } from './reportes.service';

const repo = (rows: any[] = []) => ({
    find: jest.fn().mockResolvedValue(rows), findOne: jest.fn(), create: jest.fn((value) => value), save: jest.fn().mockImplementation(async (value) => ({ id: 99, ...value })),
});
const service = (...repos: any[]) => new ReportesService(repos[0], repos[1], repos[2], repos[3], repos[4], repos[5], repos[6], repos[7], repos[8]);

function baseRepos({ alumnos = [{ id_alumno: 1, nombre: 'Ana', apellido: 'López', id_grupo: 1, estado: 'Activo', promedio: 8.5 }], grupos = [{ id_grupo: 1, nombre: '1A' }], calificaciones = [] }: any = {}) {
    const reports = repo(); const alumnoRepo = repo(alumnos); const calificacionRepo = repo(calificaciones); const grupoRepo = repo(grupos);
    grupoRepo.findOne.mockImplementation(async ({ where }: any) => grupos.find((group) => group.id_grupo === where.id_grupo || group.nombre === where.nombre));
    return { reports, alumnoRepo, calificacionRepo, grupoRepo, repos: [reports, alumnoRepo, calificacionRepo, grupoRepo, repo(), repo(), repo(), repo(), repo()] };
}

describe('ReportesService', () => {
    it('exposes all supported report types to administrators', () => {
        const { repos } = baseRepos();
        expect(service(...repos).listSupportedTypes({ userId: 1, tipo: 'administrativo' })).toEqual([{ id: 1, name: 'Calificaciones' }, { id: 2, name: 'Estudiantes' }, { id: 3, name: 'Docentes' }, { id: 4, name: 'Horarios' }, { id: 6, name: 'Rendimiento' }]);
    });

    it('hides only the docentes report type from parent users', () => {
        const { repos } = baseRepos();
        expect(service(...repos).listSupportedTypes({ userId: 2, tipo: 'padre' })).toEqual([{ id: 1, name: 'Calificaciones' }, { id: 2, name: 'Estudiantes' }, { id: 4, name: 'Horarios' }, { id: 6, name: 'Rendimiento' }]);
    });

    it('rejects roles without an explicit report policy', async () => {
        const reportService = service(...baseRepos().repos);
        expect(() => reportService.listSupportedTypes({ userId: 3, tipo: 'pendiente' })).toThrow(ForbiddenException);
        await expect(reportService.generate(2, 'pdf', undefined, undefined, { userId: 3, tipo: 'otro' })).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('scopes teacher rows through assigned subjects and groups', async () => {
        const fixture = baseRepos();
        fixture.repos[6].find.mockResolvedValue([{ id_materia: 10, nombre: 'Matemáticas', id_docente: 4 }]);
        fixture.repos[4].find.mockResolvedValue([{ id_grupo_horario: 1, id_grupo: 1, materia: 'Matemáticas' }]);
        await service(...fixture.repos).generate(2, 'pdf', undefined, undefined, { userId: 4, tipo: 'docente' });
        expect(fixture.repos[6].find).toHaveBeenCalledWith({ where: { id_docente: 4 }, order: { id_materia: 'ASC' } });
        expect(fixture.repos[4].find).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ materia: expect.anything() }) }));
        expect(fixture.alumnoRepo.find).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id_grupo: expect.anything() }), take: 5001 }));
    });

    it('resolves an exact group name server-side before generating', async () => {
        const fixture = baseRepos();
        await expect(service(...fixture.repos).generate(2, 'excel', '1A', undefined, { userId: 7, tipo: 'administrativo' })).resolves.toMatchObject({ contentType: expect.stringContaining('spreadsheetml') });
        expect(fixture.grupoRepo.findOne).toHaveBeenCalledWith({ where: { nombre: '1A' } });
        expect(fixture.reports.save).toHaveBeenCalledWith(expect.objectContaining({ grupoId: 1 }));
    });

    it('accepts a positive numeric group id and rejects unknown groups', async () => {
        const fixture = baseRepos(); const reportService = service(...fixture.repos);
        await expect(reportService.generate(2, 'pdf', '1', undefined, { userId: 7, tipo: 'administrativo' })).resolves.toBeDefined();
        await expect(reportService.generate(2, 'pdf', 'missing', undefined, { userId: 7, tipo: 'administrativo' })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects a production periodo and does not persist it', async () => {
        const fixture = baseRepos(); const reportService = service(...fixture.repos);
        await expect(reportService.generate(2, 'pdf', undefined, '2026-1', { userId: 7, tipo: 'administrativo' })).rejects.toMatchObject({ status: 400 });
        await reportService.generate(2, 'pdf', undefined, undefined, { userId: 7, tipo: 'administrativo' });
        expect(fixture.reports.save).toHaveBeenCalledWith(expect.not.objectContaining({ periodo: expect.anything() }));
    });

    it('blocks parent generation of teacher reports and downloads owned by another account', async () => {
        const fixture = baseRepos(); const reportService = service(...fixture.repos);
        await expect(reportService.generate(3, 'pdf', undefined, undefined, { userId: 7, tipo: 'padre' })).rejects.toBeInstanceOf(ForbiddenException);
        fixture.reports.findOne.mockResolvedValue({ id: 5, tipoId: 2, tipo: 'Estudiantes', generadoPorId: 8, formato: 'PDF', archivo: Buffer.from('private') });
        await expect(reportService.download(5, { userId: 7, tipo: 'padre' })).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('persists generated bytes and downloads the immutable artifact', async () => {
        const fixture = baseRepos(); const reportService = service(...fixture.repos);
        const generated = await reportService.generate(2, 'pdf', undefined, undefined, { userId: 7, tipo: 'administrativo' });
        const saved = fixture.reports.save.mock.calls[0][0];
        expect(saved.archivo).toEqual(generated.content);
        fixture.reports.findOne.mockResolvedValue({ id: 99, tipoId: 2, tipo: 'Estudiantes', generadoPorId: 7, formato: 'PDF', archivo: saved.archivo });
        fixture.alumnoRepo.find.mockClear();
        await expect(reportService.download(99, { userId: 7, tipo: 'administrativo' })).resolves.toMatchObject({ content: generated.content });
        expect(fixture.alumnoRepo.find).not.toHaveBeenCalled();
    });

    it('never exposes teacher email or identity document fields', async () => {
        const fixture = baseRepos(); fixture.repos[8].find.mockResolvedValue([{ nombre: 'Doc', apellido: 'Uno', correo: 'private@test.dev', cedula: '123', departamento: 'Math', tipo_usuario: 'docente' }]);
        const result = await service(...fixture.repos).generate(3, 'excel', undefined, undefined, { userId: 1, tipo: 'administrativo' });
        expect(result.content.toString()).not.toContain('private@test.dev');
    });

    it('rejects reports over 5000 rows before rendering buffers', async () => {
        const alumnos = Array.from({ length: 5001 }, (_, index) => ({ id_alumno: index + 1, nombre: 'A', apellido: String(index), id_grupo: 1, estado: 'Activo' }));
        const fixture = baseRepos({ alumnos });
        await expect(service(...fixture.repos).generate(2, 'pdf', undefined, undefined, { userId: 7, tipo: 'administrativo' })).rejects.toBeInstanceOf(UnprocessableEntityException);
        expect(fixture.alumnoRepo.find).toHaveBeenCalledWith(expect.objectContaining({ take: 5001 }));
    });

    it('rejects an oversized authorized student scope before grade lookup can omit later grades', async () => {
        const alumnos = Array.from({ length: 5001 }, (_, index) => ({ id_alumno: index + 1, nombre: 'A', apellido: String(index), id_grupo: 1, estado: 'Activo' }));
        const fixture = baseRepos({ alumnos, calificaciones: [{ id_calificacion: 1, id_alumno: 5002, id_materia: 1, valor: 10 }] });
        fixture.repos[7].find.mockResolvedValue(Array.from({ length: 5002 }, (_, index) => ({ id_padre: 7, id_alumno: index + 1 })));
        await expect(service(...fixture.repos).generate(1, 'pdf', undefined, undefined, { userId: 7, tipo: 'padre' })).rejects.toBeInstanceOf(UnprocessableEntityException);
        expect(fixture.calificacionRepo.find).not.toHaveBeenCalled();
    });

    it('applies parent schedule scope before the ordered overflow probe', async () => {
        const fixture = baseRepos();
        fixture.repos[7].find.mockResolvedValue([{ id_padre: 7, id_alumno: 1 }]);
        fixture.repos[4].find.mockResolvedValue(Array.from({ length: 5001 }, (_, index) => ({ id_grupo_horario: index + 1, id_grupo: 1, id_horario: 1 })));
        await expect(service(...fixture.repos).generate(4, 'pdf', undefined, undefined, { userId: 7, tipo: 'padre' })).rejects.toBeInstanceOf(UnprocessableEntityException);
        expect(fixture.repos[4].find).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id_grupo: expect.anything() }), take: 5001, order: { id_grupo_horario: 'ASC' } }));
    });

    it('rejects unsupported row dispatch instead of falling back to schedules', async () => {
        const reportService = service(...baseRepos().repos) as any;
        await expect(reportService.getRows(5, undefined, {})).rejects.toBeInstanceOf(BadRequestException);
    });
});
