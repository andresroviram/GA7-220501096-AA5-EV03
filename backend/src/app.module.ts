import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

/**
 * Módulo raíz de la aplicación.
 * Configura la conexión a la base de datos SQLite y registra los módulos de la app.
 */
@Module({
    imports: [
        // Conexión a SQLite mediante TypeORM.
        // synchronize:true crea/actualiza las tablas automáticamente según las entidades
        // (solo recomendado en desarrollo; en producción usar migraciones).
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [User],
            synchronize: true,
        }),

        // Módulo de usuarios: entidad User y servicio de consulta
        UsersModule,

        // Módulo de autenticación: endpoint /auth/login, JWT y validación de credenciales
        AuthModule,
    ],
})
export class AppModule { }
