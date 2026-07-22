import { render, screen, waitFor } from '@testing-library/react';
import DashboardDesktop from '../src/pages/desktop/DashboardDesktop';
import { getSessionUser } from '../src/utils/sessionUser';
import { getMisHijos } from '../src/services/estudiantesService';
import { getCalificaciones } from '../src/services/calificacionesService';

jest.mock('recharts', () => {
  const React = require('react');
  const Chart = ({ children }) => React.createElement('div', null, children);

  return {
    BarChart: Chart,
    Bar: Chart,
    CartesianGrid: Chart,
    Cell: Chart,
    Legend: Chart,
    Pie: Chart,
    PieChart: Chart,
    ResponsiveContainer: Chart,
    Tooltip: Chart,
    XAxis: Chart,
    YAxis: Chart,
  };
});

jest.mock('../src/utils/sessionUser', () => ({
  getSessionUser: jest.fn(),
}));

jest.mock('../src/services/estudiantesService', () => ({
  getMisHijos: jest.fn(),
}));

jest.mock('../src/services/calificacionesService', () => ({
  getCalificaciones: jest.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza métricas y tablas del dashboard para acudiente', async () => {
    getSessionUser.mockReturnValue({
      nombre: 'Juan Rodriguez',
      tipo_usuario: 'padre',
    });
    getMisHijos.mockResolvedValueOnce([
      { id: 'EST-001', nombre: 'Laura Rodriguez', grupo: '1A', promedio: 8.5, estado: 'Activo' },
      { id: 'EST-002', nombre: 'Carlos Rodriguez', grupo: '2B', promedio: 7.5, estado: 'Activo' },
    ]);
    getCalificaciones.mockResolvedValueOnce([
      { id: 1, estudiante: 'Laura Rodriguez', materia: 'Matemáticas', grupo: '1A', calificacion: 9, fecha: '2026-05-20' },
      { id: 2, estudiante: 'Carlos Rodriguez', materia: 'Lenguaje', grupo: '2B', calificacion: 7, fecha: '2026-05-21' },
    ]);

    render(<DashboardDesktop />);

    expect(screen.getByRole('heading', { name: /bienvenido, juan rodriguez/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Laura Rodriguez')).toHaveLength(2);
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });

    expect(screen.getByText('Estudiantes a mi cargo')).toBeInTheDocument();
    expect(screen.getByText('Promedio general')).toBeInTheDocument();
    expect(screen.getByText('Calificaciones totales')).toBeInTheDocument();
    expect(screen.getByText('Calificaciones aprobadas')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /mis estudiantes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /calificaciones recientes/i })).toBeInTheDocument();
    expect(screen.getAllByRole('table')).toHaveLength(2);
  });
});
