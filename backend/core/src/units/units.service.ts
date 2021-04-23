import { Unit } from "./entities/unit.entity"
import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { UnitCreateDto, UnitUpdateDto } from "./dto/unit.dto"

export class UnitsService extends AbstractServiceFactory<Unit, UnitCreateDto, UnitUpdateDto>(
  Unit
) {}
