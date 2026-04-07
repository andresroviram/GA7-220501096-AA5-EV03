import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('calificacion')
export class Calificacion {
    @PrimaryGeneratedColumn()
    id_calificacion: number;

    /** FK a Alumno */
    @Column()
    id_alumno: number;

    /** FK a Materia */
    @Column()
    id_materia: number;

    /** Nota entre 0.00 y 10.00 */
    @Column({ type: 'float' })
    valor: number;

    /** Formato 'YYYY-MM-DD' */
    @Column({ type: 'varchar' })
    fecha_registro: string;
}
