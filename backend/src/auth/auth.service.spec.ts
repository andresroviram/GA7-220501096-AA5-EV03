import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({ compare: jest.fn() }));

describe('AuthService login', () => {
    const user = { id: 4, correo: 'pending@test.dev', password: 'hash', nombre: 'Ana', apellido: 'Test', telefono: null, isActive: true, tipo_usuario: 'pendiente' };
    const makeService = (currentUser: any) => {
        const users = { findByCorreo: jest.fn().mockResolvedValue(currentUser) };
        const jwt = { sign: jest.fn().mockReturnValue('signed-token') };
        const logs = { create: jest.fn((value) => value), save: jest.fn() };
        return { service: new AuthService(users as any, jwt as any, logs as any, {} as any), jwt };
    };

    beforeEach(() => jest.clearAllMocks());

    it('returns the stable USER_PENDING 401 and never signs a pending user', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        const { service, jwt } = makeService(user);
        await expect(service.login({ correo: user.correo, password: 'secret' })).rejects.toMatchObject({ status: 401, response: { code: 'USER_PENDING', message: 'Usuario pendiente de activación' } });
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('never signs an inactive user', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        const { service, jwt } = makeService({ ...user, tipo_usuario: 'docente', isActive: false });
        await expect(service.login({ correo: user.correo, password: 'secret' })).rejects.toBeInstanceOf(UnauthorizedException);
        expect(jwt.sign).not.toHaveBeenCalled();
    });
});
