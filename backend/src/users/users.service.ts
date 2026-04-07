import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, TipoUsuario } from './user.entity';
import { Materia } from '../materias/materia.entity';
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
        @InjectRepository(Materia)
        private readonly materiaRepo: Repository<Materia>,
    ) { }

    /** Busca usuario activo por correo (usado por AuthService y JwtStrategy) */
    async findByCorreo(correo: string): Promise<User | undefined> {
        return this.repo.findOne({ where: { correo, isActive: true } }) as Promise<User | undefined>;
    }

    /** Busca usuario activo por id (usado por JwtStrategy) */
    async findById(id: number): Promise<User | undefined> {
        return this.repo.findOne({ where: { id, isActive: true } }) as Promise<User | undefined>;
    }

    /** Lista usuarios — opcionalmente filtrada por tipo.
     * Cuando tipo='docente' enriquece con materias[] asignadas.
     */
    async findAll(tipo?: TipoUsuario): Promise<any[]> {
        const users = tipo
            ? await this.repo.find({ where: { tipo_usuario: tipo } })
            : await this.repo.find();

        // Cargar materias asignadas a cada docente
        const materias = await this.materiaRepo.find();

        return users.map((u) => {
            const { password: _p, ...rest } = u;
            const userMaterias = materias
                .filter((m) => m.id_docente === u.id)
                .map((m) => m.nombre);
            return {
                id: u.id,
                nombre: `${u.nombre} ${u.apellido}`,
                cedula: u.cedula ?? '',
                departamento: u.departamento ?? '',
                email: u.correo,
                telefono: u.telefono ?? '',
                estado: u.isActive ? 'Activo' : 'Inactivo',
                fechaIngreso: u.fecha_ingreso ?? '',
                tipo_usuario: u.tipo_usuario,
                materias: userMaterias,
            };
        });
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
