import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Materia } from '../materias/materia.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Materia])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }

imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
        controllers: [UsersController],
            exports: [UsersService],
})
export class UsersModule { }
