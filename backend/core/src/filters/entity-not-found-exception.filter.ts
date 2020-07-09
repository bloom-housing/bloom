import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common"
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError"

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(404).json({ message: exception.message })
  }
}
