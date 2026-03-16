import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

/**
 * Entidad User — representa la tabla "users" en la base de datos SQLite.
 *
 * Campos:
 *   id         — clave primaria autoincremental
 *   username   — nombre de usuario único
 *   password   — hash bcrypt de la contraseña (nunca texto plano)
 *   isActive   — permite desactivar cuentas sin borrarlas
 *   createdAt  — fecha de creación del registro
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    /** Nombre de usuario — debe ser único en la tabla */
    @Column({ unique: true })
    username: string;

    /**
     * Contraseña almacenada como hash bcrypt.
     * Nunca se devuelve en respuestas de la API.
     */
    @Column()
    password: string;

    /** Indica si la cuenta está activa; las inactivas no pueden iniciar sesión */
    @Column({ default: true })
    isActive: boolean;

    /** Fecha y hora en que se creó el registro */
    @CreateDateColumn()
    createdAt: Date;
}
