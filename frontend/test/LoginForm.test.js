import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../src/components/LoginForm';
import authService from '../src/services/authService';

jest.mock('../src/services/authService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
