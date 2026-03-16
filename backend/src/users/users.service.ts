import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

/**
 * UsersService — lógica de negocio relacionada con los usuarios.
 *
 * Responsabilidades:
 *  - Consultar usuarios por nombre de usuario (usado por AuthService).
 *  - Sembrar un usuario de prueba al inicio si la base de datos está vacía.
 */
@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    /**
     * Hook del ciclo de vida de NestJS que se ejecuta cuando el módulo termina
     * de inicializarse. Aquí aprovechamos para crear el usuario de prueba.
     */
    async onModuleInit(): Promise<void> {
        await this.seedDefaultUser();
    }

    /**
     * Crea un usuario administrador de prueba si la tabla está vacía.
     * De este modo siempre existe al menos una cuenta con la que probar el login.
     *
     * Credenciales de prueba:
     *   usuario:    admin
     *   contraseña: Admin123!
     */
    private async seedDefaultUser(): Promise<void> {
        const count = await this.usersRepository.count();

        if (count === 0) {
            // bcrypt.hash(contraseña, saltRounds) — 10 rounds es el estándar recomendado
            const hashedPassword = await bcrypt.hash('Admin123!', 10);

            const user = this.usersRepository.create({
                username: 'admin',
                password: hashedPassword,
            });

            await this.usersRepository.save(user);
            console.log('✔ Usuario de prueba creado → usuario: admin | contraseña: Admin123!');
        }
    }

    /**
     * Busca un usuario activo por su nombre de usuario.
     * Devuelve undefined si no existe o si la cuenta está desactivada.
     *
     * @param username - Nombre de usuario a buscar
     */
    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { username, isActive: true },
        });
    }
}
