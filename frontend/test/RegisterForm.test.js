import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../src/components/RegisterForm';
import authService from '../src/services/authService';

jest.mock('../src/services/authService', () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
  },
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('crea una cuenta cuando se envían datos completos', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onRegisterSuccess = jest.fn();

    authService.register.mockResolvedValueOnce({ id: 1 });

    render(
      <RegisterForm
        onBackToLogin={jest.fn()}
        onRegisterSuccess={onRegisterSuccess}
      />,
    );

    await user.type(screen.getByLabelText(/nombre y apellido/i), 'Ana Perez');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana.perez@escuela.edu');
    await user.type(screen.getByLabelText(/numero de identificación/i), '123456789');
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
      target: { value: '2000-01-01' },
    });
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Clave123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Clave123');
    await user.click(screen.getByRole('button', { name: /crear mi cuenta/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        fullName: 'Ana Perez',
        username: 'ana.perez@escuela.edu',
        identification: '123456789',
        birthDate: '2000-01-01',
        password: 'Clave123',
      });
    });

    expect(await screen.findByRole('status')).toHaveTextContent('Cuenta creada exitosamente');

    jest.runOnlyPendingTimers();

    expect(onRegisterSuccess).toHaveBeenCalledTimes(1);
  });
});
