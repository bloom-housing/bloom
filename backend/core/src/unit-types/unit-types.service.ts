import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"
import { UnitType } from "./entities/unit-type.entity"
import { UnitTypeCreateDto, UnitTypeUpdateDto } from "./dto/unit-type.dto"

@Injectable()
export class UnitTypesService extends AbstractServiceFactory<
  UnitType,
  UnitTypeCreateDto,
  UnitTypeUpdateDto
>(UnitType) {}
