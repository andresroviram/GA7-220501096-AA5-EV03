import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reporte')
export class Reporte {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: true })
    tipo: string;

    /** ID del tipo soportado; los registros históricos pueden no tenerlo. */
    @Column({ type: 'integer', nullable: true })
    tipoId: number | null;

    @Column({ length: 200, nullable: true })
    descripcion: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    fecha: string;

    @Column({ length: 100, nullable: true })
    generadoPor: string;

    /** Identidad persistida para restringir descargas de padres/acudientes. */
    @Column({ type: 'integer', nullable: true })
    generadoPorId: number | null;

    @Column({ length: 10, nullable: true })
    formato: string;

    @Column({ type: 'integer', nullable: true })
    grupoId: number | null;

    /** Metadato descriptivo: el modelo actual no relaciona períodos académicos. */
    @Column({ type: 'varchar', length: 100, nullable: true })
    periodo: string | null;

    /** Artifact generated at creation time; excluded from history queries. */
    @Column({ type: 'bytea', nullable: true, select: false })
    archivo: Buffer | null;
}
