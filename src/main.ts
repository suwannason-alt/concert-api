import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
  console.log(`App started on port 4000`);
}
bootstrap();
