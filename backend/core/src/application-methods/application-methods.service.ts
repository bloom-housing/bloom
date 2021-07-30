import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"
import { ApplicationMethod } from "./entities/application-method.entity"
import {
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto,
} from "./dto/application-method.dto"

@Injectable()
export class ApplicationMethodsService extends AbstractServiceFactory<
  ApplicationMethod,
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto
>(ApplicationMethod) {}
