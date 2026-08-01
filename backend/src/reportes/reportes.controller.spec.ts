import { ReportesController } from './reportes.controller';

const supportedTypes = [
    { id: 1, name: 'Calificaciones' },
    { id: 2, name: 'Estudiantes' },
    { id: 3, name: 'Docentes' },
    { id: 4, name: 'Horarios' },
    { id: 6, name: 'Rendimiento' },
];

const response = () => ({ set: jest.fn(), send: jest.fn() });

describe('ReportesController', () => {
    const report = { content: Buffer.from('%PDF-report'), contentType: 'application/pdf', filename: 'calificaciones.pdf' };

    it('returns the supported type list', () => {
        const service = { listSupportedTypes: jest.fn().mockReturnValue(supportedTypes) };
        const controller = new ReportesController(service as any);
        const user = { userId: 1, tipo: 'administrativo' };
        expect(controller.findAll({ user })).toEqual(supportedTypes);
        expect(service.listSupportedTypes).toHaveBeenCalledWith(user);
    });

    it('writes generated binary headers and data', async () => {
        const service = { generate: jest.fn().mockResolvedValue(report) };
        const res = response();
        const controller = new ReportesController(service as any);
        await controller.generate('1', 'pdf', '1A', undefined, { user: { userId: 7 } }, res as any);
        expect(service.generate).toHaveBeenCalledWith(1, 'pdf', '1A', undefined, { userId: 7 });
        expect(res.set).toHaveBeenCalledWith(expect.objectContaining({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="calificaciones.pdf"',
        }));
        expect(res.send).toHaveBeenCalledWith(report.content);
    });

    it('writes downloaded binary headers and data', async () => {
        const service = { download: jest.fn().mockResolvedValue(report) };
        const res = response();
        const controller = new ReportesController(service as any);
        await controller.download('12', { user: { userId: 7 } }, res as any);
        expect(res.set).toHaveBeenCalledWith(expect.objectContaining({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="calificaciones.pdf"',
        }));
        expect(res.send).toHaveBeenCalledWith(report.content);
    });
});
