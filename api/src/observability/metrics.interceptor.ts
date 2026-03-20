import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import * as opentelemetry from '@opentelemetry/api';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  meter: opentelemetry.Meter
  request_counter: opentelemetry.Counter
  request_latency: opentelemetry.Histogram

  constructor() {
    this.meter = opentelemetry.metrics.getMeter('metrics.interceptor')
    this.request_counter = this.meter.createCounter('metrics.interceptor.request_counter')
    this.request_latency = this.meter.createHistogram('metrics.interceptor.request_latency')
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const attributes = {
      "controller": context.getClass().name,
      "method": context.getHandler().name,
      "protocol": context.getType()
    }
    return next
      .handle()
      .pipe(
        tap(() => {
          const latency = Date.now() - start
          const httpContext = context.switchToHttp();
          attributes["response_code"] = httpContext.getResponse<Response>().statusCode

          this.request_counter.add(1, attributes)
          this.request_latency.record(latency, attributes)
        }),
      );
  }
}

