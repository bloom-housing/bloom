import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"
import {
  UnitAccessibilityPriorityTypeCreateDto,
  UnitAccessibilityPriorityTypeUpdateDto,
} from "./dto/unit-accessibility-priority-type.dto"
import { UnitAccessibilityPriorityType } from "./entities/unit-accessibility-priority-type.entity"

@Injectable()
export class UnitAccessibilityPriorityTypesService extends AbstractServiceFactory<
  UnitAccessibilityPriorityType,
  UnitAccessibilityPriorityTypeCreateDto,
  UnitAccessibilityPriorityTypeUpdateDto
>(UnitAccessibilityPriorityType) {}
