import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alumno')
export class Alumno {
    @PrimaryGeneratedColumn()
    id_alumno: number;

    @Column({ length: 50 })
    nombre: string;

    @Column({ length: 50 })
    apellido: string;

    /** Almacenada como 'YYYY-MM-DD' */
    @Column({ type: 'varchar' })
    fecha_nacimiento: string;

    /** FK a Grupo */
    @Column({ nullable: false })
    id_grupo: number;
}
