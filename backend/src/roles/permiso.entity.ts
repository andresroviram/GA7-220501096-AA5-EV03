import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';

/**
 * Un permiso = combinación rol × módulo × acceso (booleano).
 */
@Entity('permiso')
export class Permiso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_rol: number;

    @ManyToOne(() => Rol, (r) => r.permisos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_rol' })
    rol: Rol;

    /** Nombre del módulo: 'Dashboard' | 'Docentes' | etc. */
    @Column({ length: 60 })
    modulo: string;

    @Column({ type: 'boolean', default: false })
    acceso: boolean;
}
