import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('materia')
export class Materia {
    @PrimaryGeneratedColumn()
    id_materia: number;

    @Column({ length: 100 })
    nombre: string;

    /** FK a Usuario (tipo_usuario = 'docente') */
    @Column({ nullable: true })
    id_docente: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    departamento: string;

    @Column({ type: 'integer', default: 3 })
    creditos: number;

    /** Estado: 'Activo' | 'Inactivo' */
    @Column({ type: 'varchar', length: 20, default: 'Activo' })
    estado: string;
}
