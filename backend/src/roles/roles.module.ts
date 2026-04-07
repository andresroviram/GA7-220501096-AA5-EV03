import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Rol, Permiso])],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule { }
