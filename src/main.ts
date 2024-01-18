import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*', credentials: true },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    '/upload',
    express.static(path.join(__dirname, '..', 'public', 'upload')),
  );

  app.use(helmet());
  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
