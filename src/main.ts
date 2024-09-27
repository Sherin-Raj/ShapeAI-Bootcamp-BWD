import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config(); // Load environment variables

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Initialize Firebase or other services if needed
  // initFirebase(); // Uncomment if you have a firebase setup

  // Rate limiting middleware

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bookeezy') // Customize title as needed
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('App')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
