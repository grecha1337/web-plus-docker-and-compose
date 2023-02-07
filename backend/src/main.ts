import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'https://mysuperfront.students.nomoredomains.icu',
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
console.log('POSTGRES_USER', process.env.POSTGRES_USER);
bootstrap();
