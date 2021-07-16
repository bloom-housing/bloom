import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"
import { UnitRentType } from "./entities/unit-rent-type.entity"
import { UnitRentTypeCreateDto, UnitRentTypeUpdateDto } from "./dto/unit-rent-type.dto"

@Injectable()
export class UnitRentTypesService extends AbstractServiceFactory<
  UnitRentType,
  UnitRentTypeCreateDto,
  UnitRentTypeUpdateDto
>(UnitRentType) {}
