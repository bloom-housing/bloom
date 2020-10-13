import { ApplicationMethod } from "../entity/application-method.entity"
import { ApplicationMethodCreateDto } from "./application-method.create.dto"
import { ApplicationMethodUpdateDto } from "./application-method.update.dto"
import { AbstractServiceFactory } from "../shared/abstract-service"

export class ApplicationMethodsService extends AbstractServiceFactory<
  ApplicationMethod,
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto
>(ApplicationMethod) {}
