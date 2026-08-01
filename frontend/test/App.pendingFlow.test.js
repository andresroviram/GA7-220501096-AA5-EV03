import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import authService from '../src/services/authService';
import { hasPendingFlow } from '../src/utils/pendingFlow';

jest.mock('../src/services/authService', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));
jest.mock('../src/hooks/useTheme', () => ({ useTheme: () => ({ dark: false, toggle: jest.fn() }) }));
jest.mock('../src/hooks/useIsMobile', () => ({ useIsMobile: () => false }));
jest.mock('../src/components/LoginForm', () => ({ __esModule: true, default: () => <p>Login</p> }));
jest.mock('../src/components/RegisterForm', () => ({
  __esModule: true,
  default: ({ onRegisterSuccess }) => <button onClick={onRegisterSuccess}>Completar registro</button>,
}));
jest.mock('../src/components/ForgotPasswordForm', () => ({ __esModule: true, default: () => <p>Recuperar</p> }));
jest.mock('../src/layouts/MainLayout', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/layouts/MobileLayout', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Dashboard', () => ({ __esModule: true, default: () => <p>Dashboard</p> }));
jest.mock('../src/pages/Docentes', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Calificaciones', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Estudiantes', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/GruposHorarios', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Materias', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Reportes', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Configuraciones', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../src/pages/Roles', () => ({ __esModule: true, default: () => <div /> }));

describe('registro pendiente', () => {
  beforeEach(() => {
    sessionStorage.clear();
    authService.isAuthenticated.mockReturnValue(false);
    window.location.hash = '#/register';
  });

  test('marca el flujo pendiente y reemplaza la ruta al completar el registro', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /completar registro/i }));

    expect(await screen.findByRole('heading', { name: /cuenta pendiente/i })).toBeInTheDocument();
    expect(hasPendingFlow()).toBe(true);
    expect(window.location.hash).toBe('#/pendiente');
  });
});
