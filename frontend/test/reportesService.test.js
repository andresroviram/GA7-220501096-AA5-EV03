import api from '../src/services/api';
import { triggerBlobDownload } from '../src/utils/exportUtils';
import {
  descargarReporte,
  filenameFromContentDisposition,
  generarReporte,
  getReportesRecientes,
  getTiposReporte,
} from '../src/services/reportesService';

jest.mock('../src/config/runtime', () => ({ isMockMode: false }));
jest.mock('../src/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock('../src/utils/exportUtils', () => ({
  triggerBlobDownload: jest.fn(),
}));

describe('reportesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('obtiene los tipos soportados desde el backend y conserva los metadatos de presentación', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'Calificaciones' },
        { id: 6, name: 'Rendimiento' },
      ],
    });

    await expect(getTiposReporte()).resolves.toEqual([
      expect.objectContaining({ id: 1, titulo: 'Calificaciones', filtros: ['grupo'] }),
      expect.objectContaining({ id: 6, titulo: 'Rendimiento', filtros: [] }),
    ]);
    expect(api.get).toHaveBeenCalledWith('/reportes');
  });

  test('obtiene el historial de reportes desde su endpoint dedicado', async () => {
    const historial = [{ id: 24, formato: 'EXCEL' }];
    api.get.mockResolvedValueOnce({ data: historial });

    await expect(getReportesRecientes()).resolves.toEqual(historial);
    expect(api.get).toHaveBeenCalledWith('/reportes/historial');
  });

  test('no envía id_padre ni periodo en producción y prioriza Content-Disposition al generar', async () => {
    const blob = new Blob(['content']);
    api.get.mockResolvedValueOnce({
      data: blob,
      headers: { 'content-disposition': "attachment; filename*=UTF-8''calificaciones%202026.pdf" },
    });

    await generarReporte(1, 'pdf', { grupo: '2', periodo: '2026-1' });

    expect(api.get).toHaveBeenCalledWith('/reportes/1/generate', {
      params: { formato: 'pdf', grupo: '2' },
      responseType: 'blob',
    });
    expect(triggerBlobDownload).toHaveBeenCalledWith(blob, 'calificaciones 2026.pdf');
  });

  test('usa un nombre seguro de respaldo al descargar si no hay cabecera', async () => {
    const blob = new Blob(['content']);
    api.get.mockResolvedValueOnce({ data: blob, headers: {} });

    await descargarReporte({ id: 24, formato: 'EXCEL' });

    expect(triggerBlobDownload).toHaveBeenCalledWith(blob, 'reporte-24.xlsx');
    expect(filenameFromContentDisposition('attachment; filename="reporte.pdf"', 'fallback.pdf')).toBe('reporte.pdf');
  });
});
