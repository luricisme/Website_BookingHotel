import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger/logger.fn.middleware';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api', { exclude: ['/callback'] });
  //app.use(logger); //use global middleware

  const configDocument = new DocumentBuilder()
    .setTitle('BookaStay API')
    .setDescription('The BookaStay API Document')
    .setVersion('1.0')
    .addTag('bookastay')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(port);
}
bootstrap();
