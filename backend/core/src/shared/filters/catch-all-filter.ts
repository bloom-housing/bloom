import { ArgumentsHost, Catch } from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"

@Catch()
export class CatchAllFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error({ message: exception?.response?.message, stack: exception.stack, exception })
    if (exception.name === "EntityNotFound") {
      const response = host.switchToHttp().getResponse()
      response.status(404).json({ message: exception.message })
    } else {
      super.catch(exception, host)
    }
  }
}
