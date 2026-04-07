import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

@Entity('horario')
export class Horario {
    @PrimaryGeneratedColumn()
    id_horario: number;

    @Column({
        type: 'simple-enum',
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    })
    dia_semana: DiaSemana;

    /** Formato 'HH:MM' */
    @Column({ type: 'varchar', length: 5 })
    hora_inicio: string;

    /** Formato 'HH:MM' */
    @Column({ type: 'varchar', length: 5 })
    hora_fin: string;
}
