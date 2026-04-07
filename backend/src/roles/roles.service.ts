import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';
import { UpdateRolPermisosDto } from './dto/roles.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
        @InjectRepository(Permiso) private readonly permisoRepo: Repository<Permiso>,
    ) { }

    /** Devuelve todos los roles con sus permisos. */
    findAll(): Promise<Rol[]> {
        return this.rolRepo.find({ relations: ['permisos'] });
    }

    /** Actualiza los permisos de un rol (reemplaza todos). El rol 1 (Admin) es de solo lectura. */
    async updatePermisos(rolId: number, dto: UpdateRolPermisosDto): Promise<Rol> {
        const rol = await this.rolRepo.findOne({ where: { id: rolId } });
        if (!rol) throw new NotFoundException(`Rol #${rolId} no encontrado`);

        // El administrador siempre tiene acceso total — no se modifica
        if (rolId === 1) return this.rolRepo.findOne({ where: { id: 1 }, relations: ['permisos'] });

        // Borrar permisos anteriores del rol
        await this.permisoRepo.delete({ id_rol: rolId });

        // Insertar los nuevos
        const nuevos = dto.permisos.map((p) =>
            this.permisoRepo.create({ id_rol: rolId, modulo: p.modulo, acceso: p.acceso }),
        );
        await this.permisoRepo.save(nuevos);

        if (dto.descripcion !== undefined) {
            await this.rolRepo.update(rolId, { descripcion: dto.descripcion });
        }

        return this.rolRepo.findOne({ where: { id: rolId }, relations: ['permisos'] });
    }
}
