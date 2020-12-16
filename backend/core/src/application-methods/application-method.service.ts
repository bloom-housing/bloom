import { ApplicationMethod } from "./entities/application-method.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import {
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto,
} from "./dto/application-method.dto"

export class ApplicationMethodsService extends AbstractServiceFactory<
  ApplicationMethod,
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto
>(ApplicationMethod) {}
