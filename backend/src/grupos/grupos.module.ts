import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './grupo.entity';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Grupo])],
    providers: [GruposService],
    controllers: [GruposController],
    exports: [GruposService],
})
export class GruposModule { }
