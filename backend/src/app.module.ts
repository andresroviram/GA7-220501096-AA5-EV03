import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { GruposModule } from './grupos/grupos.module';
import { HorariosModule } from './horarios/horarios.module';
import { MateriasModule } from './materias/materias.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { SeedModule } from './seed/seed.module';
import { ConfigParamsModule } from './config-params/config-params.module';
import { RolesModule } from './roles/roles.module';
import { ReportesModule } from './reportes/reportes.module';
// Entidades
import { User } from './users/user.entity';
import { Alumno } from './alumnos/alumno.entity';
import { Grupo } from './grupos/grupo.entity';
import { Horario } from './horarios/horario.entity';
import { GrupoHorario } from './horarios/grupo-horario.entity';
import { Materia } from './materias/materia.entity';
import { Calificacion } from './calificaciones/calificacion.entity';
import { AutenticacionLog } from './auth-log/autenticacion-log.entity';
import { RelacionPadres } from './relacion-padres/relacion-padres.entity';
import { DocenteBaja } from './docente-baja/docente-baja.entity';
import { ConfigParams } from './config-params/config-params.entity';
import { Rol } from './roles/rol.entity';
import { Permiso } from './roles/permiso.entity';
import { Reporte } from './reportes/reporte.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get<string>('DATABASE_URL'),
                ssl: config.get('NODE_ENV') === 'production'
                    ? { rejectUnauthorized: false }
                    : false,
                synchronize: true,
                extra: {
                    // Evita el DeprecationWarning de pg@8 por queries concurrentes
                    // durante la inicialización del pool de TypeORM
                    max: 10,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 2000,
                },
                entities: [
                    User,
                    Alumno,
                    Grupo,
                    Horario,
                    GrupoHorario,
                    Materia,
                    Calificacion,
                    AutenticacionLog,
                    RelacionPadres,
                    DocenteBaja,
                    ConfigParams,
                    Rol,
                    Permiso,
                    Reporte,
                ],
            }),
        }),
        UsersModule,
        AuthModule,
        AlumnosModule,
        GruposModule,
        HorariosModule,
        MateriasModule,
        CalificacionesModule,
        SeedModule,
        ConfigParamsModule,
        RolesModule,
        ReportesModule,
    ],
})
export class AppModule { }
