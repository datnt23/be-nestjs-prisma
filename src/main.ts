import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './middleware/logger.middleware';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(logger);
  app.enableCors();
  await app.listen(port || 3000);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
