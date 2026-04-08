import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reporte')
export class Reporte {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    tipo: string;

    @Column({ length: 200 })
    descripcion: string;

    @Column({ type: 'varchar', length: 20 })
    fecha: string;

    @Column({ length: 100 })
    generadoPor: string;

    @Column({ length: 10 })
    formato: string;
}
