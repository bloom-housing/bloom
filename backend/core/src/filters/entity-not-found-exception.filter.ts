import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common"

@Catch()
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    console.error({ message: exception.response.message, stack: exception.stack, exception })
    response.status(404).json({ message: exception.message })
  }
}
