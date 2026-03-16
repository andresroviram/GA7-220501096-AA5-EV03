import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Servidor de autenticación ejecutándose en http://localhost:${port}`);
}

bootstrap();
