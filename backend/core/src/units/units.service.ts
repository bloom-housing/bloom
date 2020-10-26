import { Unit } from "../entity/unit.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import { UnitCreateDto, UnitUpdateDto } from "./unit.dto"

export class UnitsService extends AbstractServiceFactory<Unit, UnitCreateDto, UnitUpdateDto>(
  Unit
) {}
