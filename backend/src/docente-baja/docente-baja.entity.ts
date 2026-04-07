import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('docente_baja')
export class DocenteBaja {
    @PrimaryGeneratedColumn()
    id_docente_baja: number;

    /** FK a Usuario (tipo_usuario = 'docente') */
    @Column()
    id_docente: number;

    /** Formato 'YYYY-MM-DD' */
    @Column({ type: 'varchar' })
    fecha_baja: string;

    @Column({ type: 'text', nullable: true })
    motivo: string;
}
