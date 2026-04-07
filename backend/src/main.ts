import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Función de arranque principal de la aplicación NestJS.
 * Configura CORS, validación global y levanta el servidor HTTP.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS para aceptar peticiones del frontend React (Vite corre en :5173)
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    // Pipeline de validación global: rechaza DTOs con datos inválidos automáticamente
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,      // Elimina propiedades no declaradas en el DTO
            forbidNonWhitelisted: true, // Lanza error si llegan propiedades extra
        }),
    );

    // Configuración de Swagger UI
    // Disponible en http://localhost:<port>/api
    const swaggerConfig = new DocumentBuilder()
        .setTitle('SIA Service API')
        .setDescription('API — GA7-220501096-AA5-EV03')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'access-token', // nombre del esquema para referenciar con @ApiBearerAuth()
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    // Monta la UI en /api
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Servidor de autenticación ejecutándose en http://localhost:${port}`);
    console.log(`Swagger UI disponible en http://localhost:${port}/api`);
}

bootstrap();
