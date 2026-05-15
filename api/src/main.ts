import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { json, Request, Response, NextFunction } from 'express';
import { AppModule } from './modules/app.module';
import { CustomExceptionFilter } from './utilities/custom-exception-filter';
import './utilities/open-telemetry-init'; // required for side effects
import * as opentelemetry from '@opentelemetry/api';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn', 'log', 'debug']
        : process.env.USE_WINSTON === 'TRUE'
        ? WinstonModule.createLogger({
            instance: winstonLogger,
          })
        : ['error', 'warn', 'log'],
  });
  if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    const meter = opentelemetry.metrics.getMeter('metrics.interceptor');
    const request_counter = meter.createCounter(
      'metrics.interceptor.request_counter',
    );
    const request_duration_ms = meter.createHistogram(
      'metrics.interceptor.request_duration_ms',
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration_ms = Date.now() - start;
        // https://docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html
        const metric_attributes = {
          host: req.get('Host'),
          x_forwarded_proto: req.get('X-Forwarded-Proto'),
          x_forwarded_port: req.get('X-Forwarded-Port'),
          method: req.method,
          path: req.path,
          response_code: res.statusCode,
        };
        const log_attributes = {
          ...metric_attributes,
          x_forwarded_for: req.get('X-Forwarded-For'),
          remote_ip: req.ip,
        };
        request_counter.add(1, metric_attributes);
        request_duration_ms.record(duration_ms, metric_attributes);
        console.log(`${JSON.stringify(log_attributes)} took ${duration_ms}ms`);
      });
      next();
    });
  }
  const allowList = process.env.CORS_ORIGINS || [];
  const allowListRegex = process.env.CORS_REGEX
    ? JSON.parse(process.env.CORS_REGEX)
    : [];
  const regexAllowList = allowListRegex.map((regex) => {
    return new RegExp(regex);
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  const logger: Logger = app.get(Logger);
  app.useGlobalFilters(new CustomExceptionFilter(httpAdapter, logger));
  app.enableCors((req, cb) => {
    const options = {
      credentials: true,
      origin: false,
    };

    if (
      allowList.indexOf(req.header('Origin')) !== -1 ||
      regexAllowList.some((regex) => regex.test(req.header('Origin')))
    ) {
      options.origin = true;
    }
    cb(null, options);
  });
  app.use(
    cookieParser(),
    compression({
      filter: (_, res) => {
        return res.req.route?.path === '/applications/csv';
      },
    }),
  );
  app.use(json({ limit: '50mb' }));
  const config = new DocumentBuilder()
    .setTitle('Bloom API')
    .setDescription('The API for Bloom')
    .setVersion('2.0')
    .addTag('listings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Add passkey as an optional header to all endpoints
  Object.values(document.paths).forEach((path) => {
    Object.values(path).forEach((method) => {
      method.parameters = [
        ...(method.parameters || []),
        {
          in: 'header',
          name: 'passkey',
          description: 'Pass key',
          required: false,
        },
      ];
    });
  });
  SwaggerModule.setup('api', app, document);
  const configService: ConfigService = app.get(ConfigService);

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
