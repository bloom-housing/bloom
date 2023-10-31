import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';
import { CustomExceptionFilter } from './utilities/custom-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log'],
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CustomExceptionFilter(httpAdapter));
  app.enableCors();
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Bloom API')
    .setDescription('The API for Bloom')
    .setVersion('2.0')
    .addTag('listings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
