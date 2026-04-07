import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type TipoUsuario = 'administrativo' | 'docente' | 'padre';

/**
 * Entidad User — tabla 'usuario' según el modelo de datos del sistema.
 */
@Entity('usuario')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nombre: string;

    @Column({ length: 50 })
    apellido: string;

    /** Correo electrónico — se usa como identificador de login */
    @Column({ length: 100, unique: true })
    correo: string;

    /** Hash bcrypt de la contraseña — nunca se expone en respuestas */
    @Column({ length: 255 })
    password: string;

    @Column({
        type: 'simple-enum',
        enum: ['administrativo', 'docente', 'padre'],
        default: 'administrativo',
    })
    tipo_usuario: TipoUsuario;

    @Column({ length: 20, nullable: true })
    telefono: string;

    /** Permite desactivar la cuenta sin borrarla */
    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
