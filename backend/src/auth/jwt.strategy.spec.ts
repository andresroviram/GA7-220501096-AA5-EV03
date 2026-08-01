import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
    const config = { get: jest.fn().mockReturnValue('test-secret') };

    it('uses current database role and email rather than token claims', async () => {
        const users = { findById: jest.fn().mockResolvedValue({ id: 8, correo: 'current@test.dev', tipo_usuario: 'administrativo', isActive: true }) };
        const strategy = new JwtStrategy(users as any, config as any);
        await expect(strategy.validate({ sub: 8, correo: 'stale@test.dev', tipo: 'padre' })).resolves.toEqual({ userId: 8, correo: 'current@test.dev', tipo: 'administrativo' });
    });

    it.each([{ isActive: false, tipo_usuario: 'docente' }, { isActive: true, tipo_usuario: 'pendiente' }])('rejects inactive or pending current users', async (user) => {
        const strategy = new JwtStrategy({ findById: jest.fn().mockResolvedValue({ id: 8, correo: 'user@test.dev', ...user }) } as any, config as any);
        await expect(strategy.validate({ sub: 8, correo: 'user@test.dev', tipo: 'administrativo' })).rejects.toBeInstanceOf(UnauthorizedException);
    });
});
