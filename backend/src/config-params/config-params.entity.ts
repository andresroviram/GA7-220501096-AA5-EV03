import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Fila única (id = 1) con los parámetros globales del sistema.
 * Se crea/actualiza via PUT /config/params.
 */
@Entity('config_params')
export class ConfigParams {
    @PrimaryColumn({ default: 1 })
    id: number;

    @Column({ length: 200, default: 'Institución Educativa' })
    institucion: string;

    @Column({ length: 50, default: '2025-I' })
    cicloActual: string;

    @Column({ type: 'integer', default: 35 })
    maxEstPorGrupo: number;

    @Column({ length: 100, default: '' })
    correoContacto: string;

    @Column({ type: 'float', default: 0 })
    escalaMin: number;

    @Column({ type: 'float', default: 10 })
    escalaMax: number;

    @Column({ type: 'float', default: 6 })
    notaAprobatoria: number;
}
