import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('autenticacion_log')
export class AutenticacionLog {
    @PrimaryGeneratedColumn()
    id_log: number;

    /** FK a Usuario */
    @Column()
    id_usuario: number;

    @CreateDateColumn()
    fecha: Date;

    @Column({ type: 'enum', enum: ['exitoso', 'fallido'] })
    resultado: 'exitoso' | 'fallido';
}
