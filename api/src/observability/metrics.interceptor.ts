import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as opentelemetry from '@opentelemetry/api';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  meter: opentelemetry.Meter;
  request_counter: opentelemetry.Counter;
  request_duration_ms: opentelemetry.Histogram;

  constructor() {
    this.meter = opentelemetry.metrics.getMeter('metrics.interceptor');
    this.request_counter = this.meter.createCounter(
      'metrics.interceptor.request_counter',
    );
    this.request_duration_ms = this.meter.createHistogram(
      'metrics.interceptor.request_duration_ms',
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const attributes = {
      controller: context.getClass().name,
      handler: context.getHandler().name,
      protocol: context.getType(),
    };
    const httpContext = context.switchToHttp();
    attributes['http_method'] = httpContext.getRequest<Request>().method;

    return next.handle().pipe(
      tap(() => {
        const duration_ms = Date.now() - start;
        attributes['response_code'] =
          httpContext.getResponse<Response>().statusCode;

        this.request_counter.add(1, attributes);
        this.request_duration_ms.record(duration_ms, attributes);
      }),
    );
  }
}
