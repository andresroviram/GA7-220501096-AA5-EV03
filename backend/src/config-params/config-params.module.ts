import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigParams } from './config-params.entity';
import { ConfigParamsService } from './config-params.service';
import { ConfigParamsController } from './config-params.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ConfigParams])],
    providers: [ConfigParamsService],
    controllers: [ConfigParamsController],
    exports: [ConfigParamsService],
})
export class ConfigParamsModule { }
