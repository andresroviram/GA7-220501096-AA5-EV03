import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import PendingRoute from '../src/components/PendingRoute';
import authService from '../src/services/authService';
import {
  PENDING_FLOW_STORAGE_KEY,
  hasPendingFlow,
  leavePendingFlow,
  markPendingFlow,
} from '../src/utils/pendingFlow';

jest.mock('../src/services/authService', () => ({
  __esModule: true,
  default: { isAuthenticated: jest.fn() },
}));

function LoginPage() {
  return <p>Página de inicio de sesión</p>;
}

function DashboardPage() {
  return <p>Panel principal</p>;
}

function PendingRouteWithBackAction() {
  const navigate = useNavigate();
  return <PendingRoute onBackToLogin={() => leavePendingFlow(navigate)} />;
}

function renderPendingRoute() {
  return render(
    <MemoryRouter initialEntries={['/pendiente']}>
      <Routes>
        <Route path="/pendiente" element={<PendingRouteWithBackAction />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PendingRoute', () => {
  beforeEach(() => {
    sessionStorage.clear();
    authService.isAuthenticated.mockReturnValue(false);
  });

  test('redirecciona una visita directa al inicio de sesión', () => {
    renderPendingRoute();

    expect(screen.getByText('Página de inicio de sesión')).toBeInTheDocument();
  });

  test('preserva el acceso pendiente al recargar mientras el marcador exista', () => {
    markPendingFlow();
    const firstRender = renderPendingRoute();
    expect(screen.getByRole('heading', { name: /cuenta pendiente/i })).toBeInTheDocument();

    firstRender.unmount();
    renderPendingRoute();
    expect(screen.getByRole('heading', { name: /cuenta pendiente/i })).toBeInTheDocument();
    expect(hasPendingFlow()).toBe(true);
  });

  test('envía una sesión activa al dashboard y elimina el marcador pendiente', () => {
    markPendingFlow();
    authService.isAuthenticated.mockReturnValue(true);

    renderPendingRoute();

    expect(screen.getByText('Panel principal')).toBeInTheDocument();
    expect(sessionStorage.getItem(PENDING_FLOW_STORAGE_KEY)).toBeNull();
  });

  test('limpia el marcador al volver al inicio de sesión', async () => {
    const user = userEvent.setup();
    markPendingFlow();
    renderPendingRoute();

    await user.click(screen.getByRole('button', { name: /volver al inicio de sesión/i }));

    expect(screen.getByText('Página de inicio de sesión')).toBeInTheDocument();
    expect(hasPendingFlow()).toBe(false);
  });
});
