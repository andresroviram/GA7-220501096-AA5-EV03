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

    @Column({ length: 100, nullable: true })
    email: string;

    @Column({ length: 20, nullable: true })
    telefono: string;

    @Column({ length: 200, nullable: true })
    direccion: string;

    /** Nombre del tutor/padre */
    @Column({ length: 100, nullable: true })
    tutor: string;

    @Column({ length: 20, nullable: true })
    tutor_telefono: string;

    /** Promedio general del alumno */
    @Column({ type: 'float', nullable: true })
    promedio: number;

    /** Estado: 'Activo' | 'Inactivo' | 'Suspendido' */
    @Column({ type: 'varchar', length: 20, default: 'Activo' })
    estado: string;
}
