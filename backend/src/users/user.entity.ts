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
        type: 'enum',
        enum: ['administrativo', 'docente', 'padre'],
        default: 'administrativo',
    })
    tipo_usuario: TipoUsuario;

    @Column({ length: 20, nullable: true })
    telefono: string;

    /** Token de recuperación de contraseña (expira en 15 min) */
    @Column({ length: 16, nullable: true })
    resetToken: string | null;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiry: Date | null;

    /** Permite desactivar la cuenta sin borrarla */
    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
