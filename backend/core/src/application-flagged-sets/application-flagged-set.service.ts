import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import {
  ApplicationFlaggedSetCreateDto,
  ApplicationFlaggedSetUpdateDto,
} from "./dto/application-flagged-set.dto"

export class ApplicationFlaggedSetService extends AbstractServiceFactory<
  ApplicationFlaggedSet,
  ApplicationFlaggedSetCreateDto,
  ApplicationFlaggedSetUpdateDto
>(ApplicationFlaggedSet) {}
