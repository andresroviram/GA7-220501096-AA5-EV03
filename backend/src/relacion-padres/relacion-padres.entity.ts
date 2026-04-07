import { Entity, Column, PrimaryColumn } from 'typeorm';

/** 
 * Relación N:N entre padres (Usuario tipo 'padre') y alumnos.
 * PK compuesta: id_padre + id_alumno.
 */
@Entity('relacion_padres')
export class RelacionPadres {
    @PrimaryColumn()
    id_padre: number;

    @PrimaryColumn()
    id_alumno: number;

    @Column({ length: 30 })
    parentesco: string;
}
