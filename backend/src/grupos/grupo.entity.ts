import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('grupo')
export class Grupo {
    @PrimaryGeneratedColumn()
    id_grupo: number;

    @Column({ length: 20 })
    nombre: string;

    @Column({ length: 10 })
    grado: string;
}
