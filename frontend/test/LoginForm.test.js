import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../src/components/LoginForm';
import authService from '../src/services/authService';
import { hasPendingFlow, markPendingFlow } from '../src/utils/pendingFlow';

jest.mock('../src/services/authService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test('valida los campos obligatorios antes de iniciar sesión', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginForm
          onLoginSuccess={jest.fn()}
          onShowRegister={jest.fn()}
          onShowForgot={jest.fn()}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText('El correo es requerido.')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es requerida.')).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  test('permite el flujo pendiente tras un rechazo USER_PENDING', async () => {
    const user = userEvent.setup();
    authService.login.mockRejectedValueOnce({ code: 'USER_PENDING' });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginForm
          onLoginSuccess={jest.fn()}
          onShowRegister={jest.fn()}
          onShowForgot={jest.fn()}
        />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/correo electrónico/i), 'pendiente@escuela.edu');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Pendiente123!');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(hasPendingFlow()).toBe(true);
  });

  test('limpia un marcador pendiente al volver al login', () => {
    markPendingFlow();

    render(
      <MemoryRouter>
        <LoginForm
          onLoginSuccess={jest.fn()}
          onShowRegister={jest.fn()}
          onShowForgot={jest.fn()}
        />
      </MemoryRouter>,
    );

    expect(hasPendingFlow()).toBe(false);
  });
});
