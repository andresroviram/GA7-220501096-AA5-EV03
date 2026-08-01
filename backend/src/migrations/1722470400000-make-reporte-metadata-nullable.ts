import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MakeReporteMetadataNullable1722470400000 implements MigrationInterface {
    name = 'MakeReporteMetadataNullable1722470400000';

    async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('reporte');
        if (!table) return;
        const additions: Array<[string, TableColumn]> = [
            ['tipoId', new TableColumn({ name: 'tipoId', type: 'integer', isNullable: true })],
            ['generadoPorId', new TableColumn({ name: 'generadoPorId', type: 'integer', isNullable: true })],
            ['grupoId', new TableColumn({ name: 'grupoId', type: 'integer', isNullable: true })],
            ['periodo', new TableColumn({ name: 'periodo', type: 'varchar', length: '100', isNullable: true })],
            ['archivo', new TableColumn({ name: 'archivo', type: 'bytea', isNullable: true })],
        ];
        for (const [name, column] of additions) if (!table.findColumnByName(name)) await queryRunner.addColumn('reporte', column);
        for (const name of ['tipo', 'descripcion', 'fecha', 'generadoPor', 'formato']) {
            const current = (await queryRunner.getTable('reporte'))?.findColumnByName(name);
            if (current && !current.isNullable) await queryRunner.query(`ALTER TABLE "reporte" ALTER COLUMN "${name}" DROP NOT NULL`);
        }
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        // Historical rows may contain null metadata, so making columns required again is unsafe.
        for (const name of ['archivo', 'periodo', 'grupoId', 'generadoPorId', 'tipoId']) {
            const column = (await queryRunner.getTable('reporte'))?.findColumnByName(name);
            if (column) await queryRunner.dropColumn('reporte', column);
        }
    }
}
