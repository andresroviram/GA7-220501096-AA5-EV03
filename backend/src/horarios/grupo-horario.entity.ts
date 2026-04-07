import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/** Tabla de relación Grupo-Horario (N:N) con atributos extra si se necesitan */
@Entity('grupo_horario')
export class GrupoHorario {
    @PrimaryGeneratedColumn()
    id_grupo_horario: number;

    /** FK a Grupo */
    @Column()
    id_grupo: number;

    /** FK a Horario */
    @Column()
    id_horario: number;

    /** Materia que se imparte en este bloque */
    @Column({ type: 'varchar', length: 100, nullable: true })
    materia: string;

    /** Docente asignado al bloque */
    @Column({ type: 'varchar', length: 100, nullable: true })
    docente: string;

    /** Aula donde se imparte */
    @Column({ type: 'varchar', length: 20, nullable: true })
    aula: string;

    /** Estado: 'Activo' | 'Conflicto' */
    @Column({ type: 'varchar', length: 20, default: 'Activo' })
    estado: string;
}
