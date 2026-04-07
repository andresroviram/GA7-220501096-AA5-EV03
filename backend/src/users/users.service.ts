import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, TipoUsuario } from './user.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';

/**
 * UsersService — lógica de negocio relacionada con los usuarios.
 *
 * Responsabilidades:
 *  - Consultar usuarios por nombre de usuario (usado por AuthService).
 *  - Sembrar un usuario de prueba al inicio si la base de datos está vacía.
 */
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    /** Busca usuario activo por correo (usado por AuthService y JwtStrategy) */
    async findByCorreo(correo: string): Promise<User | undefined> {
        return this.repo.findOne({ where: { correo, isActive: true } }) as Promise<User | undefined>;
    }

    /** Busca usuario activo por id (usado por JwtStrategy) */
    async findById(id: number): Promise<User | undefined> {
        return this.repo.findOne({ where: { id, isActive: true } }) as Promise<User | undefined>;
    }

    /** Lista usuarios — opcionalmente filtrada por tipo */
    findAll(tipo?: TipoUsuario): Promise<User[]> {
        if (tipo) return this.repo.find({ where: { tipo_usuario: tipo } });
        return this.repo.find();
    }

    async findOne(id: number): Promise<User> {
        const u = await this.repo.findOne({ where: { id } });
        if (!u) throw new NotFoundException(`Usuario #${id} no encontrado`);
        return u;
    }

    /** Crea un usuario. Lanza ConflictException si el correo ya existe. */
    async createUser(dto: CreateUsuarioDto): Promise<Omit<User, 'password'>> {
        const existing = await this.repo.findOne({ where: { correo: dto.correo } });
        if (existing) throw new ConflictException('El correo ya está registrado');

        const hashed = await bcrypt.hash(dto.password, 10);
        const saved = await this.repo.save(
            this.repo.create({ ...dto, password: hashed }),
        );
        const { password: _p, ...result } = saved;
        return result;
    }

    async updateUser(id: number, dto: UpdateUsuarioDto): Promise<Omit<User, 'password'>> {
        await this.findOne(id);
        await this.repo.update(id, dto);
        const updated = await this.findOne(id);
        const { password: _p, ...result } = updated;
        return result;
    }

    async removeUser(id: number): Promise<void> {
        await this.findOne(id);
        await this.repo.delete(id);
    }
}
