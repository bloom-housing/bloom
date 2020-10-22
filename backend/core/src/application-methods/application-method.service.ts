import { ApplicationMethod } from "../entity/application-method.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import { ApplicationMethodCreateDto, ApplicationMethodUpdateDto } from "./application-method.dto"

export class ApplicationMethodsService extends AbstractServiceFactory<
  ApplicationMethod,
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto
>(ApplicationMethod) {}
