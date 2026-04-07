import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Permiso } from './permiso.entity';

/**
 * Roles del sistema (Administrador, Docente, etc.)
 * El id 1 = Administrador — siempre tiene acceso total y no es editable.
 */
@Entity('rol')
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 60, unique: true })
    nombre: string;

    @Column({ length: 200, default: '' })
    descripcion: string;

    @OneToMany(() => Permiso, (p) => p.rol, { cascade: true, eager: true })
    permisos: Permiso[];
}
