import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

/**
 * UsersModule — encapsula la entidad User y su servicio.
 * Exporta UsersService para que AuthModule pueda usarlo en la validación.
 */
@Module({
    imports: [
        // Registra el repositorio TypeORM de User en el contexto de este módulo
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UsersService],
    exports: [UsersService], // Disponible para otros módulos (p. ej. AuthModule)
})
export class UsersModule { }
