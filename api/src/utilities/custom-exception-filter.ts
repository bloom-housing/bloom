import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';

/*
    This creates a simple custom catch all exception filter for us
    As for right now its just a pass through, but as we find more errors that we don't want the 
    front end to be exposed to this will grow
*/
@Catch()
export class CustomExceptionFilter extends BaseExceptionFilter {
  logger: Logger;
  constructor(httpAdapter: AbstractHttpAdapter, logger: Logger) {
    super(httpAdapter);
    this.logger = logger;
  }
  catch(exception: any, host: ArgumentsHost) {
    this.logger.error({
      message: exception?.response?.message,
      stack: exception.stack,
      exception,
    });
    super.catch(exception, host);
  }
}
